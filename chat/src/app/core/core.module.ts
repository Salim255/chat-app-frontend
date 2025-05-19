import { isDevMode, NgModule, Optional, SkipSelf } from "@angular/core";
import { WorkerService } from "./workers/worker.service";
import { LoadingInterceptor } from "./interceptors/loading.interceptor";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { CustomHammerConfig } from "./configs/hammer-config";
import { HAMMER_GESTURE_CONFIG, HammerModule } from "@angular/platform-browser";
import { ServiceWorkerModule } from "@angular/service-worker";

@NgModule({
  imports: [
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
