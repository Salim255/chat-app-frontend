import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AccountService } from "../../../services/account.service";
import { Account } from "../../../models/account.model";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  standalone: false,
})
export class EditProfileComponent implements OnInit, OnDestroy {
  account!: Account;
  private accountSubscription!: Subscription;

  constructor(private accountService: AccountService) {}

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
       if (account) this.account  = account;
    });
  }

  ngOnDestroy(): void {
    this. accountSubscription?.unsubscribe();
  }
}
