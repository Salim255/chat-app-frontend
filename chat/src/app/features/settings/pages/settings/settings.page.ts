import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  settingsItem = [
    { label: 'Legal', component: ['License', 'Terms of Service'], logo: false },
    {
      label: 'Privacy',
      component: ['Cookie Policy', 'Privacy Policy', 'Privacy Preferences'],
      logo: false,
    },
    { label: 'Contact us', component: ['Help & Support'], logo: false },
    { label: '', component: ['Logout'], onClick: () => this.onLogout() },
    { label: 'Version 1.0.0', component: null, logo: true },
    { label: '', component: ['Delete Account'], logo: false },
  ];

  constructor(
    private navController: NavController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('Hello Salim');
  }
  onBackArrow() {
    this.navController.back();
  }
  onLogout() {
    this.authService.logout();
  }
}
