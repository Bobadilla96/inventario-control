import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { firstValueFrom, map } from 'rxjs';
import { AppState } from '../../store/app.state';
import { InventoryActions } from '../../store/inventory/inventory.actions';
import { selectAllMovements, selectAllProducts } from '../../store/inventory/inventory.selectors';
import { StockMovement, MovementType } from '../models/movement.model';
import { Product } from '../models/product.model';
import { MOCK_CATEGORIES } from '../../mocks/categories.mock';
import { AuthService } from './auth.service';

export interface ProductPayload {
  name: string;
  description: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  location: string;
  status: 'active' | 'discontinued';
}

@Injectable({ providedIn: 'root' })
export class InventoryService {
  constructor(
    private readonly store: Store<AppState>,
    private readonly auth: AuthService
  ) {}

  initData(): void {
    this.store.dispatch(InventoryActions.loadInventory());
  }

  setFilters(filter: Partial<{ category: string | 'all'; stockLevel: any; search: string; location: string | 'all' }>): void {
    this.store.dispatch(InventoryActions.setFilter({ filter }));
  }

  clearFilters(): void {
    this.store.dispatch(InventoryActions.clearFilters());
  }

  setSort(field: keyof Product | 'stockLevel', direction: 'asc' | 'desc'): void {
    this.store.dispatch(InventoryActions.setSort({ sort: { field, direction } }));
  }

  async createProduct(payload: ProductPayload): Promise<Product> {
    const products = await firstValueFrom(this.store.select(selectAllProducts).pipe(map((items) => [...items])));
    const nextId = products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
    const now = new Date().toISOString();
    const sku = this.generateSku(payload.category, products);

    const product: Product = {
      id: nextId,
      sku,
      name: payload.name.trim(),
      description: payload.description.trim(),
      category: payload.category,
      stock: Number(payload.stock),
      minStock: Number(payload.minStock),
      price: Number(payload.price),
      cost: Number(payload.cost),
      location: payload.location.trim(),
      status: payload.status,
      createdAt: now,
      updatedAt: now
    };

    this.store.dispatch(InventoryActions.createProduct({ product }));
    return product;
  }

  updateProduct(product: Product): void {
    this.store.dispatch(InventoryActions.updateProduct({ product: { ...product, updatedAt: new Date().toISOString() } }));
  }

  deleteProduct(productId: number): void {
    this.store.dispatch(InventoryActions.deleteProduct({ productId }));
  }

  async registerMovement(productId: number, type: MovementType, quantityInput: number, reason: string): Promise<{ ok: true } | { ok: false; error: string }> {
    const products = await firstValueFrom(this.store.select(selectAllProducts).pipe(map((items) => [...items])));
    const product = products.find((item) => item.id === productId);

    if (!product) {
      return { ok: false, error: 'Producto no encontrado' };
    }

    const cleanReason = reason.trim();
    if (!cleanReason) {
      return { ok: false, error: 'Debes indicar un motivo' };
    }

    const quantity = Math.abs(Number(quantityInput));

    if (quantity <= 0 && type !== 'ajuste') {
      return { ok: false, error: 'La cantidad debe ser mayor a cero' };
    }

    if (type === 'salida' && quantity > product.stock) {
      return { ok: false, error: 'No hay stock suficiente para la salida' };
    }

    let movementQuantity = quantity;
    let newStock = product.stock;

    if (type === 'entrada') {
      movementQuantity = quantity;
      newStock = product.stock + quantity;
    }

    if (type === 'salida') {
      movementQuantity = -quantity;
      newStock = product.stock - quantity;
    }

    if (type === 'ajuste') {
      movementQuantity = Number(quantityInput);
      newStock = Math.max(0, product.stock + movementQuantity);
    }

    const movements = await firstValueFrom(this.store.select(selectAllMovements).pipe(map((items) => [...items])));
    const nextMovementId = movements.reduce((max, movement) => Math.max(max, movement.id), 0) + 1;

    const actor = this.auth.getCurrentUser();
    const movement: StockMovement = {
      id: nextMovementId,
      productId,
      type,
      quantity: movementQuantity,
      previousStock: product.stock,
      newStock,
      reason: cleanReason,
      userId: actor?.id ?? 0,
      userName: actor?.name ?? 'System',
      date: new Date().toISOString()
    };

    this.store.dispatch(InventoryActions.registerMovement({ movement }));
    return { ok: true };
  }

  generateSku(category: string, products: Product[]): string {
    const prefix = MOCK_CATEGORIES.find((item) => item.name === category)?.prefix ?? 'GEN';

    const max = products
      .filter((product) => product.sku.startsWith(`${prefix}-`))
      .reduce((acc, product) => {
        const value = Number(product.sku.replace(`${prefix}-`, ''));
        return Number.isFinite(value) ? Math.max(acc, value) : acc;
      }, 0);

    return `${prefix}-${String(max + 1).padStart(3, '0')}`;
  }
}
