import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AccountInfoComponent } from "./components/account-info/account-info.component";
import { ShoppingCardsComponent } from "./components/shopping-cards/shopping-cards.component";
import { CardComponent } from "./components/shopping-cards/card/card.component";
import { FeaturesComponent } from "./components/features/features.component";
import { FeatureCardComponent } from "./components/features/card/feature-card.component";
import { FeatureCardHeaderComponent } from "./components/features/card/feature-card-header/feature-cared-header.component";
import { DetailsComponent } from "./components/features/card/details/details.component";


@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
imports: [ CommonModule, FormsModule, IonicModule
],
declarations: [ AccountInfoComponent, ShoppingCardsComponent,
                CardComponent, FeaturesComponent, FeatureCardComponent,
                FeatureCardHeaderComponent, DetailsComponent ],
exports: [ AccountInfoComponent, ShoppingCardsComponent,
  CardComponent, FeaturesComponent, FeatureCardComponent,
  FeatureCardHeaderComponent, DetailsComponent ]
})
export class AccountModule {

}
