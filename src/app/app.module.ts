import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, JsonPipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [ AppComponent ],
  bootstrap: [ AppComponent ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    CoreModule ,
    AppRoutingModule,
    SharedModule,
     /* AngularFireModule.initializeApp(environment.firebaseConfig), */
    AngularFireMessagingModule,
  ],
  providers: [
    JsonPipe,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    }
  ],
})
export class AppModule {}
