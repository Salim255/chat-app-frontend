import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})

export class AppHeaderComponent implements OnInit, OnDestroy {
  @Output() settings = new EventEmitter();

  @Input() pageName:any = null;
  constructor(){}

 ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  console.log(this.pageName);

 }
 displayLeftIcon(pageName: string) {
  switch(pageName) {
    case 'community':
      return 'options';

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

 onSettings(pageName: string) {
  if (pageName === 'account') {
    this.settings.emit()
  }
 }



 ngOnDestroy(): void {
   this.pageName = null;
 }
}
