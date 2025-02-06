import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IonTextarea } from "@ionic/angular";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { Subscription } from "rxjs";

export type UserTypingData = {
  userId: number;
  roomId: number;
}
@Component({
    selector: 'app-form-input',
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss'],
    standalone: false
})

export class FormInputComponent implements OnInit, OnDestroy  {
  @ViewChild('inputArea', { static: false }) inputArea!: IonTextarea;
  @Output() submitObs = new EventEmitter<any>();
  isTyping: boolean = false;
  private typingTimeout = 2000;
  private typingTimer: ReturnType<typeof setTimeout> | null = null; // Timer for "stop typing"
  private isTypingDebounced = false;
  private toUserId: number | null = null;

  message: string = '';
  private partnerInfoSubscription!: Subscription;

  constructor(private socketIoService: SocketIoService,
    private activeConversationService: ActiveConversationService
  ){

  }

  ngOnInit() {
    this.partnerInfoSubscription = this.activeConversationService.getPartnerInfo.subscribe( partnerInfo => {
      if (partnerInfo) {
        this.toUserId = partnerInfo?.partner_id;
      }
    })

  }

   onTextChange(text: any) {
      // Debouncing: Emit "typing" only once until the user stops typing
      if (!this.isTypingDebounced  && this.toUserId) {
          this.socketIoService.userTyping(this.toUserId);
          this.isTypingDebounced = true;
      }

      // Clear the timer on each input event and set a new one
      if (this.typingTimer) {
          clearTimeout(this.typingTimer);
      }

      // Start a timer to trigger "stop typing" after inactivity
      this.typingTimer = setTimeout(() => {
        this.stopTyping();
      }, this.typingTimeout);
   }

   stopTyping(): void {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
        this.typingTimer = null;
      }

      this.isTypingDebounced = false;
      if (this.toUserId) {
        this.socketIoService.userStopTyping(this.toUserId);
      }

   }
  onSubmit (f: NgForm) {
    this.stopTyping();
    if (!f.valid || this.message.trim().length === 0) {
      return
    }

    this.submitObs.emit(this.message);
    f.reset();
  }

  ngOnDestroy(): void {
    if (this.partnerInfoSubscription) {
      this.partnerInfoSubscription.unsubscribe();
    }
    this.toUserId = null;
  }
}
