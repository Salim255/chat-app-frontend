import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { delay, finalize, mergeMap } from 'rxjs/operators';
import { LoadingSpinnerService } from 'src/app/shared/components/app-loading-spinner/loading-spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingSpinnerService) {}
  counter = 0;
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.showSpinner()
    return next.handle(req)
    .pipe(
      finalize(() => {
        this.loadingService.hideSpinner()
      })
    );
  }
}
