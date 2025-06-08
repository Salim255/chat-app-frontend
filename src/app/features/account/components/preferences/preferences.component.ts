import { Component, OnInit } from "@angular/core";
import { PreferencesService } from "../../services/preferences.service";
import { AccountService } from "../../services/account.service";
import { Subscription } from "rxjs";
import { Account } from "../../models/account.model";

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'],
  standalone: false,
})

export class PreferencesComponent implements OnInit{
  account!: Account;
  private accountSubscription!: Subscription;
  constructor(
    private accountService: AccountService,
    private preferencesService : PreferencesService ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToAccount();

  }

  onBack():void{
    this.preferencesService.dismissPreferences();
  }

  private subscribeToAccount():void{
    this.accountSubscription = this.accountService.getAccount.subscribe((account) => {
      if (account) this.account  = account;
    });
  }
}
