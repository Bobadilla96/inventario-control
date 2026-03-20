# Sistema de Inventario (Proyecto 04)

Aplicacion Angular 17 standalone para gestion de stock con alertas reactivas y exportacion de reportes.

## Enlaces

- Repositorio: https://github.com/Bobadilla96/inventario-control
- Demo (GitHub Pages): https://bobadilla96.github.io/inventario-control/

## Funcionalidades implementadas

- Login por roles (`admin`, `almacenista`, `analista`) con datos mock.
- Estado global con **NgRx**:
  - productos, movimientos, filtros, orden y alertas
  - selectores derivados para stock bajo, criticidad, valor total y KPIs
- CRUD de productos:
  - crear producto con SKU autogenerado
  - editar producto existente
  - filtros combinados (categoria, nivel, ubicacion, busqueda)
  - orden por columna y paginacion
- Registro de movimientos de stock:
  - tipos `entrada`, `salida`, `ajuste`
  - validacion de salida vs stock disponible
  - actualizacion reactiva de stock y alertas
  - historial por producto
- Dashboard:
  - KPIs principales
  - distribucion por categoria
  - top productos por valor
  - alertas y ultimos movimientos
- Alertas de bajo stock:
  - ordenadas por severidad
  - accion rapida para registrar entrada
- Reportes:
  - exportar productos y movimientos a CSV
  - exportar inventario y movimientos a PDF (jsPDF + autotable)
- Modo oscuro y responsive.

## Estructura

- `src/app/core`: auth, modelos, servicios de inventario y exportacion
- `src/app/mocks`: usuarios, categorias, productos y movimientos
- `src/app/store`: acciones, reducer, selectores y effects de inventario
- `src/app/features`: login, dashboard, inventario, alertas y reportes
- `src/app/shared/components`: layout, stock indicator y export button

## Credenciales demo

- Admin: `admin@inventario.com` / `admin123`
- Almacenista: `almacen@inventario.com` / `almacen123`
- Analista: `analista@inventario.com` / `analista123`

## Scripts

```bash
npm install
npm run start
npm run build
npm run test
```

## Nota

El backend esta simulado en memoria usando NgRx + mocks. Al recargar la app, el estado vuelve a los datos iniciales.

