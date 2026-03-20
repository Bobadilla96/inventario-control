import { Routes } from '@angular/router';
import { authChildGuard, authGuard } from './core/auth/auth.guard';
import { UserRole } from './core/models/user.model';
import { LowStockComponent } from './features/alerts/low-stock/low-stock.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductFormComponent } from './features/inventory/product-form/product-form.component';
import { ProductListComponent } from './features/inventory/product-list/product-list.component';
import { StockMovementComponent } from './features/inventory/stock-movement/stock-movement.component';
import { InventoryReportComponent } from './features/reports/inventory-report/inventory-report.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';
import { AppShellComponent } from './shared/components/layout/app-shell.component';

const ALL_ROLES: UserRole[] = ['admin', 'almacenista', 'analista'];

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardComponent, data: { roles: ALL_ROLES } },
      { path: 'inventory', component: ProductListComponent, data: { roles: ALL_ROLES } },
      { path: 'inventory/new', component: ProductFormComponent, data: { roles: ['admin', 'almacenista'] } },
      { path: 'inventory/edit/:id', component: ProductFormComponent, data: { roles: ['admin', 'almacenista'] } },
      { path: 'inventory/movement', component: StockMovementComponent, data: { roles: ['admin', 'almacenista'] } },
      { path: 'alerts/low-stock', component: LowStockComponent, data: { roles: ALL_ROLES } },
      { path: 'reports/inventory', component: InventoryReportComponent, data: { roles: ['admin', 'analista'] } }
    ]
  },
  { path: '**', redirectTo: '' }
];
