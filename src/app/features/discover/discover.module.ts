import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DiscoverPage } from './discover.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileSwipeComponent } from './components/profile-swipe/profile-swipe.component';
import { DiscoverTabsComponent } from './components/discover-tabs/discover-tabs.component';
import { ProfileViewerDescriptionComponent } from './components/profile-viewer-description/profile-viewer-description.component';
import { ProfileContentComponent } from './components/profile-content/profile-content.component';
import { InteractionBtnsComponent } from './components/interaction-btns/interaction-btns.component';
import { DiscoverHeaderComponent } from './components/profile-header/discover-header.component';
import { DiscoverPageRoutingModule } from './discover-routing.module';
import { HammerSwipeDirective } from './directives/hammer-swiper/hammer-swipe.directive';
import { ProfileViewerFeatureModule } from '../profile-viewer/profile-viewer-feature.module';
import { FormsModule } from '@angular/forms';
import { DiscoverContainerComponent } from './components/discover-cards/discover-container.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SharedModule,
    DiscoverPageRoutingModule,
    ProfileViewerFeatureModule
  ],
  declarations: [
    DiscoverPage,
    ProfileSwipeComponent,
    DiscoverTabsComponent,
    ProfileViewerDescriptionComponent,
    ProfileContentComponent,
    InteractionBtnsComponent,
    DiscoverHeaderComponent,
    HammerSwipeDirective,
    DiscoverContainerComponent
  ],
  exports: [DiscoverPage]
})
export class DiscoverPageModule {}
