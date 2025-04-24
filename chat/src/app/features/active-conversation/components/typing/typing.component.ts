import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketTypingService } from 'src/app/core/services/socket-io/socket-typing.service';

@Component({
  selector: 'app-typing',
  templateUrl: './typing.component.html',
  styleUrls: ['./typing.component.scss'],
  standalone: false,
})
export class TypingComponent implements OnInit, OnDestroy {
  isTyping: boolean = false;
  private typingSubscription!: Subscription;

  constructor( private socketTypingService: SocketTypingService) {}

  ngOnInit(): void {
    this.subscribeToTyping();
  }

  private subscribeToTyping():void {
    this.typingSubscription = this.socketTypingService.getUserTypingStatus.subscribe(
      (typingStatus) => {
        this.isTyping = typingStatus;
      }
    );
  }

  ngOnDestroy():void {
    this.typingSubscription?.unsubscribe();
  }
}
