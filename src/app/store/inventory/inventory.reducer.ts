import { createReducer, on } from '@ngrx/store';
import { Product } from '../../core/models/product.model';
import { InventoryActions, InventoryFilter, InventorySort } from './inventory.actions';
import { StockMovement } from '../../core/models/movement.model';

export const INVENTORY_FEATURE_KEY = 'inventory';

export interface InventoryState {
  products: Product[];
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
  filter: InventoryFilter;
  sort: InventorySort;
}

const initialFilter: InventoryFilter = {
  category: 'all',
  stockLevel: 'all',
  search: '',
  location: 'all'
};

const initialSort: InventorySort = {
  field: 'stock',
  direction: 'asc'
};

export const initialInventoryState: InventoryState = {
  products: [],
  movements: [],
  loading: false,
  error: null,
  filter: initialFilter,
  sort: initialSort
};

export const inventoryReducer = createReducer(
  initialInventoryState,
  on(InventoryActions.loadInventory, (state) => ({ ...state, loading: true, error: null })),
  on(InventoryActions.loadInventorySuccess, (state, { products, movements }) => ({
    ...state,
    loading: false,
    products,
    movements,
    error: null
  })),
  on(InventoryActions.loadInventoryFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(InventoryActions.setFilter, (state, { filter }) => ({
    ...state,
    filter: { ...state.filter, ...filter }
  })),
  on(InventoryActions.clearFilters, (state) => ({
    ...state,
    filter: initialFilter
  })),
  on(InventoryActions.setSort, (state, { sort }) => ({ ...state, sort })),
  on(InventoryActions.createProduct, (state, { product }) => ({
    ...state,
    products: [product, ...state.products]
  })),
  on(InventoryActions.updateProduct, (state, { product }) => ({
    ...state,
    products: state.products.map((item) => (item.id === product.id ? product : item))
  })),
  on(InventoryActions.deleteProduct, (state, { productId }) => ({
    ...state,
    products: state.products.filter((item) => item.id !== productId)
  })),
  on(InventoryActions.registerMovement, (state, { movement }) => ({
    ...state,
    products: state.products.map((product) =>
      product.id === movement.productId
        ? {
            ...product,
            stock: movement.newStock,
            updatedAt: movement.date
          }
        : product
    ),
    movements: [movement, ...state.movements]
  }))
);
