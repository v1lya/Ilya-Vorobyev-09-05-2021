import {Action} from '@ngrx/store';
import {AutocompleteSearch} from '../../models/autocomplete-search.model';


export const SET_MAIN_CITY = '[AutocompleteSearch] Save City Autocomplete Value';

export class SetMainCity implements Action {
  readonly type = SET_MAIN_CITY;

  constructor(public payload: AutocompleteSearch) {
  }
}

export type WeatherActions = SetMainCity;

