import {ActionReducerMap, createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromLoadingState from './loading-state.reducer';
import * as fromFavorites from '../favorite-cities/state/favorites.reducer';
import * as fromTemperatureUnit from './temperature-unit.reducer';

export interface AppState {
  favorites: fromFavorites.FavoritesState;
  loadingState: fromLoadingState.State;
  temperatureUnit: fromTemperatureUnit.State;
}

export const reducers: ActionReducerMap<AppState, any> = {
  favorites: fromFavorites.favoritesReducer,
  loadingState: fromLoadingState.loadingStateReducer,
  temperatureUnit: fromTemperatureUnit.temperatureUnitReducer,
};

export const getLoadingState = createFeatureSelector<fromLoadingState.State>('loadingState');
export const getIsLoading = createSelector(getLoadingState, fromLoadingState.getIsLoading);

export const getTemperatureUnitState = createFeatureSelector<fromTemperatureUnit.State>('temperatureUnit');
export const getTemperatureUnit = createSelector(getTemperatureUnitState, fromTemperatureUnit.getTemperatureUnit);

