import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

@Component({
  selector: "app-edit-gender",
  templateUrl: "./edit-gender.component.html",
  styleUrls: ["./edit-gender.component.scss"],
  standalone: false
})

export class EditGenderComponent {
  @Input() gender: string = '';
  constructor(private editingProfileService: EditingProfileService ) {}
  onBack(): void {
    //this.location.back()
  }

  onEditFormModal(): void {
    this.editingProfileService.onEditFormModal(FieldName.Gender, this.gender);
  }

}
