import {Component, OnDestroy, OnInit} from '@angular/core';
import {ForecastWeather} from '../../../models/forecast-weather.model';
import {HttpService} from '../../../services/http.service';
import {switchMap, takeUntil} from 'rxjs/operators';
import {merge, Subject} from 'rxjs';
import {UtilsService} from '../../../services/utils.service';
import {Store} from '@ngrx/store';
import * as fromWeather from '../../state/weather.reducer';
import {SearchService} from '../../search.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.scss']
})
export class ForecastsListComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  forecast5Days: ForecastWeather[] = [];

  constructor(
    private httpService: HttpService,
    private utilsService: UtilsService,
    private searchService: SearchService,
    private store: Store<fromWeather.State>) {
  }

  ngOnInit(): void {
    this.store.select(fromWeather.getSelectedCity)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(city => {
          return merge(
            this.httpService.fetch5DaysForecastShortMetric(city.Key as string),
            this.searchService.searchedCityForecast
          );
        })
      )
      .subscribe(
        (forecast5DaysResult) => {
          this.forecast5Days = forecast5DaysResult;
        },
        () => {
          this.utilsService.showSnackbar('Could not fetch forecast', 'Ok', 3000);
          return [];
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
