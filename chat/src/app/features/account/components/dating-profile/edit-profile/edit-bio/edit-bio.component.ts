import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

@Component({
  selector: "app-edit-bio",
  templateUrl: "./edit-bio.component.html",
  styleUrls: [ "./edit-bio.component.scss" ],
  standalone: false,
})
export class EditBioComponent {
  @Input() bio: string = '';
  constructor(private editingProfileService: EditingProfileService) {}
  onEditFormModal(): void {
    this.editingProfileService.onEditFormModal(FieldName.Bio, this.bio);
  }
}
