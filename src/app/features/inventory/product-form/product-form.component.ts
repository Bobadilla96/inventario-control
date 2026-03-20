import { NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../../../core/models/product.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { MOCK_CATEGORIES } from '../../../mocks/categories.mock';
import { AppState } from '../../../store/app.state';
import { selectAllProducts } from '../../../store/inventory/inventory.selectors';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, RouterLink],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  readonly categories = MOCK_CATEGORIES;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['Electronica', [Validators.required]],
    price: [10, [Validators.required, Validators.min(0.01)]],
    cost: [5, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    minStock: [5, [Validators.required, Validators.min(1)]],
    location: ['', [Validators.required, Validators.minLength(4)]],
    status: ['active' as 'active' | 'discontinued', [Validators.required]]
  });

  products: Product[] = [];
  editingProduct: Product | null = null;
  editId: number | null = null;
  skuPreview = '';
  isSaving = false;
  error = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly inventory: InventoryService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    destroyRef: DestroyRef
  ) {
    this.route.paramMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));
      this.editId = Number.isFinite(id) && id > 0 ? id : null;
      this.syncEditingProduct();
    });

    this.store
      .select(selectAllProducts)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((products) => {
        this.products = products;
        this.syncEditingProduct();
        this.updateSkuPreview();
      });

    this.form.controls.category.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => {
      this.updateSkuPreview();
    });
  }

  async submit(): Promise<void> {
    this.error = '';
    if (this.form.invalid || this.isSaving) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const value = this.form.getRawValue();

    if (this.editingProduct) {
      this.inventory.updateProduct({
        ...this.editingProduct,
        name: value.name.trim(),
        description: value.description.trim(),
        category: value.category,
        price: Number(value.price),
        cost: Number(value.cost),
        stock: Number(value.stock),
        minStock: Number(value.minStock),
        location: value.location.trim(),
        status: value.status
      });

      this.router.navigate(['/inventory']);
      return;
    }

    await this.inventory.createProduct({
      name: value.name,
      description: value.description,
      category: value.category,
      price: Number(value.price),
      cost: Number(value.cost),
      stock: Number(value.stock),
      minStock: Number(value.minStock),
      location: value.location,
      status: value.status
    });

    this.router.navigate(['/inventory']);
  }

  private syncEditingProduct(): void {
    if (!this.editId) {
      this.editingProduct = null;
      return;
    }

    const product = this.products.find((item) => item.id === this.editId) ?? null;
    if (!product || this.editingProduct?.id === product.id) {
      return;
    }

    this.editingProduct = product;

    this.form.patchValue({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      cost: product.cost,
      stock: product.stock,
      minStock: product.minStock,
      location: product.location,
      status: product.status
    });
  }

  private updateSkuPreview(): void {
    if (this.editingProduct) {
      this.skuPreview = this.editingProduct.sku;
      return;
    }

    this.skuPreview = this.inventory.generateSku(this.form.controls.category.value, this.products);
  }
}
