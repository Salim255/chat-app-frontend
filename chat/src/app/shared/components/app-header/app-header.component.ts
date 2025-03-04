import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { TabsService } from "src/app/tabs/services/tabs/tabs.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
import { Router } from "@angular/router";
import { PhotoService, TakingPictureStatus } from "src/app/core/services/media/photo.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { NavController } from "@ionic/angular";

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    standalone: false
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() settings = new EventEmitter();
  @Input() pageName: string | null = null;
  @Input() partnerInfo!: Partner;

  // Subscriptions
  private viewedProfileSubscription!: Subscription;
  private tapStatusSourceSubscription!: Subscription;
  private takingPictureStateSourceSubscription!: Subscription;

  // States
  viewedProfile: any;
  hidingTapStatus:any;
  takingPictureStatus: TakingPictureStatus = 'Off';

  constructor(private tabsService: TabsService,
    private profileViewerService: ProfileViewerService,
    private photoService: PhotoService, private router: Router,
    private navController: NavController ){}

 ngOnInit(): void {

  // Subscribe to service
  this.subscribeToServices();
 }

 private subscribeToServices(): void {

  this.tapStatusSourceSubscription = this.tabsService.getHidingTapStatus.subscribe(status => {
    this.hidingTapStatus = status;
   });

   this.viewedProfileSubscription = this.profileViewerService.getProfileToDisplay.subscribe(profile => {
      this.viewedProfile = profile;
   })

   this.takingPictureStateSourceSubscription = this.photoService.getTakingPictureStatus.subscribe(status =>
    {
      this.takingPictureStatus = status;
    });
 }

 // Unsubscribe from all services
 private unsubscribeFromServices(): void {
    this.pageName = null;
    this.tapStatusSourceSubscription?.unsubscribe();
    this.viewedProfileSubscription?.unsubscribe()
    this.takingPictureStateSourceSubscription?.unsubscribe();

 }

 // Determine if the logo should be shown
 showAppLogo() {
    return this.pageName !== 'active-conversation';
  }

 // Determine right con based on the current page name
 displayRightIcon(pageName: string | null): string | undefined {
  switch( pageName  ) {
    case 'discover':
      return this.hidingTapStatus === 'hide' ? 'eye-off' : 'options';
    case 'account':
        return 'settings';

    case 'friends' :
      return 'shield';

    case 'conversations':
      return 'shield';

    case 'matches':
        return 'shield';
    case 'auth':
      return ;
    case 'profile-viewer':
      return 'close-outline';
    case 'active-conversation':
        return 'ellipsis-horizontal-outline';
    default:
      return
  }
 }

 // Determine left icon based on the current page  name
 displayLeftIcon(pageName: string | null): string {
  if (pageName === 'discover' && this.hidingTapStatus === 'hide') return '';
  return 'notifications';
 }


 // Set css class for right icon
 setRightIconCss(pageName: string | null): string {
  if (pageName === 'discover' && this.hidingTapStatus === 'hide') return 'btn btn__eye'
  return '';
 }

 // Handle button clicks for right button
 onRightBtn(pageName: string | null): void {
  switch(pageName) {
    case 'account':
      this.settings.emit();
      break;
    case 'discover':
      if (this.hidingTapStatus === 'hide') {
        this.tabsService.setTapHidingStatus('show')
      }
      break;
    case 'profile-viewer':
      if (this.hidingTapStatus === 'hide') {
        this.tabsService.setTapHidingStatus('show')
        }
      this.profileViewerService.closeModal();
      this.router.navigateByUrl('/tabs/discover');
      break;
    default:
      return;
  }
 }

// Back to account page


 // Handle the save picture action
 onSavePicture(): void {
    this.photoService.setTakingPictureStatus('Success');
  }

 ngOnDestroy(): void {
      this.unsubscribeFromServices();
 }
}
