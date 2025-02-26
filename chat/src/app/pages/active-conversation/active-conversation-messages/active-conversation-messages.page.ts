import {  Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketIoService } from 'src/app/core/services/socket.io/socket.io.service';

@Component({
    selector: 'app-messages',
    templateUrl: './active-conversation-messages.page.html',
    styleUrls: ['./active-conversation-messages.page.scss'],
    standalone: false
})

export class ActiveConversationMessagesPage implements OnInit{

  constructor() { }

  ngOnInit() {
    console.log('init');
    //this.subscribeToTyping();
  }

}
