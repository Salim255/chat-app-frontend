import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { Message } from "../../interfaces/message.interface";
import { IonContent } from "@ionic/angular";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { ActiveConversationService } from "../../services/active-conversation.service";

@Component({
    selector: 'app-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: false
})

export class MessagesComponent implements OnChanges{
  @ViewChild(IonContent, { static: false }) messageContainer!: IonContent;
  @Input() messagesList: Message [] = [];
  @Input() userId: number | null = null;

  date: Date | null = null;


  constructor(private activeConversationService:  ActiveConversationService) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.activeConversationService.getTriggerMessagePageScroll.subscribe(event => {
      this.scrollToBottom();
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.scrollToBottom(300); // Smooth scroll
      }
    }, 100);
  }

  trackById(index: number, message: Message) {
    return message.id; // Use a unique ID to track messages
  }

  getMessageStatus(message: string) {
    return StringUtils.getMessageIcon(message)
  }
}
