export interface CityCurrentWeather {
  cityName: string;
  locationKey: string;
  temperature: number | null;
  temperatureType: string;
  icon: string;
  text: string;
}
