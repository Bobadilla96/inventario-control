import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of } from 'rxjs';
import { InventoryActions } from './inventory.actions';
import { MOCK_MOVEMENTS } from '../../mocks/movements.mock';
import { MOCK_PRODUCTS } from '../../mocks/products.mock';

@Injectable()
export class InventoryEffects {
  readonly loadInventory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(InventoryActions.loadInventory),
      map(() => InventoryActions.loadInventorySuccess({ products: MOCK_PRODUCTS, movements: MOCK_MOVEMENTS })),
      catchError(() => of(InventoryActions.loadInventoryFailure({ error: 'No se pudieron cargar los datos mock' })))
    )
  );

  constructor(private readonly actions$: Actions) {}
}
