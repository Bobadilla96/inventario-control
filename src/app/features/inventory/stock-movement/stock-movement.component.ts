import { AsyncPipe, DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { MovementType, StockMovement } from '../../../core/models/movement.model';
import { Product } from '../../../core/models/product.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { AppState } from '../../../store/app.state';
import { selectAllProducts, selectMovementsByProduct } from '../../../store/inventory/inventory.selectors';

@Component({
  selector: 'app-stock-movement',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NgIf, SlicePipe, ReactiveFormsModule, RouterLink],
  templateUrl: './stock-movement.component.html',
  styleUrl: './stock-movement.component.scss'
})
export class StockMovementComponent {
  readonly products$ = this.store.select(selectAllProducts);
  products: Product[] = [];

  readonly form = this.fb.nonNullable.group({
    productId: [0, [Validators.required, Validators.min(1)]],
    type: ['entrada' as MovementType, [Validators.required]],
    quantity: [1, [Validators.required]],
    reason: ['', [Validators.required, Validators.minLength(4)]]
  });

  selectedProduct: Product | null = null;
  movementHistory$: Observable<StockMovement[]> = of([]);
  message = '';
  error = '';
  loading = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly inventory: InventoryService,
    private readonly route: ActivatedRoute,
    destroyRef: DestroyRef
  ) {
    this.products$.pipe(takeUntilDestroyed(destroyRef)).subscribe((products) => {
      this.products = products;
      const productId = Number(this.form.controls.productId.value);
      this.selectedProduct = products.find((item) => item.id === productId) ?? null;
    });

    this.form.controls.productId.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((productId) => {
      if (!Number(productId)) {
        this.selectedProduct = null;
        this.movementHistory$ = of([]);
        return;
      }

      this.selectedProduct = this.products.find((item) => item.id === Number(productId)) ?? null;
      this.movementHistory$ = this.store.select(selectMovementsByProduct(Number(productId)));
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed(destroyRef)).subscribe((params) => {
      const productId = Number(params.get('productId'));
      if (Number.isFinite(productId) && productId > 0) {
        this.form.patchValue({ productId });
      }
    });
  }

  async submit(): Promise<void> {
    this.error = '';
    this.message = '';

    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;

    const value = this.form.getRawValue();
    const result = await this.inventory.registerMovement(
      Number(value.productId),
      value.type,
      Number(value.quantity),
      value.reason
    );

    this.loading = false;

    if (!result.ok) {
      this.error = result.error;
      return;
    }

    this.message = 'Movimiento registrado correctamente.';
    this.form.patchValue({ quantity: 1, reason: '' });
  }

  quantityHint(type: MovementType): string {
    if (type === 'ajuste') {
      return 'Ajuste admite positivos y negativos';
    }

    if (type === 'salida') {
      return 'Salida no puede superar el stock actual';
    }

    return 'Entrada incrementa el stock';
  }
}
