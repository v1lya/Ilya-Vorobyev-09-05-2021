import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CityWeatherComponent} from './components/city-weather/city-weather.component';

const routes: Routes = [
  {path: '', component: CityWeatherComponent}
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
export class CityWeatherRoutingModule {
}
