export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  location: string;
  status: 'active' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export type StockLevel = 'ok' | 'low' | 'critical' | 'out_of_stock';

export function getStockLevel(product: Product): StockLevel {
  if (product.stock === 0) {
    return 'out_of_stock';
  }

  if (product.stock <= product.minStock * 0.5) {
    return 'critical';
  }

  if (product.stock <= product.minStock) {
    return 'low';
  }

  return 'ok';
}
