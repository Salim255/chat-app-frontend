import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccountInfoComponent } from './components/account-info/account-info.component';
import { AccountDeletionComponent } from '../settings/account-deletion/account-deletion.component';
import { ContactUsComponent } from '../settings/contact-us/contact-us.component';
import { LicenseComponent } from '../settings/licenses/license.component';
import { PrivacyComponent } from '../settings/privacy/privacy.component';
import { TermServiceComponent } from '../settings/terms-services/term-service.component';
import { LogoutComponent } from '../settings/logout/logout.component';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    AccountInfoComponent,
    AccountDeletionComponent,
    ContactUsComponent,
    LicenseComponent,
    PrivacyComponent,
    TermServiceComponent,
    LogoutComponent,
  ],
  exports: [
    AccountInfoComponent,
    AccountDeletionComponent,
    ContactUsComponent,
    LicenseComponent,
    PrivacyComponent,
    TermServiceComponent,
    LogoutComponent,
  ],
})
export class AccountFeatureModule {}
