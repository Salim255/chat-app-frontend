import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paired-photos',
  templateUrl: './paired-photos.component.html',
  styleUrls: ['./paired-photos.component.scss'],
  standalone: false,
})
export class PairedPhotosComponent {
  @Input() matchedAvatar!: string ;
  @Input() hostUserPhoto!: string ;

  constructor() {}
}
