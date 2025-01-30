import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IonTextarea } from "@ionic/angular";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";
import { ActiveConversationService } from "../../services/active-conversation.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})

export class FormInputComponent implements OnInit, OnDestroy  {
  @ViewChild('inputArea', { static: false }) inputArea!: IonTextarea;
  @Output() submitObs = new EventEmitter<any>();

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
    if (!text || text.length === 0) {
      if (this.toUserId) {
       // ===this.socketIoService.onTyping(this.toUserId, false);
      }
    } else if (text.length > 0 && this.toUserId) {
      // If text not "", user is typing
      //===this.socketIoService.onTyping(this.toUserId, true);

    }
   }

  onSubmit (f: NgForm) {
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
