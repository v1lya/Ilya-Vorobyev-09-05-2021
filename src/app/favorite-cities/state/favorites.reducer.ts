import * as fromRoot from '../../app-state/app.reducer';
import {
  FavoritesActions,
  ADD_CITY_TO_FAVORITES,
  REMOVE_CITY_FROM_FAVORITES
} from './favorites.actions';
import {createFeatureSelector, createSelector} from '@ngrx/store';
import {FavoriteCity} from '../../models/favorite-city';

export interface FavoritesState {
  favoriteCities: FavoriteCity[];
}

export interface State extends fromRoot.AppState {
  favorites: FavoritesState;
}

const initialState: FavoritesState = {
  favoriteCities: []
};

export function favoritesReducer(state = initialState, action: FavoritesActions): any {
  switch (action.type) {
    case ADD_CITY_TO_FAVORITES:
      return {
        ...state,
        favoriteCities: [...state.favoriteCities, action.payload]
      };
    case REMOVE_CITY_FROM_FAVORITES:
      return {
        ...state,
        favoriteCities: state.favoriteCities.filter((city) => city.Key !== action.payload)
      };
    default:
      return state;
  }
}

export const getFavoritesState = createFeatureSelector<FavoritesState>('favorites');
export const getFavoriteCities = createSelector(getFavoritesState, (state: FavoritesState) => state.favoriteCities);
