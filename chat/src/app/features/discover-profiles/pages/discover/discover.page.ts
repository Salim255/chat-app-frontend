import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, take} from 'rxjs';
import {  DisableProfileSwipe, DiscoverService, InteractionType } from 'src/app/features/discover-profiles/services/discover.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { TabsService } from 'src/app/tabs/services/tabs/tabs.service';
import { IonContent } from '@ionic/angular';


@Component({
    selector: 'app-discover',
    templateUrl: './discover.page.html',
    styleUrls: ['./discover.page.scss'],
    standalone: false
})

export class DiscoverPage implements OnInit, OnDestroy {
  @ViewChild("footer", {static: false, read: ElementRef}) footer!: ElementRef;
  @ViewChild(IonContent, { static: false }) content!: IonContent;
  @ViewChild("cardElement", { static: false }) cardElement!: ElementRef;

  isConnected: boolean= true;
  membersList: Member [] = [];
  viewedProfile: Member | null = null;
  transform: string | null = null;
  discoverToggleStatus: boolean | null = true;
  profileToView: DisableProfileSwipe | null = null;

  showTabs: boolean = false;

  animationClass: string = "";

  private membersSource!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;
  private discoverProfileToggleSubscription!: Subscription;

  private listenToProfileInteractionSource!: Subscription;
  constructor (
     private discoverService: DiscoverService,
     private networkService:  NetworkService,
     private accountService: AccountService,
     private tabsService: TabsService
    ) {}

  ngOnInit () {
    this.showTabs = true;
    this.subscribeNetwork();
    this.subscribeProfileToRemove();
    this.subscribeToDiscoverProfileToggle();

  }

  ionViewDidEnter() {
    //this.showTabs = true;
    console.log("Hello Salim");

  }

  get topProfile() {
    return this.membersList.length > 0 ? this.membersList[0] : null;
  }

  isSwiping: boolean = false;

  //
  trackById(i: number, item: Member): number {
    return item.user_id; // Ensure user_id is unique
  }

  selectTab() {
    console.log("hello from dicover")
   this.tabsService.selectedTab('account');
  }

  ionViewWillEnter () {
    this.showTabs = true;
    this.discoverService.fetchUsers().subscribe();
    this.accountService.fetchAccount().subscribe();
    this.subscribeToInteraction();
  }
  ionViewWillLeave() {
    this.showTabs = false;
  }

  private subscribeToInteraction() {
    this.listenToProfileInteractionSource = this.discoverService.
      getProfileInteractionType.subscribe(interActionType => {

        console.log(interActionType, "hello")
        interActionType  && this.handleProfileInteraction(interActionType)
      })
  }

  private handleProfileInteraction(actionType: InteractionType) {
    if (actionType === 'dislike') this.handleDislikeProfile();
    if (actionType === 'like') this.handleLikeProfile();
  }


  handleDislikeProfile() {
   this.animationClass = 'swipe-left'; // Add animation class
   setTimeout(() => {
      console.log('hello',this.animationClass);
      this.removeTopProfile();
      this.animationClass = ''; // Reset the animation class
   }, 2000)
  }
  handleLikeProfile() {
      const profile = this.topProfile ?? null;
      console.log(profile, "like proifle")
      if ( profile )   {
      this.discoverService.likeProfile(profile)
      .pipe(take(1))
      .subscribe({
          next:(res) => {
            console.log(res, "hello result")
            this.removeTopProfile()
          },
          error: () => {
            console.log('Error 😇😇😇')
          }
        });
      }
  }

  removeTopProfile() {
    if (this.membersList.length > 0) {
      console.log("Hello from remove last before", this.membersList)

      this.membersList = this.membersList.slice(1);

      if (this.membersList.length === 0) {
        this.discoverService.fetchUsers().subscribe();
      }
    }
  }

  private subscribeToDiscoverProfileToggle(){
    this.discoverProfileToggleSubscription = this.discoverService.getDiscoverProfileToggleStatus.subscribe(data =>
    {

      this.discoverToggleStatus = data?.disableSwipe ? data.disableSwipe : null;
      this.profileToView = data;

      if (!this.discoverToggleStatus && this.content) {

          this.content.scrollToTop(500); // Scrolls back to the top in 500ms
      }
    }
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
    if (this.membersSource) {
      this.membersSource.unsubscribe();
    }
    this.membersSource = this.discoverService.getNoConnectedFriendsArray.subscribe( (profiles )=> {
      console.log( this.membersList, 'just befor 😍😍😍')
      this.membersList =  [...profiles];


      console.log(this.membersList, 'after🥰🥰🥰')
    });
  }

  // Getter for the current profile
  removeProfileFromList(profileId: number): void {
    this.membersList = [...this.membersList.filter(profile => profile.user_id !== profileId)];

  }


  ngOnDestroy () {
    this.netWorkSubscription?.unsubscribe();
    this.membersSource?.unsubscribe();
    this.profileToRemoveSubscription?.unsubscribe();
    this.discoverProfileToggleSubscription?.unsubscribe();
    this.listenToProfileInteractionSource?.unsubscribe();
  }
}
