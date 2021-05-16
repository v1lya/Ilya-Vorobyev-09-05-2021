import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'main', loadChildren: () => import('./city-weather/city-weather.module').then(m => m.CityWeatherModule)},
  {path: 'favorites', loadChildren: () => import('./favorite-cities/favorite-cities.module').then(m => m.FavoriteCitiesModule)},
  {path: '**', redirectTo: '/main'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
