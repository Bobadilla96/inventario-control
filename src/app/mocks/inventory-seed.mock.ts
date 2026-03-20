import { StockMovement } from '../core/models/movement.model';
import { Product } from '../core/models/product.model';
import { MOCK_CATEGORIES } from './categories.mock';

interface ProductSeed {
  id: number;
  name: string;
  description: string;
  category: string;
  initialStock: number;
  minStock: number;
  price: number;
  cost: number;
  location: string;
  status: 'active' | 'discontinued';
}

interface MutableProduct extends Product {
  latestMs: number;
}

interface InventorySeed {
  products: Product[];
  movements: StockMovement[];
}

const categoryPrefix = MOCK_CATEGORIES.reduce<Record<string, string>>((acc, category) => {
  acc[category.name] = category.prefix;
  return acc;
}, {});

const baseSeeds: ProductSeed[] = [
  { id: 1, name: 'Laptop Industrial A14', description: 'Equipo portatil para personal tecnico', category: 'Electronica', initialStock: 18, minStock: 8, price: 1450, cost: 1100, location: 'Bodega A-01', status: 'active' },
  { id: 2, name: 'Monitor 27 IPS', description: 'Pantalla para estaciones administrativas', category: 'Electronica', initialStock: 26, minStock: 10, price: 320, cost: 240, location: 'Bodega A-01', status: 'active' },
  { id: 3, name: 'Router Empresarial', description: 'Router dual wan para sucursales', category: 'Electronica', initialStock: 14, minStock: 7, price: 460, cost: 330, location: 'Bodega A-02', status: 'active' },
  { id: 4, name: 'UPS 1500VA', description: 'Respaldo electrico para racks', category: 'Electronica', initialStock: 10, minStock: 6, price: 520, cost: 390, location: 'Bodega A-02', status: 'active' },
  { id: 5, name: 'Impresora Termica', description: 'Impresora para etiquetas de envio', category: 'Electronica', initialStock: 9, minStock: 5, price: 290, cost: 210, location: 'Bodega A-03', status: 'active' },
  { id: 6, name: 'Silla Ergonomica', description: 'Silla para puestos de trabajo continuo', category: 'Oficina', initialStock: 34, minStock: 12, price: 190, cost: 135, location: 'Bodega B-01', status: 'active' },
  { id: 7, name: 'Escritorio Modular', description: 'Escritorio para area administrativa', category: 'Oficina', initialStock: 22, minStock: 10, price: 280, cost: 205, location: 'Bodega B-01', status: 'active' },
  { id: 8, name: 'Archivador Metalico', description: 'Mueble archivador de 4 cajones', category: 'Oficina', initialStock: 15, minStock: 8, price: 210, cost: 150, location: 'Bodega B-02', status: 'active' },
  { id: 9, name: 'Resma A4 Premium', description: 'Papel premium para impresion interna', category: 'Oficina', initialStock: 90, minStock: 30, price: 7.5, cost: 5.2, location: 'Bodega B-03', status: 'active' },
  { id: 10, name: 'Toner Laser Negro', description: 'Consumible para impresoras laser', category: 'Oficina', initialStock: 44, minStock: 16, price: 95, cost: 71, location: 'Bodega B-03', status: 'active' },
  { id: 11, name: 'Taladro Percutor', description: 'Herramienta para mantenimiento civil', category: 'Herramientas', initialStock: 20, minStock: 8, price: 160, cost: 118, location: 'Bodega C-01', status: 'active' },
  { id: 12, name: 'Amoladora Angular', description: 'Equipo para corte y desbaste', category: 'Herramientas', initialStock: 13, minStock: 7, price: 140, cost: 102, location: 'Bodega C-01', status: 'active' },
  { id: 13, name: 'Juego Llaves Mixtas', description: 'Set de 24 llaves de acero', category: 'Herramientas', initialStock: 28, minStock: 12, price: 85, cost: 61, location: 'Bodega C-02', status: 'active' },
  { id: 14, name: 'Compresor 50L', description: 'Compresor para taller central', category: 'Herramientas', initialStock: 7, minStock: 4, price: 430, cost: 316, location: 'Bodega C-02', status: 'active' },
  { id: 15, name: 'Soldadora Inverter', description: 'Equipo de soldadura para estructura', category: 'Herramientas', initialStock: 11, minStock: 5, price: 390, cost: 282, location: 'Bodega C-03', status: 'active' },
  { id: 16, name: 'Detergente Industrial 5L', description: 'Detergente para limpieza de planta', category: 'Limpieza', initialStock: 62, minStock: 25, price: 12, cost: 8.2, location: 'Bodega D-01', status: 'active' },
  { id: 17, name: 'Desinfectante Hospitalario', description: 'Liquido desinfectante de alto nivel', category: 'Limpieza', initialStock: 50, minStock: 20, price: 15, cost: 10.4, location: 'Bodega D-01', status: 'active' },
  { id: 18, name: 'Guantes Nitrilo Caja', description: 'Guantes descartables para operarios', category: 'Limpieza', initialStock: 120, minStock: 40, price: 9.5, cost: 6.8, location: 'Bodega D-02', status: 'active' },
  { id: 19, name: 'Escoba Industrial', description: 'Escoba de uso intensivo para deposito', category: 'Limpieza', initialStock: 32, minStock: 12, price: 6.5, cost: 4.1, location: 'Bodega D-02', status: 'active' },
  { id: 20, name: 'Paño Microfibra Pack', description: 'Pack de 10 panos de microfibra', category: 'Limpieza', initialStock: 48, minStock: 20, price: 13, cost: 9.3, location: 'Bodega D-03', status: 'active' },
  { id: 21, name: 'Camara CCTV Bullet', description: 'Camara de seguridad exterior', category: 'Seguridad', initialStock: 24, minStock: 10, price: 122, cost: 86, location: 'Bodega E-01', status: 'active' },
  { id: 22, name: 'Sensor de Humo', description: 'Sensor fotoelectrico para oficinas', category: 'Seguridad', initialStock: 31, minStock: 12, price: 34, cost: 23, location: 'Bodega E-01', status: 'active' },
  { id: 23, name: 'Cerradura Biometrica', description: 'Control de acceso para areas criticas', category: 'Seguridad', initialStock: 9, minStock: 5, price: 270, cost: 196, location: 'Bodega E-02', status: 'active' },
  { id: 24, name: 'Sirena de Alarma', description: 'Sirena interior de alta potencia', category: 'Seguridad', initialStock: 16, minStock: 7, price: 49, cost: 35, location: 'Bodega E-02', status: 'active' },
  { id: 25, name: 'Boton de Panico', description: 'Dispositivo de alerta silenciosa', category: 'Seguridad', initialStock: 18, minStock: 8, price: 58, cost: 41, location: 'Bodega E-03', status: 'active' },
  { id: 26, name: 'Switch 24 Puertos', description: 'Switch gestionable para red interna', category: 'Electronica', initialStock: 8, minStock: 4, price: 390, cost: 301, location: 'Bodega A-04', status: 'active' },
  { id: 27, name: 'Teclado Mecanico', description: 'Periferico para analistas', category: 'Electronica', initialStock: 29, minStock: 10, price: 75, cost: 55, location: 'Bodega A-04', status: 'active' },
  { id: 28, name: 'Soporte Monitor Doble', description: 'Soporte ergonomico para monitores', category: 'Oficina', initialStock: 13, minStock: 6, price: 67, cost: 48, location: 'Bodega B-04', status: 'active' },
  { id: 29, name: 'Caja Herramientas 42P', description: 'Kit basico de mantenimiento', category: 'Herramientas', initialStock: 17, minStock: 7, price: 112, cost: 80, location: 'Bodega C-04', status: 'discontinued' },
  { id: 30, name: 'Casco Protector', description: 'Casco homologado para seguridad industrial', category: 'Seguridad', initialStock: 43, minStock: 16, price: 29, cost: 20, location: 'Bodega E-04', status: 'active' }
];

