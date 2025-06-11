import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

export enum SexOrientation {
  Straight = 'straight',
  Heterosexual = 'heterosexual',
  Gay = 'gay',
  Lesbian = 'lesbian',
  Bisexual = 'bisexual',
  Asexual = 'asexual',
  Pansexual = 'pansexual',
  Queer = 'queer',
  Questioning = 'questioning',
  Demisexual = 'demisexual',
}

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
      this.editingProfileService.onEditFormModal(FieldName.SexOrientation, this.sexOrientation);
  }
}
