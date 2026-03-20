import { AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectAllMovements, selectAllProducts, selectStockAlerts, selectTotalInventoryValue } from '../../../store/inventory/inventory.selectors';
import { ExportService } from '../../../core/services/export.service';
import { ExportButtonComponent } from '../../../shared/components/export-button/export-button.component';
import { Product } from '../../../core/models/product.model';
import { StockMovement } from '../../../core/models/movement.model';

@Component({
  selector: 'app-inventory-report',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, DatePipe, NgFor, NgIf, SlicePipe, ExportButtonComponent],
  templateUrl: './inventory-report.component.html',
  styleUrl: './inventory-report.component.scss'
})
export class InventoryReportComponent {
  readonly products$ = this.store.select(selectAllProducts);
  readonly movements$ = this.store.select(selectAllMovements);
  readonly alerts$ = this.store.select(selectStockAlerts);
  readonly totalValue$ = this.store.select(selectTotalInventoryValue);

  constructor(
    private readonly store: Store<AppState>,
    private readonly exportService: ExportService
  ) {}

  exportProductsCsv(products: Product[]): void {
    this.exportService.exportProductsCsv(products);
  }

  exportProductsPdf(products: Product[]): void {
    this.exportService.exportInventoryPdf(products);
  }

  exportMovementsCsv(movements: StockMovement[]): void {
    this.exportService.exportMovementsCsv(movements);
  }

  exportMovementsPdf(movements: StockMovement[]): void {
    this.exportService.exportMovementsPdf(movements);
  }
}
