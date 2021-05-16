import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {FavoritesListComponent} from './components/favorites-list/favorites-list.component';
import {FavoriteCityGuard} from '../guards/favorite-city.guard';

const routes: Routes = [
  {path: '', component: FavoritesListComponent},
  {path: ':id', loadChildren: () => import('../city-weather/city-weather.module').then(m => m.CityWeatherModule), canActivate: [FavoriteCityGuard]}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class FavoriteCitiesRoutingModule {
}
