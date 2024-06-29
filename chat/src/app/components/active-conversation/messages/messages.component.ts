import { Component, Input, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { AuthService } from "src/app/services/auth/auth.service";
@Component({
  selector: 'app-chat-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnChanges{
  @Input() messagesList: any;
  userId: any;

  constructor(private authService: AuthService) {
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.messagesList, "hello");
  }

  ngOnChanges(changes: SimpleChanges) {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.messagesList, "hello");
  }
  getMessageStatus(messageStatus: string) {
    switch(messageStatus) {
      case 'read':
        return 'checkmark-done-outline';
      case 'delivered':
        return 'checkmark-done-outline';
      default:
        return 'checkmark-outline'
    }
  }


}
