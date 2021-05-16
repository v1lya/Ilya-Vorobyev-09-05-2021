import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpService} from '../../../../services/http.service';
import {Observable, Subject} from 'rxjs';
import {CityCurrentWeather} from '../../../../models/city-current-weather.model';
import {switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {UtilsService} from '../../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AutocompleteSearch} from '../../../../models/autocomplete-search.model';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../app-state/app.reducer';
import * as LoadingActions from '../../../../app-state/loading-state.actions';
import * as fromWeather from '../../../state/weather.reducer';
import * as WeatherActions from '../../../state/weather.actions';
import * as fromFavorites from '../../../../favorite-cities/state/favorites.reducer';
import * as FavoritesActions from '../../../../favorite-cities/state/favorites.actions';
import {SearchService} from '../../../search.service';
import {TemperatureUnit} from '../../../../models/temperature-unit.enum';
import * as TemperatureUnitActions from '../../../../app-state/temperature-unit.actions';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading$: Observable<boolean>;
  favoriteCityLocationKey = '';
  isFavorite: boolean;
  city: Partial<AutocompleteSearch>;
  cityWeather: CityCurrentWeather;
  temperatureUnit: TemperatureUnit;
  nextTemperatureUnit: TemperatureUnit;

  constructor(
    private httpService: HttpService,
    private utilsService: UtilsService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromRoot.AppState>) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.store.select(fromRoot.getTemperatureUnit)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (temperatureUnit) => {
          this.temperatureUnit = temperatureUnit;
          this.nextTemperatureUnit = temperatureUnit === TemperatureUnit.C ? TemperatureUnit.F : TemperatureUnit.C;
        }
      );

    this.route.params
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(
      (params) => {
        if (params.id) {
          this.favoriteCityLocationKey = params.id;
          this.setMainCity(this.favoriteCityLocationKey);
          this.store.dispatch(new WeatherActions.SetMainCity(this.city as AutocompleteSearch));
        }}
        );

    this.initCityWeather();

    this.searchService.searchedCityWeather
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (cityWeather) => {
          this.cityWeather = cityWeather;
          this.getMainCityFromStore();
        }
      );
  }

  setMainCity(locationKey: string): void {
    this.store.select(fromFavorites.getFavoriteCities)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (cities) => {
          this.city = cities.find((city) => city.Key === locationKey) as AutocompleteSearch;
        }
      );
  }

  getMainCityFromStore(): void {
    this.store.select(fromWeather.getSelectedCity)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (selectedCity) => {
          this.city = selectedCity as AutocompleteSearch;
          this.favoriteCityLocationKey = '';
          this.isFavoriteCheck();
        }
      );
  }

  isFavoriteCheck(): void {
    this.store.select(fromFavorites.getFavoriteCities)
      .pipe(
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(
        (favoriteCities) => {
          this.isFavorite = !!favoriteCities.find((favoriteCity) => favoriteCity.Key === this.city.Key);
        }
      );
  }

  initCityWeather(): void {
    this.store.dispatch(new LoadingActions.StartLoading());

    if (!this.favoriteCityLocationKey) {
      this.getMainCityFromStore();
    }

    const getWeather: Observable<CityCurrentWeather> = this.favoriteCityLocationKey
      ? this.getFavoriteCityWeather()
      : this.getCityWeather(this.city.LocalizedName as string);

    getWeather
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (cityWeather) => {
          this.cityWeather = cityWeather;
          this.utilsService.stopLoadingWithNotification(`Weather for ${cityWeather.cityName} has been fetched`);
        },
        () => {
          this.utilsService.stopLoadingWithNotification('Could not fetch weather');
          this.cityWeather = {
            cityName: '',
            icon: '',
            locationKey: '',
            temperature: null,
            temperatureType: '',
            text: ''
          };
        }
      );
  }

  getFavoriteCityWeather(): Observable<CityCurrentWeather> {
    this.isFavoriteCheck();
    return this.httpService.fetchCurrentWeather(this.city.LocalizedName as string, this.city.Key as string);
  }

  getCityWeather(cityName: string): Observable<CityCurrentWeather> {
    return this.httpService.fetchAutocompleteSearchResults(cityName)
      .pipe(
        tap(
          (cities) => {
            if (cities.length === 1) {
              this.store.dispatch(new WeatherActions.SetMainCity(cities[0]));
            }
          }
        ),
        switchMap(
          () => {
            return this.httpService.fetchCurrentWeather(this.city.LocalizedName as string, this.city.Key as string);
          }
        ),
      );
  }

  onToggleCityFavorite(): void {
    if (this.favoriteCityLocationKey === '') {
      const notificationMessage = this.isFavorite
        ? `${this.city.LocalizedName} is not in your favorites anymore`
        : `${this.city.LocalizedName} is in your favorites now`;
      this.utilsService.changeFavoriteCitiesNotification(notificationMessage);
      if (!this.isFavorite) {
        this.store.dispatch(new FavoritesActions.AddToFavorites(this.city));
      } else {
        this.store.dispatch(new FavoritesActions.RemoveFromFavorites(this.city.Key as string));
      }
      this.isFavorite = !this.isFavorite;
    }
    if (this.favoriteCityLocationKey !== '') {
      this.store.dispatch(new FavoritesActions.RemoveFromFavorites(this.favoriteCityLocationKey as string));
      this.onBack();
    }
  }

  onBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onToggleTemperatureUnit(): void {
    this.store.dispatch(new TemperatureUnitActions.SetTemperatureUnit(this.nextTemperatureUnit));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
