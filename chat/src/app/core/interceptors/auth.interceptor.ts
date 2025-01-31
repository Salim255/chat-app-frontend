import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    // Fetch token from Capacitor Preferences
    return from(Preferences.get({ key: 'authData' })).pipe(
      switchMap((storedData) => {
        if (!storedData || !storedData.value) {
          // Proceed without token if no auth data is stored
          return next.handle(req);
        }

        const parsedData = JSON.parse(storedData.value) as {
          _token: string;
          userId: string;
          tokenExpirationDate: string;
        };

        const token = parsedData._token;

        // Clone the request and add the Authorization header
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(authReq);
      })
    );
  }
}
