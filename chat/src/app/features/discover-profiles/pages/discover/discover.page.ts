import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { ItsMatchModalService } from 'src/app/features/matches/services/its-match-modal.service';
import { Member } from 'src/app/shared/interfaces/member.interface';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
    standalone: false
})

export class DiscoverPage implements OnInit, OnDestroy {
  isConnected: boolean= true;
  foreignersList: Member [] = [];
  viewedProfile: Member | null = null;
  transform: string | null = null;


  profilesToShare: any;
  private foreignersSource!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;

  constructor (
     private discoverService: DiscoverService,
     private networkService:  NetworkService,
     private accountService: AccountService,
     private itsMatchModalService: ItsMatchModalService
    ) {}

  ngOnInit () {
    this.subscribeNetwork();
    this.subscribeProfileToRemove();
  }

  ionViewWillEnter () {
    this.discoverService.fetchUsers().subscribe();
    this.accountService.fetchAccount().subscribe();
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
    this.foreignersList = this.foreignersList.filter((profile: Member) => profile.id !== profileId);
  }

  ngOnDestroy () {
    this.netWorkSubscription?.unsubscribe();
    this.foreignersSource?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
  }
}
