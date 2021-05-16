import {Component, OnDestroy, OnInit} from '@angular/core';
import {CityCurrentWeather} from '../../../models/city-current-weather.model';
import {Observable, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {HttpService} from '../../../services/http.service';
import {UtilsService} from '../../../services/utils.service';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../../app-state/app.reducer';
import * as LoadingActions from '../../../app-state/loading-state.actions';
import * as fromFavorites from '../../state/favorites.reducer';


@Component({
  selector: 'app-favorites-list',
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.scss']
})
export class FavoritesListComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading$: Observable<boolean>;
  favoriteCitiesCurrentWeather: CityCurrentWeather[] = [];

  constructor(private httpService: HttpService,
              private utilsService: UtilsService,
              private store: Store<fromFavorites.State>) {
  }

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.store.dispatch(new LoadingActions.StartLoading());

    this.store.select(fromFavorites.getFavoriteCities)
      .pipe(
        takeUntil(this.destroy$),
        switchMap((favoriteCities) => this.httpService.getWeatherForFavoriteCities(favoriteCities)
        )
      )
      .subscribe(
        (cities) => {
          if (cities.length === 0) {
            this.utilsService.stopLoadingWithNotification('No favorite cities yet');
          } else {
            this.favoriteCitiesCurrentWeather = cities;
            this.utilsService.stopLoadingWithNotification('Weather for your favorite cities has been fetched');
          }
        },
        () => {
          this.utilsService.stopLoadingWithNotification('Could not fetch weather for your favorite cities');
        }
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
