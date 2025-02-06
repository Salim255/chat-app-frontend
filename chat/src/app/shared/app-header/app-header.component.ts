import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { TapService } from "src/app/services/tap/tap.service";
import { ProfileViewerService } from "src/app/features/profile-viewer/services/profile-viewer.service";
import { Router } from "@angular/router";
import { PhotoService, TakingPictureStatus } from "src/app/core/services/media/photo.service";

@Component({
    selector: 'app-header',
    templateUrl: './app-header.component.html',
    styleUrls: ['./app-header.component.scss'],
    standalone: false
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() settings = new EventEmitter();

  @Input() pageName:any = null;
  @Input() partnerInfo: any;
  viewedProfile: any;

  hidingTapStatus:any;
  private viewedProfileSubscription!: Subscription;
  private tapStatusSourceSubscription!: Subscription;

  private takingPictureStateSourceSubscription!: Subscription;
  takingPictureStatus: TakingPictureStatus = 'Off';

  constructor(private tapService: TapService,
    private profileViewerService: ProfileViewerService,
    private photoService: PhotoService, private router: Router ){}

 ngOnInit(): void {
  this.tapStatusSourceSubscription = this.tapService.getHidingTapStatus.subscribe(status => {
    this.hidingTapStatus = status;
   });

   this.viewedProfileSubscription = this.profileViewerService.getProfileToDisplay.subscribe(profile => {
      this.viewedProfile = profile;
   })

   this.takingPictureStateSourceSubscription = this.photoService.getTakingPictureStatus.subscribe(status => {
    if (status === 'Pending') {
      this.takingPictureStatus = status;
    } else {
      this.takingPictureStatus = status
    }
  }
   )
 }

 showAppLogo() {
    switch(this.pageName) {
      case 'active-conversation':
        return false;
      default:
        return true;
    }
  }
 displayRightIcon(pageName: string) {
  switch(pageName) {
    case 'discover':
      if (this.hidingTapStatus === 'hide') {
        return 'eye-off'
      } else {
        return 'options';
      }

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

 displayLeftIcon(pageName: string) {
  switch(pageName) {
    case 'discover':
      if (this.hidingTapStatus === 'hide') {
           return ''
      } else {
        return  '';
      }
    default:
      return  'notifications';
  }
 }


 setRightIconCss(pageName: string) {
  switch(pageName){
    case 'discover':
      if (this.hidingTapStatus === 'hide') {
        return 'btn btn__eye'
      } else {
        return ''
      }
    default:
      return ''
  }
 }
 onRightBtn(pageName: string) {
  if (pageName === 'account') {
    this.settings.emit();
  }

  if (pageName === 'discover') {
    if (this.hidingTapStatus === 'hide') {
      this.tapService.setTapHidingStatus('show')
    }
  }

  if (pageName === 'profile-viewer') {
    if (this.hidingTapStatus === 'hide') {
        this.tapService.setTapHidingStatus('show')
    }
    this.profileViewerService.closeModal();
    this.router.navigateByUrl('/tabs/community')
  }
 }

  onSavePicture() {
    this.photoService.setTakingPictureStatus('Success');
  }

 ngOnDestroy(): void {
   this.pageName = null;
   if (this.tapStatusSourceSubscription) {
    this.tapStatusSourceSubscription.unsubscribe();
  }

  if (this.viewedProfileSubscription) {
    this.viewedProfileSubscription.unsubscribe()
  }

  if (this.takingPictureStateSourceSubscription) {
    this.takingPictureStateSourceSubscription.unsubscribe();
  }
 }
}
