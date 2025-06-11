import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

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

  formatText(childrenStatus: boolean): string{
    switch(childrenStatus){
      case true:
        return 'I have children';
      case false:
        return `I don't have children`;
      default:
        return '-'
    }
  }
}
