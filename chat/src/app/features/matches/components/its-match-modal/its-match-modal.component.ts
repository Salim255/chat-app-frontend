import { Component, Input, OnInit } from "@angular/core";
import { ItsMatchModalService } from "../../services/its-match-modal.service";
import { Partner } from "src/app/interfaces/partner.interface";


@Component({
  selector: 'app-its-modal-match',
 templateUrl: './its-match-modal.component.html',
 styleUrls: ['./its-match-modal.component.scss'],
 standalone: false
})

export class ItsMatchModalComponent implements OnInit {
  @Input()  matchedProfile!: Partner;

  hostUserPhoto: string | null = null ;

  imgUrl: string | null = null

  constructor (
    private itsMatchModalService : ItsMatchModalService ) {}


  ngOnInit(): void {
    if (this.matchedProfile.avatar) {
      this.imgUrl =  this.matchedProfile.avatar;
    }

  }

  onSendMessage() {
    this.itsMatchModalService.closeModal()
  }

  onKeepSwiping() {
    this.itsMatchModalService.closeModal()
  }

}
