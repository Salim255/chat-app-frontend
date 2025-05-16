import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AccountService } from "../../../services/account.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: false,
})
export class EditProfileComponent implements OnInit, OnDestroy {
  account!: any;
  private accountSubscription!: Subscription;
  constructor(private accountService: AccountService) {
    console.log('EditProfileModule loaded');
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToAccount();

  }
  onBack():void{
    //this.location.back()
  }

    private subscribeToAccount():void{
    this.accountSubscription = this.accountService.getAccount.subscribe((account) => {
      console.log(account);
      this.account = account;

    });
  }

  ngOnDestroy(): void {
    this. accountSubscription?.unsubscribe();
  }
}
