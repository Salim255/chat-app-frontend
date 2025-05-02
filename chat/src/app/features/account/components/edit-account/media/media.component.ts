import { Component } from '@angular/core';

@Component({
  selector: 'app-account-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  standalone: false,
})
export class AccountMediaComponent {
  mediaList: Array<any>;
  constructor() {
    this.mediaList = [1, 2, 3, 4, 5];
  }
}
