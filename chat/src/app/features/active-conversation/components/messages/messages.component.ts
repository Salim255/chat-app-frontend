import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Message } from '../../../messages/model/message.model';
import { IonContent } from '@ionic/angular';
import { StringUtils } from 'src/app/shared/utils/string-utils';
import { ActiveConversationUIService } from '../../services/active-conversation-ui.service';
import { SocketTypingService, TypingStatus } from 'src/app/core/services/socket-io/socket-typing.service';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  standalone: false,
})
export class MessagesComponent implements OnChanges {
  @ViewChild(IonContent, { static: false }) messageContainer!: IonContent;
  @Input() messagesList: Message[] = [];
  @Input() userId: number | null = null;
  date: Date | null = null;
  isTypingPayload: TypingStatus | null = null;

  constructor(private activeConversationUIService : ActiveConversationUIService) { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ngOnChanges(_changes: SimpleChanges): void {
    this.activeConversationUIService
    .getTriggerMessagePageScroll.subscribe(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom():void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.scrollToBottom(300); // Smooth scroll
      }
    }, 100);
  }

  trackById(index: number, message: Message): number {
    return message.id; // Use a unique ID to track messages
  }

  getMessageStatus(message: string): string {
    return StringUtils.getMessageIcon(message);
  }

  getChatId(): number | null{
    return this.messagesList[0]?.chat_id ?? null;
  }
}
