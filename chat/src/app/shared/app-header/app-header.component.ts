import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { TapService } from "src/app/services/tap/tap.service";
import { DiscoverService } from "src/app/services/discover/discover.service";
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() settings = new EventEmitter();

  @Input() pageName:any = null;
  @Input() viewedProfile: any;

  hidingTapStatus:any;
  private viewedProfileSubscription!: Subscription;
  private tapStatusSourceSubscription!: Subscription;

  constructor(private tapService: TapService, private discoverService: DiscoverService){}

 ngOnInit(): void {
  this.tapStatusSourceSubscription = this.tapService.getHidingTapStatus.subscribe(status => {
    this.hidingTapStatus = status

   });

   this.viewedProfileSubscription = this.discoverService.getDisplayedProfile.subscribe(profile => {
    this.viewedProfile = profile;
   })
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
 }

 ngOnDestroy(): void {
   this.pageName = null;
   if (this.tapStatusSourceSubscription) {
    this.tapStatusSourceSubscription.unsubscribe();
  }

  if (this.viewedProfileSubscription) {
    this.viewedProfileSubscription.unsubscribe()
  }
 }
}
