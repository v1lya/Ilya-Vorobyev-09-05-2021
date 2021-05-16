import {Component, Input, OnInit} from '@angular/core';
import {CityCurrentWeather} from '../../../models/city-current-weather.model';


@Component({
  selector: 'app-favorite-item',
  templateUrl: './favorite-item.component.html',
  styleUrls: ['./favorite-item.component.scss']
})
export class FavoriteItemComponent implements OnInit {
  @Input() favoriteCityWeather: CityCurrentWeather;

  constructor() {
  }

  ngOnInit(): void {
  }
}
