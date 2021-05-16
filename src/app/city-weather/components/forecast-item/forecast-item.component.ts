import {Component, Input, OnInit} from '@angular/core';
import {ForecastWeather} from '../../../models/forecast-weather.model';

@Component({
  selector: 'app-forecast-item',
  templateUrl: './forecast-item.component.html',
  styleUrls: ['./forecast-item.component.scss']
})
export class ForecastItemComponent implements OnInit {
  @Input() forecastDay: ForecastWeather;

  constructor() {
  }

  ngOnInit(): void {
  }

}
