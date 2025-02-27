import { Component } from "@angular/core";
import { ItsMatchModalService } from "../../services/its-match-modal.service";
@Component({
  selector: 'app-its-modal-match',
 templateUrl: './its-match-modal.component.html',
 styleUrls: ['./its-match-modal.component.scss'],
 standalone: false
})

export class ItsMatchModalComponent {
  imgUrl =  "https://images.unsplash.com/photo-1740564014446-f07ea2da269c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8";
  constructor(private itsMatchModalService : ItsMatchModalService ) {}


  onSendMessage() {
    this.itsMatchModalService.closeModal()
  }

  onKeepSwiping() {
    this.itsMatchModalService.closeModal()
  }
}
