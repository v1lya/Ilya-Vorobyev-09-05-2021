import * as fromRoot from '../../app-state/app.reducer';
import {WeatherActions, SET_MAIN_CITY} from './weather.actions';
import {AutocompleteSearch} from '../../models/autocomplete-search.model';
import {createFeatureSelector, createSelector} from '@ngrx/store';


export interface WeatherState {
  selectedCity: Partial<AutocompleteSearch>;
}

export interface State extends fromRoot.AppState {
  weather: WeatherState;
}

const initialState: WeatherState = {
  selectedCity: {
    LocalizedName: 'Tel Aviv'
  }
};

export function WeatherReducer(state = initialState, action: WeatherActions): any {
  switch (action.type) {
    case SET_MAIN_CITY:
      return {
        ...state,
        selectedCity: action.payload
      };
    default:
      return state;
  }
}

export const getWeatherState = createFeatureSelector<WeatherState>('weather');
export const getSelectedCity = createSelector(getWeatherState, (state: WeatherState) => state.selectedCity);

