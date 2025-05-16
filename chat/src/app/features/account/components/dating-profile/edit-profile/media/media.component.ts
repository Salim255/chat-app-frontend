import { Component } from "@angular/core";
@Component({
  selector: 'app-edit-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  standalone: false,
})
export class MediaComponent {
  constructor() {}
  onBack(): void {
    //this.location.back()
  }
}
