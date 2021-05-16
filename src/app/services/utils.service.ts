import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Store} from '@ngrx/store';
import * as fromRoot from '../app-state/app.reducer';
import * as LoadingState from '../app-state/loading-state.actions';

@Injectable({providedIn: 'root'})
export class UtilsService {

  constructor(private snackBar: MatSnackBar, private store: Store<fromRoot.AppState>) {
  }

  showSnackbar(message: string, action: string, duration: number): void {
    this.snackBar.open(message, action, {
        duration: duration || 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'panel-snackbar'
      }
    );
  }

  changeFavoriteCitiesNotification(message: string): void {
    this.showSnackbar(message, 'Ok', 3000);
  }

  stopLoadingWithNotification(message: string): void {
    this.store.dispatch(new LoadingState.StopLoading());
    this.changeFavoriteCitiesNotification(message);
  }
}
