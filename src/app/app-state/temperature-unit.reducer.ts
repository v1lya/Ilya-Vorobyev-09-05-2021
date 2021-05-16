import {TemperatureUnit} from '../models/temperature-unit.enum';
import {SET_TEMPERATURE_UNIT, TemperatureUnitActions} from './temperature-unit.actions';

export interface State {
  temperatureUnit: TemperatureUnit;
}

const initialState: State = {
  temperatureUnit: TemperatureUnit.C
};

export function temperatureUnitReducer(state = initialState, action: TemperatureUnitActions): any {
  switch (action.type) {
    case SET_TEMPERATURE_UNIT:
      return {
        ...state,
        temperatureUnit: action.payload
      };
    default: {
      return state;
    }
  }
}

export const getTemperatureUnit = (state: State) => state.temperatureUnit;
