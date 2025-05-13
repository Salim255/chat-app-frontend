import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingSpinnerService } from 'src/app/shared/components/app-loading-spinner/loading-spinner.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private excludedEndpoints = ['/friends', '/chats', '/messages' , '/users/discover', '/matches' ];

  constructor(private loadingService: LoadingSpinnerService) {}

  intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    // Skip spinner if request is POST and URL ends with one of the excluded endpoints
    const shouldExclude = this.excludedEndpoints.some(endpoint =>
      req.url.includes(endpoint)
    );

    if (shouldExclude) {
      return next.handle(req);
    }

    this.loadingService.showSpinner();
    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hideSpinner();
      })
    );
  }
}
