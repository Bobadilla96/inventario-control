import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, PercentPipe, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, map } from 'rxjs';
import { AppState } from '../../store/app.state';
import {
  selectAllProducts,
  selectLowStockProducts,
  selectProductsByCategory,
  selectRecentMovements,
  selectStockAlerts,
  selectTodayMovementCount,
  selectTopProductsByValue,
  selectTotalInventoryValue
} from '../../store/inventory/inventory.selectors';
import { StockIndicatorComponent } from '../../shared/components/stock-indicator/stock-indicator.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, PercentPipe, SlicePipe, StockIndicatorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly products$ = this.store.select(selectAllProducts);
  readonly lowStock$ = this.store.select(selectLowStockProducts);
  readonly alerts$ = this.store.select(selectStockAlerts);
  readonly totalValue$ = this.store.select(selectTotalInventoryValue);
  readonly todayMovements$ = this.store.select(selectTodayMovementCount);
  readonly categoryData$ = this.store.select(selectProductsByCategory);
  readonly topProducts$ = this.store.select(selectTopProductsByValue);

  readonly recentMovements$ = combineLatest([
    this.store.select(selectRecentMovements(5)),
    this.store.select(selectAllProducts)
  ]).pipe(
    map(([movements, products]) =>
      movements.map((movement) => ({
        ...movement,
        productName: products.find((product) => product.id === movement.productId)?.name ?? `Producto ${movement.productId}`
      }))
    )
  );

  constructor(private readonly store: Store<AppState>) {}
}
