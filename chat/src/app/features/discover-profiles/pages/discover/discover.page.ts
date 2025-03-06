import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs';
import { DiscoverProfileToggle, DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { TabsService } from 'src/app/tabs/services/tabs/tabs.service';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
    standalone: false
})

export class DiscoverPage implements OnInit, OnDestroy {
  @ViewChild("footer", {static: false, read: ElementRef}) footer!: ElementRef;
  isConnected: boolean= true;
  foreignersList: Member [] = [];
  viewedProfile: Member | null = null;
  transform: string | null = null;
  discoverToggleStatus: boolean = true;

  private foreignersSource!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;
  private discoverProfileToggleSubscription!: Subscription;

  constructor (
     private discoverService: DiscoverService,
     private networkService:  NetworkService,
     private accountService: AccountService,
     private tabsService: TabsService,
    ) {}

  ngOnInit () {
    this.subscribeNetwork();
    this.subscribeProfileToRemove();
    this.subscribeToDiscoverProfileToggle();
  }

  selectTab() {
    console.log("hello from dicover")
   this.tabsService.selectedTab('account');
  }

  ionViewWillEnter () {
    this.discoverService.fetchUsers().subscribe();
    this.accountService.fetchAccount().subscribe();
  }

  private subscribeToDiscoverProfileToggle(){
    this.discoverProfileToggleSubscription = this.discoverService.getDiscoverProfileToggleStatus.subscribe(status =>
      this.discoverToggleStatus = status === 'collapse'
    )
  }
  private subscribeProfileToRemove() {
    if (this.profileToRemoveSubscription && !this.profileToRemoveSubscription.closed)  {
       this.profileToRemoveSubscription.unsubscribe();
    }
    this.profileToRemoveSubscription = this.discoverService.getProfileToRemoveId.subscribe(profileId => {
      if (profileId !== null && profileId !== undefined) this.removeProfileFromList(profileId)
    })
  }

  private subscribeNetwork() {
    this.netWorkSubscription = this.networkService.getNetworkStatus().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (isConnected) {
        this.loadForeignersList();
      }
    })
  }

  private loadForeignersList(){
    this.foreignersSource = this.discoverService.getNoConnectedFriendsArray.subscribe( (profiles )=> {
      this.foreignersList = profiles;
    });
  }

  // Getter for the current profile
  removeProfileFromList(profileId: number): void {
    this.foreignersList = this.foreignersList.filter((profile: Member) => profile.user_id !== profileId);
  }


  ngOnDestroy () {
    this.netWorkSubscription?.unsubscribe();
    this.foreignersSource?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
    this.discoverProfileToggleSubscription?.unsubscribe();
  }
}
