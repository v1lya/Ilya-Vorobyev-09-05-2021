import {Action} from '@ngrx/store';
import {AutocompleteSearch} from '../../models/autocomplete-search.model';

export const ADD_CITY_TO_FAVORITES = '[Favorites] Add City To Favorites';
export const REMOVE_CITY_FROM_FAVORITES = '[Favorites] Remove City From Favorites';

export class AddToFavorites implements Action {
  readonly type = ADD_CITY_TO_FAVORITES;

  constructor(public payload: Partial<AutocompleteSearch>) {
  }
}

export class RemoveFromFavorites implements Action {
  readonly type = REMOVE_CITY_FROM_FAVORITES;

  constructor(public payload: string) {
  }
}

export type FavoritesActions = AddToFavorites | RemoveFromFavorites;
