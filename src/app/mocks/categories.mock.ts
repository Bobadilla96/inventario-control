export interface CategoryItem {
  id: number;
  name: string;
  icon: string;
  prefix: string;
}

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Electronica', icon: 'cpu', prefix: 'ELEC' },
  { id: 2, name: 'Oficina', icon: 'briefcase', prefix: 'OFI' },
  { id: 3, name: 'Herramientas', icon: 'wrench', prefix: 'HER' },
  { id: 4, name: 'Limpieza', icon: 'sparkles', prefix: 'LIM' },
  { id: 5, name: 'Seguridad', icon: 'shield', prefix: 'SEG' }
];
