import { Injectable } from "@angular/core";

import { AuthService } from "../services/auth/auth.service";
import {CanLoad, GuardResult, MaybeAsync, Route, Router, UrlSegment } from "@angular/router";
import { Preferences } from "@capacitor/preferences";
import { Observable, from, of, switchMap, take, tap } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class AuthGuard implements CanLoad {

  constructor(private authService: AuthService, private router: Router){}
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap((isAuthenticated) => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        }  else {
          return of(isAuthenticated);
        }
      }),
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl(`/auth`);
        }
      })
    )
  }
}
