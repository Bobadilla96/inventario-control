import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { InventoryService } from '../../../core/services/inventory.service';
import { AppState } from '../../../store/app.state';
import { selectAllProducts, selectStockAlerts } from '../../../store/inventory/inventory.selectors';

interface MenuItem {
  label: string;
  path: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  readonly user$ = this.auth.currentUser$;
  readonly productsCount$ = this.store.select(selectAllProducts).pipe(map((items) => items.length));
  readonly alertsCount$ = this.store.select(selectStockAlerts).pipe(map((items) => items.length));

  readonly pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    startWith(new NavigationEnd(0, this.router.url, this.router.url)),
    map((event) => this.resolveTitle(event.urlAfterRedirects))
  );

  readonly menu: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', roles: ['admin', 'almacenista', 'analista'] },
    { label: 'Inventario', path: '/inventory', roles: ['admin', 'almacenista', 'analista'] },
    { label: 'Movimientos', path: '/inventory/movement', roles: ['admin', 'almacenista'] },
    { label: 'Alertas', path: '/alerts/low-stock', roles: ['admin', 'almacenista', 'analista'] },
    { label: 'Reportes', path: '/reports/inventory', roles: ['admin', 'analista'] }
  ];

  darkMode = false;
  sidebarCollapsed = false;

  constructor(
    private readonly auth: AuthService,
    private readonly inventory: InventoryService,
    private readonly router: Router,
    private readonly store: Store<AppState>
  ) {
    this.inventory.initData();
    this.darkMode = localStorage.getItem('inventory_dark_mode') === '1';
    this.sidebarCollapsed = localStorage.getItem('inventory_sidebar_collapsed') === '1';
    this.applyTheme();
  }

  canAccess(role: UserRole | undefined, item: MenuItem): boolean {
    return role ? item.roles.includes(role) : false;
  }

  toggleTheme(): void {
    this.darkMode = !this.darkMode;
    localStorage.setItem('inventory_dark_mode', this.darkMode ? '1' : '0');
    this.applyTheme();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('inventory_sidebar_collapsed', this.sidebarCollapsed ? '1' : '0');
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private applyTheme(): void {
    document.body.classList.toggle('inv-dark', this.darkMode);
  }

  private resolveTitle(url: string): string {
    if (url.includes('/inventory/new')) return 'Nuevo producto';
    if (url.includes('/inventory/edit')) return 'Editar producto';
    if (url.includes('/inventory/movement')) return 'Movimiento de stock';
    if (url.includes('/alerts')) return 'Alertas de stock';
    if (url.includes('/reports')) return 'Reportes de inventario';
    if (url.includes('/inventory')) return 'Gestion de inventario';
    return 'Dashboard';
  }
}
