import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss'],
  standalone: false,
})
export class AboutMeComponent {
  @Input() bio!: string;
  constructor(){}
}
