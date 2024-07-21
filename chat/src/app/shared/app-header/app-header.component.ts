import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnDestroy {
  @Output() settings = new EventEmitter();

  @Input() pageName:any = null;
  constructor(){}


 displayLeftIcon(pageName: string) {
  switch(pageName) {
    case 'community':
      return 'options';

    case 'account':
        return 'settings';

    case 'friends' :
      return 'shield'

    case 'conversations':
      return 'shield';

    default:
      return
  }
 }

 onSettings(pageName: string) {
  if (pageName === 'account') {
    this.settings.emit()
  }
 }

 ngOnDestroy(): void {
   this.pageName = null;
 }
}
