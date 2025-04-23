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
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.subscribeToTyping();
  }

  private subscribeToTyping():void {
    this.typingSubscription = this.socketTypingService.getUserTypingStatus.subscribe(
      (typingStatus) => {
        console.log('typingStatus', typingStatus);
        this.isTyping = typingStatus;
      }
    );
  }

  ngOnDestroy():void {
    this.typingSubscription?.unsubscribe();
  }
}
