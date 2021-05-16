import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {TemperatureUnit} from '../models/temperature-unit.enum';
import {Store} from '@ngrx/store';
import {map, takeUntil} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import * as fromRoot from '../app-state/app.reducer';

@Pipe({
  name: 'temperature',
})
export class TemperaturePipe implements PipeTransform, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private store: Store<fromRoot.AppState>) {}

  transform(temperatureValue: number | null): Observable<number> {
    return this.store.select(fromRoot.getTemperatureUnit).pipe(
      map((temperatureUnit) => {
        return temperatureUnit === TemperatureUnit.C
          ? temperatureValue
          : this.celsiusToFahrenheit(temperatureValue);
      }),
      map(temperature => Math.round(temperature as number)),
      takeUntil(this.destroy$)
    );
  }

  private celsiusToFahrenheit(celsius: number | null): number | null {
    return ((celsius as number * 9 / 5) + 32);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
