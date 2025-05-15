import { Component } from "@angular/core";

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  standalone: false,
})
export class PreviewComponent {
  constructor() {}
  onBack():void{
    //this.location.back()
  }
}
