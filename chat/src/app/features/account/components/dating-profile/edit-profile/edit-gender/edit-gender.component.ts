import { Component } from "@angular/core";

@Component({
  selector: "app-edit-gender",
  templateUrl: "./edit-gender.component.html",
  styleUrls: ["./edit-gender.component.scss"],
  standalone: false
})

export class EditGenderComponent {
  constructor() {}
  onBack(): void {
    //this.location.back()
  }
}
