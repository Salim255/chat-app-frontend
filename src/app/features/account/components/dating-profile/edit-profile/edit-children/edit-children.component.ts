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
  selector: 'app-edit-children',
  templateUrl: './edit-children.component.html',
  styleUrls: ['./edit-children.component.scss'],
  standalone: false
})

export class EditChildrenComponent {
  @Input() childrenStatus!: boolean;
  constructor(private editingProfileService: EditingProfileService){}

  onEditFormModal(): void {
      this.editingProfileService.onEditFormModal(FieldName.Children, this.childrenStatus);
  }
}
