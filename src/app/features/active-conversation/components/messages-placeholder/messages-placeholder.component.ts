import { Component, Input } from "@angular/core";
import { UserInChatDto } from "src/app/features/conversations/interfaces/conversations.dto";
import { StringUtils } from "src/app/shared/utils/string-utils";


@Component({
  selector: 'app-messages-placeholder',
  templateUrl: './messages-placeholder.component.html',
  styleUrls: ['./messages-placeholder.component.scss'],
  standalone: false,
})

export class MessagesPlaceholderComponent {
  @Input() partnerInfo!: UserInChatDto;

  constructor(){}

  getAvatarUrl(): string{
    return StringUtils.getAvatarUrl(this.partnerInfo.photos[0]);
  }

}
