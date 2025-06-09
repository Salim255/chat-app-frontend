import { Component, Input } from "@angular/core";
import { SexOrientation } from "../edit-children/edit-children.component";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

@Component({
  selector: 'app-edit-sex-orientation',
  templateUrl: './edit-sex.component.html',
  styleUrls: ['./edit-sex.component.scss'],
  standalone: false,
})

export class EditSexComponent {
  @Input() sexOrientation!: SexOrientation | null;
  constructor(private editingProfileService: EditingProfileService){}

  onEditFormModal(): void {
      this.editingProfileService.onEditFormModal(FieldName.Children, this.sexOrientation);
  }
}
