import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-account-avatar',
  templateUrl: './account-avatar.component.html',
  styleUrls: ['./account-avatar.component.scss']
})
export class AccountAvatarComponent  implements OnInit{
  userImageUrl: string = "https://images.unsplash.com/photo-1440589473619-3cde28941638?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGVvcGxlfGVufDB8fDB8fHww"
  constructor(){}
  ngOnInit(): void {
    console.log('====================================');
    console.log("Hello");
    console.log('====================================');

  }
}
