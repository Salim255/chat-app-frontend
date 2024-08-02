import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { TapService } from "src/app/services/tap/tap.service";
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() settings = new EventEmitter();

  @Input() pageName:any = null;
  hidingTapStatus:any;
  private tapStatusSourceSubscription!: Subscription;

  constructor(private tapService: TapService){}

 ngOnInit(): void {
  this.tapStatusSourceSubscription = this.tapService.getHidingTapStatus.subscribe(status => {
    console.log(status);
    this.hidingTapStatus = status

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
        return  'notifications';
      }

    default:
      return  'notifications';
  }
 }

 onSettings(pageName: string) {
  if (pageName === 'account') {
    this.settings.emit()
  }
 }



 ngOnDestroy(): void {
   this.pageName = null;
   if (this.tapStatusSourceSubscription) {
    this.tapStatusSourceSubscription.unsubscribe();
  }
 }
}
