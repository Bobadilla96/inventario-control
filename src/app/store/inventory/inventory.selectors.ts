import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StockMovement } from '../../core/models/movement.model';
import { Product, StockLevel, getStockLevel } from '../../core/models/product.model';
import { INVENTORY_FEATURE_KEY, InventoryState } from './inventory.reducer';

const stockWeight: Record<StockLevel, number> = {
  out_of_stock: 0,
  critical: 1,
  low: 2,
  ok: 3
};

export const selectInventoryState = createFeatureSelector<InventoryState>(INVENTORY_FEATURE_KEY);

export const selectLoading = createSelector(selectInventoryState, (state) => state.loading);
export const selectError = createSelector(selectInventoryState, (state) => state.error);
export const selectFilter = createSelector(selectInventoryState, (state) => state.filter);
export const selectSort = createSelector(selectInventoryState, (state) => state.sort);
export const selectAllProducts = createSelector(selectInventoryState, (state) => state.products);
export const selectAllMovements = createSelector(selectInventoryState, (state) => state.movements);

export const selectLocations = createSelector(selectAllProducts, (products) =>
  Array.from(new Set(products.map((product) => product.location))).sort((a, b) => a.localeCompare(b))
);

export const selectFilteredProducts = createSelector(selectAllProducts, selectFilter, (products, filter) => {
  const term = filter.search.trim().toLowerCase();

  return products.filter((product) => {
    if (filter.category !== 'all' && product.category !== filter.category) {
      return false;
    }

    if (filter.location !== 'all' && product.location !== filter.location) {
      return false;
    }

    const level = getStockLevel(product);
    if (filter.stockLevel !== 'all' && filter.stockLevel !== level) {
      return false;
    }

    if (!term) {
      return true;
    }

    return (
      product.sku.toLowerCase().includes(term) ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term)
    );
  });
});

function compareValues(left: Product, right: Product, field: keyof Product | 'stockLevel'): number {
  if (field === 'stockLevel') {
    return stockWeight[getStockLevel(left)] - stockWeight[getStockLevel(right)];
  }

  const leftValue = left[field];
  const rightValue = right[field];

  if (typeof leftValue === 'number' && typeof rightValue === 'number') {
    return leftValue - rightValue;
  }

  return String(leftValue).localeCompare(String(rightValue));
}

export const selectSortedProducts = createSelector(selectFilteredProducts, selectSort, (products, sort) => {
  const sorted = [...products].sort((left, right) => compareValues(left, right, sort.field));
  return sort.direction === 'asc' ? sorted : sorted.reverse();
});

export const selectProductById = (productId: number) => createSelector(selectAllProducts, (products) =>
  products.find((product) => product.id === productId)
);

export const selectLowStockProducts = createSelector(selectAllProducts, (products) =>
  products.filter((product) => product.stock > 0 && product.stock <= product.minStock)
);

export const selectOutOfStockProducts = createSelector(selectAllProducts, (products) =>
  products.filter((product) => product.stock === 0)
);

export const selectCriticalProducts = createSelector(selectAllProducts, (products) =>
  products.filter((product) => product.stock > 0 && product.stock <= product.minStock * 0.5)
);

export const selectTotalInventoryValue = createSelector(selectAllProducts, (products) =>
  products.reduce((total, product) => total + product.stock * product.price, 0)
);

export const selectTotalInventoryCost = createSelector(selectAllProducts, (products) =>
  products.reduce((total, product) => total + product.stock * product.cost, 0)
);

export const selectProductsByCategory = createSelector(selectAllProducts, (products) => {
  const map = new Map<string, { category: string; count: number; totalStock: number; stockValue: number }>();

  products.forEach((product) => {
    const current = map.get(product.category) ?? {
      category: product.category,
      count: 0,
      totalStock: 0,
      stockValue: 0
    };

    current.count += 1;
    current.totalStock += product.stock;
    current.stockValue += product.stock * product.price;

    map.set(product.category, current);
  });

  return Array.from(map.values()).sort((a, b) => b.count - a.count);
});

export const selectMovementsByProduct = (productId: number) => createSelector(selectAllMovements, (movements) =>
  movements.filter((movement) => movement.productId === productId)
);

export const selectRecentMovements = (limit = 5) => createSelector(selectAllMovements, (movements) =>
  [...movements].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)
);

export const selectStockAlerts = createSelector(selectAllProducts, (products) => {
  const severity = (product: Product) => {
    const level = getStockLevel(product);
    if (level === 'out_of_stock') return 0;
    if (level === 'critical') return 1;
    if (level === 'low') return 2;
    return 3;
  };

  return products
    .filter((product) => getStockLevel(product) !== 'ok')
    .sort((left, right) => {
      const level = severity(left) - severity(right);
      if (level !== 0) return level;
      return left.stock - right.stock;
    });
});

export const selectTodayMovementCount = createSelector(selectAllMovements, (movements) => {
  const today = new Date().toISOString().slice(0, 10);
  return movements.filter((movement) => movement.date.slice(0, 10) === today).length;
});

export const selectTopProductsByValue = createSelector(selectAllProducts, (products) =>
  [...products]
    .map((product) => ({ ...product, inventoryValue: product.stock * product.price }))
    .sort((a, b) => b.inventoryValue - a.inventoryValue)
    .slice(0, 10)
);

export const selectMovementMapByProduct = createSelector(selectAllMovements, (movements) => {
  const map = new Map<number, StockMovement[]>();
  movements.forEach((movement) => {
    const list = map.get(movement.productId) ?? [];
    list.push(movement);
    map.set(movement.productId, list);
  });
  return map;
});
