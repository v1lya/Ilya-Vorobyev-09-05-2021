import {PrecipitationTypes} from './precipitation-types.enum';

export interface Forecast5DaysShortMetric {
  Headline: {
    EffectiveDate: string;
    EffectiveEpochDate: string;
    Severity: number;
    Text: string;
    Category: string;
    EndDate: string;
    EndEpochDate: string;
    MobileLink: string;
    Link: string;
  };
  DailyForecasts: [
    {
      Date: string,
      EpochDate: string;
      Temperature: {
        Minimum: {
          Value: number;
          Unit: string;
          UnitType: number
        },
        Maximum: {
          Value: number,
          Unit: string,
          UnitType: number
        }
      },
      Day: {
        Icon: string,
        IconPhrase: string;
        HasPrecipitation: true,
        PrecipitationType: PrecipitationTypes | null;
        PrecipitationIntensity: string
      },
      Night: {
        Icon: string,
        IconPhrase: string,
        HasPrecipitation: false
      },
      Sources: [
        string
      ],
      MobileLink: string;
      Link: string;
    }
  ];
}
