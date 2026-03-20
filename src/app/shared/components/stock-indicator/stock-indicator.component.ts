import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Product, StockLevel, getStockLevel } from '../../../core/models/product.model';

@Component({
  selector: 'app-stock-indicator',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './stock-indicator.component.html',
  styleUrl: './stock-indicator.component.scss'
})
export class StockIndicatorComponent {
  @Input({ required: true }) product!: Product;
  @Input() compact = false;

  get level(): StockLevel {
    return getStockLevel(this.product);
  }

  get progress(): number {
    if (this.product.minStock <= 0) {
      return 100;
    }

    return Math.min(100, Math.round((this.product.stock / this.product.minStock) * 100));
  }

  get label(): string {
    if (this.level === 'ok') return 'OK';
    if (this.level === 'low') return 'LOW';
    if (this.level === 'critical') return 'CRITICAL';
    return 'OUT';
  }
}
