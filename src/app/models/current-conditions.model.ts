import {PrecipitationTypes} from './precipitation-types.enum';

export interface CurrentConditions {
  LocalObservationDateTime: string;
  EpochTime: string;
  WeatherText: string;
  WeatherIcon: string;
  HasPrecipitation: boolean;
  PrecipitationType: PrecipitationTypes | null;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number,
      Unit: string,
      UnitType: number
    },
    Imperial: {
      Value: number,
      Unit: string,
      UnitType: number
    }
  };
  MobileLink: string;
  Link: string;
}
