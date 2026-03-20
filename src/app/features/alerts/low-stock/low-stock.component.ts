import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product, getStockLevel } from '../../../core/models/product.model';
import { AppState } from '../../../store/app.state';
import { selectStockAlerts } from '../../../store/inventory/inventory.selectors';
import { StockIndicatorComponent } from '../../../shared/components/stock-indicator/stock-indicator.component';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, StockIndicatorComponent],
  templateUrl: './low-stock.component.html',
  styleUrl: './low-stock.component.scss'
})
export class LowStockComponent {
  readonly alerts$ = this.store.select(selectStockAlerts);

  constructor(
    private readonly store: Store<AppState>,
    private readonly router: Router
  ) {}

  severityLabel(product: Product): string {
    const level = getStockLevel(product);
    if (level === 'out_of_stock') {
      return 'Sin stock';
    }
    if (level === 'critical') {
      return 'Critico';
    }
    return 'Bajo';
  }

  missingUnits(product: Product): number {
    return Math.max(0, product.minStock - product.stock);
  }

  registerEntry(productId: number): void {
    this.router.navigate(['/inventory/movement'], { queryParams: { productId } });
  }
}
