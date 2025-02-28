import { Component, Input, OnInit } from "@angular/core";
import { ItsMatchModalService } from "../../services/its-match-modal.service";
import { Partner } from "src/app/shared/interfaces/partner.interface";
import { MatchesService } from "../../services/matches.service";

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
    private itsMatchModalService : ItsMatchModalService,
    private matchesService: MatchesService ) {}

  ngOnInit(): void {
    if (this.matchedProfile.avatar) {
      this.imgUrl =  this.matchedProfile.avatar;
    }
  }

  onSendMessage() {
    this.matchesService.onOpenChat(this.matchedProfile);
    this.itsMatchModalService.closeModal()
  }

  onKeepSwiping() {
    this.itsMatchModalService.closeModal()
  }

}
