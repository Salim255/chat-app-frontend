import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})

export class AccountInfoComponent {

  constructor (private router: Router) {}
  onEditProfile(){
      this.router.navigate(['/tabs/edit-profile'])
  }
}
