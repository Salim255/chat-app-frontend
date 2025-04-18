import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from 'src/app/shared/components/app-loading-spinner/loading-spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private excludedEndpoint = '/friends';

  constructor(private loadingService: LoadingSpinnerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Check if the request is a POST and ends with '/friends'
    if (req.method === 'POST' && req.url.endsWith(this.excludedEndpoint)) {
      return next.handle(req); // Skip the loading spinner
    }

    this.loadingService.showSpinner()
    return next.handle(req)
    .pipe(
      finalize(() => {
        this.loadingService.hideSpinner()
      })
    );
  }
}
