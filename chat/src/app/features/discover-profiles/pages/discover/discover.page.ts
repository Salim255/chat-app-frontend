import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs';
import {  DisableProfileSwipe, DiscoverService } from 'src/app/features/discover-profiles/services/discover.service';
import { NetworkService } from 'src/app/core/services/network/network.service';
import { AccountService } from 'src/app/features/account/services/account.service';
import { Member } from 'src/app/shared/interfaces/member.interface';
import { TabsService } from 'src/app/tabs/services/tabs/tabs.service';
import { IonContent } from '@ionic/angular';
import { StringUtils } from 'src/app/shared/utils/string-utils';

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

  private membersSource!: Subscription;
  private netWorkSubscription!: Subscription;
  private profileToRemoveSubscription!: Subscription;
  private discoverProfileToggleSubscription!: Subscription;

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

  isSwiping: boolean = false;
  onSwipeLeft(event: any) {
    if (this.isSwiping) return; // Prevent multiple swipes
     console.log("swipet left")
     this.animateSwipe('left');
     //this.handleDislikeProfile();
   }

   onSwipeRight(event: any) {
     //if (this.isAnimating || !this.profile) return;
     //this.isAnimating = true;
     this.animateSwipe('right');

   }

   private animateSwipe(direction: 'left' | 'right') {
    console.log("Hello", this.cardElement)
    if (! this.cardElement) return;
    const element = this.cardElement.nativeElement as HTMLElement | null;

    if (!element) return;
    // Apply swipe animation
    element.style.transition = 'transform 0.3s ease-out';
    const translateX = direction === "left" ? "-150vw" : "150vw";
    element.style.transform = `translateX(${translateX}) rotate(${direction === "left" ? "-5deg" : "5deg"})` ;
  }
  //
  trackById(index: number, item: Member): number {
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
  }
  ionViewWillLeave() {
    this.showTabs = false;
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

  closeProfileViewer() {

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
    this.membersSource = this.discoverService.getNoConnectedFriendsArray.subscribe( (profiles )=> {
      this.membersList = [...profiles];
      console.log(profiles, 'just befor')
      if (this.membersList) {
        this.membersList.forEach(member => {
           // member.avatar = StringUtils.getAvatarUrl(member.avatar)
        })
      }

      console.log(this.membersList, 'after')
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
  }
}