function isoDaysAgo(days: number, hourOffset: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(8 + (hourOffset % 10), 10, 0, 0);
  return date.toISOString();
}

function generateInventorySeed(): InventorySeed {
  const products: MutableProduct[] = baseSeeds.map((seed) => {
    const createdAt = isoDaysAgo(120 - seed.id * 2, seed.id);
    return {
      id: seed.id,
      sku: `${categoryPrefix[seed.category] ?? 'GEN'}-${String(seed.id).padStart(3, '0')}`,
      name: seed.name,
      description: seed.description,
      category: seed.category,
      stock: seed.initialStock,
      minStock: seed.minStock,
      price: Number(seed.price.toFixed(2)),
      cost: Number(seed.cost.toFixed(2)),
      location: seed.location,
      status: seed.status,
      createdAt,
      updatedAt: createdAt,
      latestMs: new Date(createdAt).getTime()
    };
  });

  const movements: StockMovement[] = [];
  let movementId = 1;

  const actorByIndex = (idx: number) => {
    const actor = idx % 3;
    if (actor === 0) {
      return { id: 1, name: 'Camila Admin' };
    }

    if (actor === 1) {
      return { id: 2, name: 'Diego Almacen' };
    }

    return { id: 3, name: 'Julia Analista' };
  };

  const addMovement = (
    productId: number,
    type: 'entrada' | 'salida' | 'ajuste',
    rawQuantity: number,
    reason: string,
    daysAgo: number,
    hourOffset: number
  ) => {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) {
      return;
    }

    const previousStock = product.stock;
    let quantity = rawQuantity;

    if (type === 'salida' && rawQuantity > 0) {
      quantity = -rawQuantity;
    }

    let newStock = previousStock;

    if (type === 'entrada') {
      newStock = previousStock + Math.abs(rawQuantity);
      quantity = Math.abs(rawQuantity);
    }

    if (type === 'salida') {
      newStock = Math.max(0, previousStock - Math.abs(rawQuantity));
      quantity = -Math.abs(rawQuantity);
    }

    if (type === 'ajuste') {
      newStock = Math.max(0, previousStock + rawQuantity);
      quantity = rawQuantity;
    }

    const date = isoDaysAgo(daysAgo, hourOffset);
    const actor = actorByIndex(movementId);

    movements.push({
      id: movementId,
      productId,
      type,
      quantity,
      previousStock,
      newStock,
      reason,
      userId: actor.id,
      userName: actor.name,
      date
    });

    movementId += 1;
    product.stock = newStock;
    product.updatedAt = date;
    product.latestMs = new Date(date).getTime();
  };

  products.forEach((product, idx) => {
    if (idx % 3 === 0) {
      addMovement(product.id, 'entrada', 6 + (idx % 5), 'Ingreso por compra a proveedor', 28 - (idx % 18), idx);
    } else if (idx % 3 === 1) {
      addMovement(product.id, 'salida', 4 + (idx % 6), 'Salida por despacho interno', 27 - (idx % 16), idx + 1);
    } else {
      addMovement(product.id, 'ajuste', idx % 2 === 0 ? 3 : -2, 'Ajuste por control ciclico', 26 - (idx % 14), idx + 2);
    }
  });

  for (let idx = 0; idx < 14; idx += 1) {
    const product = products[idx];
    if (!product) {
      continue;
    }

    if (idx % 2 === 0) {
      addMovement(product.id, 'salida', 7 + (idx % 4), 'Salida para orden de mantenimiento', 12 - (idx % 7), idx + 3);
    } else {
      addMovement(product.id, 'entrada', 5 + (idx % 3), 'Reposicion urgente de inventario', 11 - (idx % 6), idx + 4);
    }
  }

  const forceStock = (productId: number, targetStock: number, daysAgo: number, reason: string) => {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product) {
      return;
    }

    const delta = targetStock - product.stock;
    addMovement(productId, 'ajuste', delta, reason, daysAgo, productId);
  };

  forceStock(5, 0, 4, 'Ajuste por equipo fuera de servicio');
  forceStock(12, 0, 3, 'Ajuste por baja definitiva del activo');
  forceStock(3, 1, 2, 'Correccion por reserva de emergencia');
  forceStock(8, 4, 2, 'Ajuste por rotura de unidades');
  forceStock(22, 6, 1, 'Salida extraordinaria para auditoria');

  const cleanProducts: Product[] = products
    .sort((a, b) => a.id - b.id)
    .map(({ latestMs: _latest, ...product }) => product);

  const cleanMovements = [...movements].sort((a, b) => b.date.localeCompare(a.date));

  return {
    products: cleanProducts,
    movements: cleanMovements
  };
}

export const INVENTORY_SEED = generateInventorySeed();
