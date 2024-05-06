import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges } from '@angular/core';
import { Friend } from 'src/app/models/friend.model';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.scss'],
})
export class CardUserComponent {
  @Input() foreigner!: any;
  @Output() shiftList = new EventEmitter();
  @Output() addFriend = new EventEmitter<number>();

  constructor (private renderer: Renderer2) { }

  onSkip () {
    this.shiftList.emit();
  }

  onAddFriend () {
    if (this.foreigner.id) {
      this.addFriend.emit(this.foreigner.id);
    }
  }

}
