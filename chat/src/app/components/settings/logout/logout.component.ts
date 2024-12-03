import { Component } from "@angular/core";
import { AuthService } from "src/app/core/services/auth/auth.service";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent {
  constructor (private authService: AuthService) {
  }

  onLogout () {
    this.authService.logout()
  }
}
