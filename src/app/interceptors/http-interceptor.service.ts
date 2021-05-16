import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  isDevelopment = !environment.production;

  constructor() {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.isDevelopment) {
      return next.handle(request);
    }

    const url = request.url.replace('/assets', environment.baseAPI);
    let params = request.params.append('apikey', environment.APIKey);
    if (request.url.includes('forecasts')) {
      params = params.appendAll(
        {
          details: 'false',
          metric: 'true'
        }
      );
    }
    const modifiedRequest = request.clone({
      url, params
    });
    return next.handle(modifiedRequest);
  }
}
