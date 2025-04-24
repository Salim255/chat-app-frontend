import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonTextarea } from '@ionic/angular';
import { SocketIoService } from 'src/app/core/services/socket-io/socket-io.service';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';
import { ActiveConversationService } from '../../services/active-conversation.service';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss'],
  standalone: false,
})
export class FormInputComponent {
  @ViewChild('inputArea', { static: false }) inputArea!: IonTextarea;
  @Output() submitObs = new EventEmitter<any>();
  @Input() toUserId: number | null = null;

  private isTypingDebounced = signal<boolean>(false);

  private typingTimeout = 2000;
  private typingTimer: ReturnType<typeof setTimeout> | null = null; // Timer for "stop typing"

  message: string = '';

  constructor(
    private activeConversationService : ActiveConversationService ,
    private socketTypingService : SocketTypingService,
   ) {}

  onTextChange(text: any):void {
    // Debouncing: Emit "typing" only once until the user stops typing
    if (!this.isTypingDebounced() && this.toUserId) {
      this.socketTypingService.userTyping(this.toUserId);
      this.isTypingDebounced.set(true);
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

    this.isTypingDebounced.set(false);
    if (this.toUserId) {
      this.socketTypingService.userStopTyping(this.toUserId);
    }
  }

  onSubmit(f: NgForm): void {
    this.stopTyping();
    if (!f.valid || this.message.trim().length === 0) {
      return;
    }

    //this.submitObs.emit(this.message);
    f.reset();
  }
}
