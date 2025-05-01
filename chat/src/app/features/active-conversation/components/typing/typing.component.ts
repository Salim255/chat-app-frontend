import { Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { Subscription, take } from 'rxjs';
import { SocketTypingService, TypingStatus } from 'src/app/core/services/socket-io/socket-typing.service';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss'],
  standalone: false,
})
export class TypingComponent {
  @Input() chatId!: number | null;
   isTyping: boolean = false;
  constructor(private socketTypingService: SocketTypingService ) {
    this.subscribeToTyping();
  }

  private subscribeToTyping():void {
    this.socketTypingService
   .getUserTypingStatus$.subscribe(
     (typingStatus) => {
      if(!typingStatus || (this.chatId !== typingStatus?.chatId)) return;
      this.isTyping = (typingStatus.typingStatus === TypingStatus.Typing);
    }
   );
 }
}
