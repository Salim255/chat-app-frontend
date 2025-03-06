import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-badge',
    templateUrl: './badge.component.html',
    styleUrls: ['./badge.component.scss'],
    standalone: false
})


export class BadgeComponent {
  @Input() text!: string;
  constructor(){}

  badgeColor( ) {
    return this.text === 'offline' ? 'badge__offline' : 'badge__online';
  }
}

