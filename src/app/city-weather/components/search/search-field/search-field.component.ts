import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, switchMap, takeUntil} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpService} from '../../../../services/http.service';
import {AutocompleteSearch} from '../../../../models/autocomplete-search.model';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {UtilsService} from '../../../../services/utils.service';
import {MyErrorStateMatcher} from '../../../../utils/my-error-state-matcher';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../../app-state/app.reducer';
import * as WeatherActions from '../../../state/weather.actions';
import {SearchService} from '../../../search.service';


@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.scss']
})
export class SearchFieldComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  searchForm: FormGroup;
  searchedOptions: Observable<AutocompleteSearch[]>;
  matcher = new MyErrorStateMatcher();

  constructor(private httpService: HttpService,
              private utilsService: UtilsService,
              private searchService: SearchService,
              private store: Store<fromRoot.AppState>) {
  }

  ngOnInit(): void {
    this.searchForm = new FormGroup(
      {
        searchField: new FormControl('', {
            validators: [
              Validators.pattern(/[A-Za-z0-9-]/)
            ]
          }
        )
      }
    );

    this.onChanges();
  }

  onChanges(): void {
    this.searchedOptions = this.searchForm.controls.searchField.valueChanges
      .pipe(
        filter(
          (searchValue) => typeof searchValue === 'string' && searchValue.trim().length > 0
        )
      )
      .pipe(
        debounceTime(700),
        distinctUntilChanged(),
        switchMap(
          (value) => {
            return this.httpService.fetchAutocompleteSearchResults(value);
          }
        )
      );
  }

  onSelectCity($event: MatAutocompleteSelectedEvent): void {
    const city = $event.option.value;
    this.store.dispatch(new WeatherActions.SetMainCity(city));
    this.httpService.fetchCurrentWeather(city.LocalizedName, city.Key)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(
        (weather) => {
          this.searchService.searchedCityWeather.next(weather);
          this.utilsService.showSnackbar(`Weather for ${weather.cityName} has been fetched`, 'Ok', 3000);
        },
        () => {
          this.utilsService.showSnackbar('Could not fetch weather', 'Ok', 3000);
        }
      );
    this.httpService.fetch5DaysForecastShortMetric(city.Key)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        (forecast) => {
          this.searchService.searchedCityForecast.next(forecast);
        },
        () => {
          this.utilsService.showSnackbar('Could not fetch forecast', 'Ok', 3000);
          return [];
        }
      );
  }

  displayFn(option: AutocompleteSearch): string {
    return option ? option.LocalizedName : '';
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  clearSearchField(): void {
    this.searchForm.reset();
  }
}
