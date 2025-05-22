import { Component, Input } from "@angular/core";
import { EditingProfileService, FieldName } from "src/app/features/account/services/editing-profile.service";

@Component({
  selector: "app-edit-home-town",
  templateUrl: "./edit-home-town.component.html",
  styleUrls: ["./edit-home-town.component.scss"],
  standalone: false,
})

export class EditHomeTownComponent {
  @Input() homeTown: string = '';
  constructor(private editingProfileService: EditingProfileService) {}
  onEditHome(): void {
    //this.location.back()
    this.editingProfileService.onEditFormModal(FieldName.City, 'France');
  }
}
