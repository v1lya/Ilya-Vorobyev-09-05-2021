import {Action} from '@ngrx/store';
import {TemperatureUnit} from '../models/temperature-unit.enum';

export const SET_TEMPERATURE_UNIT = '[TemperatureUnit] Set Temperature Unit';

export class SetTemperatureUnit implements Action {
  readonly type = SET_TEMPERATURE_UNIT;

  constructor(public payload: TemperatureUnit) {
  }
}

export type TemperatureUnitActions = SetTemperatureUnit;
