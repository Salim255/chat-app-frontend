import { Component, Input, OnInit } from '@angular/core';
import { ItsMatchModalService } from '../../services/its-match-modal.service';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

@Component({
  selector: 'app-its-modal-match',
  templateUrl: './its-match-modal.component.html',
  styleUrls: ['./its-match-modal.component.scss'],
  standalone: false,
})
export class ItsMatchModalComponent implements OnInit {
  @Input() matchedProfile!: Partner;
  hostUserPhoto: string | null = null;
  imgUrl: string | null = null;

  constructor(
    private itsMatchModalService: ItsMatchModalService,
    private activeConversationService: ActiveConversationService
  ) {}

  ngOnInit(): void {
    if (this.matchedProfile.photos) {
      this.imgUrl = this.matchedProfile.photos[0];
    }
  }

  onSendMessage(): void {
    this.activeConversationService
    .openConversation(this.matchedProfile, null);
    this.itsMatchModalService.closeModal();
  }

  onKeepSwiping(): void {
    this.itsMatchModalService.closeModal();
  }
}
