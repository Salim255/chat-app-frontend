import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfileViewerPage } from './profile-viewer.page';
import { ProfileViewerPageRoutingModule } from './profile-viewer-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DiscoverPageModule } from 'src/app/features/discover/discover.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProfileViewerPageRoutingModule,
    SharedModule,
    DiscoverPageModule
],
  declarations: [
    ProfileViewerPage,
 ],
})
export class ProfileViewerPageModule {}
