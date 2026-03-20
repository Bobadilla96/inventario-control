import { User } from '../core/models/user.model';

export const MOCK_USERS: User[] = [
  { id: 1, email: 'admin@inventario.com', password: 'admin123', name: 'Camila Admin', role: 'admin' },
  { id: 2, email: 'almacen@inventario.com', password: 'almacen123', name: 'Diego Almacen', role: 'almacenista' },
  { id: 3, email: 'analista@inventario.com', password: 'analista123', name: 'Julia Analista', role: 'analista' }
];
