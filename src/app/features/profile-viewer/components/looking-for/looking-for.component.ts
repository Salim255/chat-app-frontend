import { Component, Input } from '@angular/core';

export enum LookingFor {
  Chat = 'chat',
  Friendship = 'friendship',
  Casual = 'casual',
  LongTerm = 'long_term',
}

@Component({
  selector: 'app-profile-looking-for',
  templateUrl: './looking-for.component.html',
  styleUrls: ['./looking-for.component.scss'],
  standalone: false,
})
export class LookingForComponent {
  @Input() lookingFor!: LookingFor;
}
