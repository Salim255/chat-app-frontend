import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";
import { Gender } from "src/app/features/auth/components/create-profile/create-profile.component";

@Component({
  selector: "app-edit-gender",
  templateUrl: "./edit-gender.component.html",
  styleUrls: ["./edit-gender.component.scss"],
  standalone: false
})

export class EditGenderComponent {
  @Input() gender!: Gender;
  TypeGender = Gender;
  constructor(private editingProfileService: EditingProfileService ) {}
  onBack(): void {
    //this.location.back()
  }

  onEditFormModal(): void {
    this.editingProfileService.onEditFormModal(FieldName.Gender, this.gender);
  }

  formatGender(gender: Gender): string | null{
    switch(gender){
      case this.TypeGender.Female:
        return 'woman';
      case this.TypeGender.Male:
        return 'man';
      case this.TypeGender.Other:
        return 'other';
      default:
        return null
    }
  }

}
