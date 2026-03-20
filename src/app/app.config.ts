import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { InventoryEffects } from './store/inventory/inventory.effects';
import { INVENTORY_FEATURE_KEY, inventoryReducer } from './store/inventory/inventory.reducer';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore({ [INVENTORY_FEATURE_KEY]: inventoryReducer }),
    provideEffects([InventoryEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};
