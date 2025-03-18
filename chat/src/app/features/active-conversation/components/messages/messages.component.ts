import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { Message } from "../../interfaces/message.interface";
import { Subscription } from "rxjs";
import { IonContent } from "@ionic/angular";
import { StringUtils } from "src/app/shared/utils/string-utils";

@Component({
    selector: 'app-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: false
})

export class MessagesComponent implements OnChanges{
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;
  @Input() messagesList: Message [] = [];
  @Input() userId: number | null = null;

  date: Date | null = null;


  constructor() {}

  ngOnChanges(_changes: SimpleChanges): void {
   this.scrollToBottom();
  }



  trackById(index: number, message: Message) {
    return message.id; // Use a unique ID to track messages
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.ionContent) {
        this.ionContent.scrollToBottom(300); // Smooth scroll in 300ms
      }
    }, 100);
  }

  getMessageStatus(message: string) {
    return StringUtils.getMessageIcon(message)
  }
}
