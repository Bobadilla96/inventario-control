import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product, StockLevel, getStockLevel } from '../../../core/models/product.model';
import { ExportService } from '../../../core/services/export.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { MOCK_CATEGORIES } from '../../../mocks/categories.mock';
import { AppState } from '../../../store/app.state';
import { selectLocations, selectSortedProducts } from '../../../store/inventory/inventory.selectors';
import { ExportButtonComponent } from '../../../shared/components/export-button/export-button.component';
import { StockIndicatorComponent } from '../../../shared/components/stock-indicator/stock-indicator.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, ReactiveFormsModule, ExportButtonComponent, StockIndicatorComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
  readonly categories = MOCK_CATEGORIES;
  readonly locations$ = this.store.select(selectLocations);
  readonly filtersForm = this.fb.nonNullable.group({
    search: '',
    category: 'all',
    stockLevel: 'all',
    location: 'all'
  });

  products: Product[] = [];
  pagedProducts: Product[] = [];
  page = 1;
  readonly pageSize = 10;
  totalPages = 1;

  sortField: keyof Product | 'stockLevel' = 'stock';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<AppState>,
    private readonly inventory: InventoryService,
    private readonly exportService: ExportService,
    private readonly router: Router,
    destroyRef: DestroyRef
  ) {
    this.store
      .select(selectSortedProducts)
      .pipe(takeUntilDestroyed(destroyRef))
      .subscribe((products) => {
        this.products = products;
        this.totalPages = Math.max(1, Math.ceil(products.length / this.pageSize));
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
        this.updatePage();
      });

    this.filtersForm.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((value) => {
      this.page = 1;
      this.inventory.setFilters({
        search: value.search,
        category: value.category,
        stockLevel: value.stockLevel as StockLevel | 'all',
        location: value.location
      });
    });
  }

  get rangeStart(): number {
    if (this.products.length === 0) {
      return 0;
    }
    return (this.page - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.page * this.pageSize, this.products.length);
  }

  get visiblePages(): number[] {
    const maxVisible = 5;
    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  sortBy(field: keyof Product | 'stockLevel'): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = field === 'stock' ? 'asc' : 'desc';
    }

    this.inventory.setSort(this.sortField, this.sortDirection);
  }

  getSortState(field: keyof Product | 'stockLevel'): 'none' | 'asc' | 'desc' {
    if (this.sortField !== field) {
      return 'none';
    }

    return this.sortDirection;
  }

  goToPage(next: number): void {
    if (next < 1 || next > this.totalPages) {
      return;
    }

    this.page = next;
    this.updatePage();
  }

  openCreate(): void {
    this.router.navigate(['/inventory/new']);
  }

  editProduct(productId: number): void {
    this.router.navigate(['/inventory/edit', productId]);
  }

  registerMovement(productId: number): void {
    this.router.navigate(['/inventory/movement'], { queryParams: { productId } });
  }

  exportProductsCsv(): void {
    this.exportService.exportProductsCsv(this.products);
  }

  exportProductsPdf(): void {
    this.exportService.exportInventoryPdf(this.products);
  }

  level(product: Product): StockLevel {
    return getStockLevel(product);
  }

  private updatePage(): void {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.products.slice(start, end);
  }
}
