import { isDevMode, NgModule, Optional, SkipSelf } from "@angular/core";
import { WorkerService } from "./workers/worker.service";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { CustomHammerConfig } from "./configs/hammer-config";
import { HAMMER_GESTURE_CONFIG, HammerModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from "@angular/service-worker";

// Import translation core modules
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// Import the default HTTP loader for ngx-translate
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// Import HttpClientModule and HttpClient to enable HTTP requests
import { HttpClient } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from "@angular/common";

@NgModule({
  imports: [
     // Configures TranslateModule with a custom loader
    TranslateModule.forRoot({
       loader: {
        // Specifies which loader to use for loading translations
        provide: TranslateLoader,

        // Tells Angular to use the factory function we defined
        useFactory: HttpLoaderFactory,

        // Declares dependencies needed by the factory (here, HttpClient)
        deps: [HttpClient],
      },
    }),
    HammerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    WorkerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
     {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
     {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: CustomHammerConfig,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
     provideHttpClient(withInterceptorsFromDi()),
   ]
})

export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule){
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it only in AppModule.');
    }
  }
}

// This function creates an instance of TranslateHttpLoader,
// which will load translation JSON files from the assets/i18n/ folder.
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');//
}

