import { Component } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-landing-page",
  templateUrl: './app-landing.page.html',
  styleUrls: ['./app-landing.page.scss'],
  standalone: false
})

export class AppLandingPage {
   constructor(private authService: AuthService, private router : Router  ){}

   onCreate(): void{
      this.authService.setAuthMode('create');
      this.navigateToAuthPage();
   }

   onSignIn(): void {
    this.authService.setAuthMode('sign-in');
    this.navigateToAuthPage();
   }

   navigateToAuthPage() {
    this.router.navigate(['/auth'])
   }
}
