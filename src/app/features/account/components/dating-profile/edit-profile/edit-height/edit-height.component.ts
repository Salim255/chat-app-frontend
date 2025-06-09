import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

@Component({
  selector: 'app-edit-height',
  templateUrl: './edit-height.component.html',
  styleUrls: ['./edit-height.component.scss'],
  standalone: false,
})

export class EditHeightComponent {
  @Input() userHeight!: number | null;
  constructor(private editingProfileService: EditingProfileService){}

  onEditFormModal(): void {
    this.editingProfileService.onEditFormModal(FieldName.UserHeight, this.userHeight);
  }
}
