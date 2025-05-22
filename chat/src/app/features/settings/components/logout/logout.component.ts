import { Component } from '@angular/core';
import { AuthService } from 'src/app/features/auth/services/auth.service';
import { SettingService } from '../../services/setting.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  standalone: false,
})
export class LogoutComponent {
  constructor(
    private settingService: SettingService,
    private authService: AuthService) {}

  onLogout():void {
    this.settingService.dismissSetting();
    //this.authService.logout();
  }
}
