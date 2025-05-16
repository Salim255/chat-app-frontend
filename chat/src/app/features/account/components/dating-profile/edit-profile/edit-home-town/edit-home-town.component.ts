import { Component } from "@angular/core";

@Component({
  selector: "app-edit-home-town",
  templateUrl: "./edit-home-town.component.html",
  styleUrls: ["./edit-home-town.component.scss"],
  standalone: false,
})

export class EditHomeTownComponent {
  constructor() {}
  onBack(): void {
    //this.location.back()
  }
}
