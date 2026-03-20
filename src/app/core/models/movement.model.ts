export type MovementType = 'entrada' | 'salida' | 'ajuste';

export interface StockMovement {
  id: number;
  productId: number;
  type: MovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  userId: number;
  userName: string;
  date: string;
}
