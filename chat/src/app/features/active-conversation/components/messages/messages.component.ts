import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { Message } from "../../interfaces/message.interface";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { Subscription } from "rxjs";
import { IonContent } from "@ionic/angular";
import { StringUtils } from "src/app/shared/utils/string-utils";

@Component({
    selector: 'app-chat-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss'],
    standalone: false
})

export class MessagesComponent implements OnInit, OnDestroy{
  @ViewChild(IonContent, { static: false }) ionContent!: IonContent;
  messagesList: Message [] = [];
  userId: number | null = null;
  date: Date | null = null;

  private userIdSubscription!: Subscription;
  private messagesSourceSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private activeConversationService: ActiveConversationService,
    ) {}

  ngOnInit() {
    this.subscribeToMessages();
    this.subscribeUserId();
  }

  private subscribeUserId() {
      this.userIdSubscription = this.authService.userId.subscribe( data =>{
        this.userId = data;
      });
  }

  private subscribeToMessages () {
      this.messagesSourceSubscription = this.activeConversationService.getActiveConversationMessages.subscribe(messages => {
        if (messages ) {
          this.messagesList = messages;
          this.scrollToBottom();
        }
      });
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


  ngOnDestroy(): void {
    if (this.messagesSourceSubscription) this.messagesSourceSubscription.unsubscribe();
    if (this.userIdSubscription) this.userIdSubscription.unsubscribe();
  }
}
