import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Product, StockLevel } from '../../core/models/product.model';
import { StockMovement } from '../../core/models/movement.model';

export interface InventoryFilter {
  category: string | 'all';
  stockLevel: StockLevel | 'all';
  search: string;
  location: string | 'all';
}

export interface InventorySort {
  field: keyof Product | 'stockLevel';
  direction: 'asc' | 'desc';
}

export const InventoryActions = createActionGroup({
  source: 'Inventory',
  events: {
    'Load Inventory': emptyProps(),
    'Load Inventory Success': props<{ products: Product[]; movements: StockMovement[] }>(),
    'Load Inventory Failure': props<{ error: string }>(),
    'Set Filter': props<{ filter: Partial<InventoryFilter> }>(),
    'Clear Filters': emptyProps(),
    'Set Sort': props<{ sort: InventorySort }>(),
    'Create Product': props<{ product: Product }>(),
    'Update Product': props<{ product: Product }>(),
    'Delete Product': props<{ productId: number }>(),
    'Register Movement': props<{ movement: StockMovement }>()
  }
});
