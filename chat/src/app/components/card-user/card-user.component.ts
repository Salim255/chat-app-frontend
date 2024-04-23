import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, Renderer2, SimpleChanges, ViewChildren } from '@angular/core';
import { Friend } from 'src/app/models/friend.model';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent  implements OnInit, OnChanges {
  @Input() friend!: Friend
  constructor(private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {

    console.log(this.friend);

  }

  ngOnInit() {
     console.log("hello");

  }

  userClickedButton(event: any, type: boolean) {

  }
}
