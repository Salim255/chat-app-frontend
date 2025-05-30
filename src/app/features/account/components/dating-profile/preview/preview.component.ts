import { Component, OnDestroy, OnInit } from "@angular/core";
import { AccountService } from "../../../services/account.service";
import { Subscription } from "rxjs";
import { PageName } from "src/app/shared/components/profile/slider/slider.component";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  standalone: false,
})
export class PreviewComponent implements OnInit, OnDestroy {
  private accountSubscription!: Subscription;
  account!: any;
  pagName: PageName = PageName.DatingProfile;
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToAccount()

  }

  private subscribeToAccount():void{
    this.accountSubscription = this.accountService.getAccount.subscribe((account) => {
      console.log(account);
      this.account = account;

    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.accountSubscription?.unsubscribe()
  }
}
