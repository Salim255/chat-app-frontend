import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-distance',
  templateUrl: './distance.component.html',
  styleUrls: ['./distance.component.scss'],
  standalone: false,
})
export class DistanceComponent {
  @Input() city!: string;
  constructor() {}

}
