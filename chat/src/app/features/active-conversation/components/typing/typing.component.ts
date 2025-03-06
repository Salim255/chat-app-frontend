import { Component, Input, OnDestroy, OnInit} from "@angular/core";
import { Subscription } from "rxjs";
import { SocketIoService } from "src/app/core/services/socket-io/socket-io.service";
import { SocketMessageHandler } from "src/app/core/services/socket-io/socket-message-handler";

@Component({
    selector: 'app-typing',
    templateUrl: './typing.component.html',
    styleUrls: ['./typing.component.scss'],
    standalone: false
})

export class TypingComponent implements OnInit, OnDestroy {
  isTyping: boolean = false;
  private typingSubscription!: Subscription;

  constructor(
     private socketIoService: SocketIoService,
     private socketMessageHandler: SocketMessageHandler){}

  ngOnInit(): void {
    this.subscribeToTyping()
  }

  ionViewWillEnter() {
    if (!this.typingSubscription || this.typingSubscription.closed) {
      this.subscribeToTyping();
    }
  }

  private subscribeToTyping() {
    this.typingSubscription =
        this.socketMessageHandler.getUserTypingStatus
        .subscribe(typingStatus => {
          console.log('typingStatus', typingStatus);
        this.isTyping = typingStatus;
    });
  }

  ngOnDestroy(): void {
    this.typingSubscription?.unsubscribe();
  }
}
