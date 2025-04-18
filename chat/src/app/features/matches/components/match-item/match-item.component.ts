import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Partner } from 'src/app/shared/interfaces/partner.interface';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ActiveConversationService } from 'src/app/features/active-conversation/services/active-conversation.service';

@Component({
  selector: 'app-match-item',
  templateUrl: './match-item.component.html',
  styleUrls: ['./match-item.component.scss'],
  standalone: false,
})
export class MatchItemComponent implements OnInit, OnChanges {
  @Input() partnerInfo!: Partner;

  constructor(private activeConversationService: ActiveConversationService) {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Hello');
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.partnerInfo, 'hello');
    if (this.partnerInfo) {
      this.partnerInfo.avatar = StringUtils.getAvatarUrl(this.partnerInfo.avatar);
    }
  }

  onOpenConversation() {
    if (!this.partnerInfo || !this.partnerInfo.partner_id) return;
    this.activeConversationService.openConversation(this.partnerInfo, null);
  }
}
