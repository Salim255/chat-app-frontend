import { NgModule,CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { CustomHammerConfig } from './hammer.config';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, JsonPipe } from '@angular/common';

@NgModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
      BrowserAnimationsModule,
      BrowserModule,
      CommonModule,
      HammerModule,
      IonicModule.forRoot(), AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js',
        {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
      })
    ],

    providers: [
       JsonPipe,
      {
        provide: RouteReuseStrategy,
        useClass: IonicRouteStrategy
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true
      },
      {
        provide: HAMMER_GESTURE_CONFIG, useClass: CustomHammerConfig
      },
      provideHttpClient(withInterceptorsFromDi()
    )]
  }
)
export class AppModule {}
