import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {CityCurrentWeather} from '../models/city-current-weather.model';
import {ForecastWeather} from '../models/forecast-weather.model';

@Injectable({providedIn: 'root'})
export class SearchService {
  searchedCityWeather: Subject<CityCurrentWeather> = new Subject<CityCurrentWeather>();
  searchedCityForecast: Subject<ForecastWeather[]> = new Subject<ForecastWeather[]>();
}
