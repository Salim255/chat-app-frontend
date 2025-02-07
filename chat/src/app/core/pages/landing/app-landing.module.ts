import { NgModule } from "@angular/core";
import { AppLandingPage } from "./app-landing.page";
import { IonicModule } from "@ionic/angular";
import { AppLandingPageRoutingModule } from "./app-landing.routing.module";

@NgModule({
  imports: [IonicModule, AppLandingPageRoutingModule],
  declarations: [AppLandingPage ]
})

export class AppLandingPageModule {

}
