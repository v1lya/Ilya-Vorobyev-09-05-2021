import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {CityCurrentWeather} from '../models/city-current-weather.model';
import {catchError, map} from 'rxjs/operators';
import {AutocompleteSearch} from '../models/autocomplete-search.model';
import {environment} from '../../environments/environment';
import {CurrentConditions} from '../models/current-conditions.model';
import {Forecast5DaysShortMetric} from '../models/forecast-5-days-short-metric.model';
import {ForecastWeather} from '../models/forecast-weather.model';
import {DatePipe} from '@angular/common';
import {UtilsService} from './utils.service';
import {FavoriteCity} from '../models/favorite-city';


@Injectable({providedIn: 'root'})
export class HttpService {
  isDevelopment = !environment.production;
  autocompleteEndpoint = '/locations/v1/cities/autocomplete';
  currentConditionsEndpoint = '/currentconditions/v1/';
  forecast5DaysEndpoint = '/forecasts/v1/daily/5day/';


  constructor(private http: HttpClient,
              private utilsService: UtilsService,
              private datePipe: DatePipe) {
  }

  fetchAutocompleteSearchResults(cityName: string): Observable<AutocompleteSearch[]> {
    const value = cityName.toLowerCase().replace(/[\s]/g, '');
    let url: string;

    this.isDevelopment
      ? url = `${environment.baseAPI}${this.autocompleteEndpoint}/${value}`
      : url = `${environment.baseAPI}${this.autocompleteEndpoint}`;

    return this.http.get<AutocompleteSearch[]>(url,
      {
        params: new HttpParams().set('q', cityName)
      }
    )
      .pipe(
        catchError(
          () => {
            this.utilsService.showSnackbar('No cities were found for your request', 'Ok', 2000);
            return of([]);
          }
        )
      );
  }

  fetchCurrentWeather(cityName: string, locationKey: string): Observable<CityCurrentWeather> {
    const url = `${environment.baseAPI}${this.currentConditionsEndpoint}${locationKey}`;
    return this.http.get<CurrentConditions[]>(url)
      .pipe(
        map((currentConditionsArray: CurrentConditions[]) => {
          return this.buildCurrentWeather(currentConditionsArray[0], cityName, locationKey);
        })
      );
  }

  private buildCurrentWeather(currentConditions: CurrentConditions, cityName: string, locationKey: string): CityCurrentWeather {
    const city: CityCurrentWeather = {
      cityName,
      locationKey,
      temperature: Math.round(currentConditions.Temperature.Metric.Value),
      temperatureType: currentConditions.Temperature.Metric.Unit,
      icon: currentConditions.WeatherIcon,
      text: currentConditions.WeatherText
    };
    return city;
  }

  fetch5DaysForecastShortMetric(locationKey: string): Observable<ForecastWeather[]> {
    const url = `${environment.baseAPI}${this.forecast5DaysEndpoint}${locationKey}`;

    return this.http.get<Forecast5DaysShortMetric>(url)
      .pipe(
        map(
          (forecast5DaysObjectShortMetric) => {
            return this.build5DaysForecast(forecast5DaysObjectShortMetric);
          }
        ),
      );
  }

  private build5DaysForecast(forecast5DaysObjectShortMetric: Forecast5DaysShortMetric): ForecastWeather[]  {
    const cityForecast5Days: ForecastWeather[] = [];

    forecast5DaysObjectShortMetric.DailyForecasts.forEach(
      (forecast1DayFull) => {
        const forecast1DayTransformed = {
          day: this.datePipe.transform(forecast1DayFull.Date, 'EEE')?.toUpperCase() as string,
          temperatureMax: Math.round(forecast1DayFull.Temperature.Maximum.Value),
          temperatureMin: Math.round(forecast1DayFull.Temperature.Minimum.Value),
          temperatureType: forecast1DayFull.Temperature.Maximum.Unit
        };
        cityForecast5Days.push(forecast1DayTransformed);
      }
    );
    return cityForecast5Days;
}

  getWeatherForFavoriteCities(cities: FavoriteCity[]): Observable<CityCurrentWeather[]> {
    if (cities.length === 0) {
      return of([]);
    }
    const requests = cities.map(
      (city) => {
        return this.fetchCurrentWeather(city.LocalizedName, city.Key);
      }
    );
    return forkJoin(requests);
  }
}
