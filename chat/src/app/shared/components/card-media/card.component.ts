import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-media',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: false,
})
export class CardMediaComponent {
  @Input() photo: string | null = null;
  constructor() {}
}
