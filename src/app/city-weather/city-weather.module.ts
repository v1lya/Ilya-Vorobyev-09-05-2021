import {NgModule} from '@angular/core';
import {CityWeatherComponent} from './components/city-weather/city-weather.component';
import {ForecastItemComponent} from './components/forecast-item/forecast-item.component';
import {ForecastsListComponent} from './components/forecasts-list/forecasts-list.component';
import {SearchResultComponent} from './components/search/search-result/search-result.component';
import {SearchFieldComponent} from './components/search/search-field/search-field.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {CityWeatherRoutingModule} from './city-weather-routing.module';
import {StoreModule} from '@ngrx/store';
import {WeatherReducer} from './state/weather.reducer';
import {TemperaturePipeModule} from '../pipes/temperature-pipe.module';


@NgModule({
  declarations: [
    CityWeatherComponent,
    SearchFieldComponent,
    SearchResultComponent,
    ForecastItemComponent,
    ForecastsListComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CityWeatherRoutingModule,
    StoreModule.forFeature('weather', WeatherReducer),
    TemperaturePipeModule
  ],
  exports: [
  ]
})
export class CityWeatherModule {
}
