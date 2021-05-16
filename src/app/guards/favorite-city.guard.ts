import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UtilsService} from '../services/utils.service';
import {map, take} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import * as fromFavorites from '../favorite-cities/state/favorites.reducer';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteCityGuard implements CanActivate {

  constructor(private utilsService: UtilsService, private router: Router, private store: Store<fromFavorites.State>) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const favoriteCityLocationKey = route.paramMap.get('id');
    return this.store.select(fromFavorites.getFavoriteCities).pipe(
      take(1),
      map((favoriteCities) => {
        const isFavorite = !!favoriteCities.find((favoriteCity) => favoriteCity.Key === favoriteCityLocationKey);
        if (!favoriteCityLocationKey || !isFavorite) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      }
      )
    );
  }
}
