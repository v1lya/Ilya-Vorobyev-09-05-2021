import {NgModule} from '@angular/core';
import {FavoriteItemComponent} from './components/favorite-item/favorite-item.component';
import {FavoritesListComponent} from './components/favorites-list/favorites-list.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {FavoriteCitiesRoutingModule} from './favorite-cities-routing.module';
import {StoreModule} from '@ngrx/store';
import {favoritesReducer} from './state/favorites.reducer';
import {TemperaturePipeModule} from '../pipes/temperature-pipe.module';

@NgModule({
  declarations: [
    FavoriteItemComponent,
    FavoritesListComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    FavoriteCitiesRoutingModule,
    StoreModule.forFeature('favorites', favoritesReducer),
    TemperaturePipeModule
  ],
  exports: [
  ]
})
export class FavoriteCitiesModule {
}
