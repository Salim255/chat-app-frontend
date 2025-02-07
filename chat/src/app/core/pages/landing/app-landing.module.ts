import { NgModule } from "@angular/core";
import { AppLandingPage } from "./app-landing.page";
import { IonicModule } from "@ionic/angular";
import { AppLandingPageRoutingModule } from "./app-landing.routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [IonicModule, AppLandingPageRoutingModule, SharedModule],
  declarations: [AppLandingPage ]
})

export class AppLandingPageModule {

}
