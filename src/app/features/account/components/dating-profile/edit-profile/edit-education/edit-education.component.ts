import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";


@Component({
  selector: 'app-edit-education',
  templateUrl: './edit-education.component.html',
  styleUrls: ['./edit-education.component.scss'],
  standalone: false
})

export class EditEducationComponent {
  @Input() userEducation!: string | null;
  constructor(private editingProfileService: EditingProfileService){}

  onEditFormModal(): void {
      this.editingProfileService.onEditFormModal(FieldName.Education, this.userEducation);
  }
}
