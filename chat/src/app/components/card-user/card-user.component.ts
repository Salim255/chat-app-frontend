import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { Friend } from 'src/app/models/friend.model';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent  implements OnInit, OnChanges {
  @Input() friend!: any;
  @Output() shiftList = new EventEmitter();
  @Output() addFriend = new EventEmitter<number>();

  constructor(private renderer: Renderer2) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.friend);
  }

  ngOnInit() {
    console.log("hello");
  }

  onSkip(){
    this.shiftList.emit();
  }
  onAddFriend() {
    if (this.friend?.id){
      this.addFriend.emit(this.friend.id);
    }
  }

}
