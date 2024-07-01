import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { IonTextarea } from "@ionic/angular";


import { AuthService } from "src/app/services/auth/auth.service";
import { SocketIoService } from "src/app/services/socket.io/socket.io.service";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.scss']
})

export class FormInputComponent implements OnInit  {
  @ViewChild('inputArea', { static: false }) inputArea!: IonTextarea;
  @Output() submitMessageObs = new EventEmitter<any>();
  @Output() createNewChatObs = new EventEmitter<string>();
  @Output() typingListener = new EventEmitter<any>();
  @Input() chatId: any;
  @Input() toUserId: any;


  message= '';
  private userId: any;
  constructor(private authService: AuthService, private socketIoService: SocketIoService){
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  ngOnInit() {
    console.log("Hello from inPut");

  }

  // Here we listen to user typing event
 /*  onTextChange(text: any) {
        this.typingListener.emit(text)
  } */
   // Here we listen to user typing event
   onTextChange(text: any) {
    console.log('====================================');
    console.log(text, "hello text");
    console.log('====================================');
    if (!text || text.length === 0) {
      this.socketIoService.onTyping(this.toUserId, false);
    } else if (text.length > 0) {
      // If text not "", user is typing
      this.socketIoService.onTyping(this.toUserId, true);
    }
   }

  onSubmit (f: NgForm) {

    if (!f.valid || this.message.trim().length === 0) {
      return
    }

    if (!this.chatId) {
      this.createNewChatObs.emit(this.message)
      f.reset();
      return;
    }

    this.sendMessage();

    f.reset();
  }

  sendMessage(){
    if (!this.userId) {
      return
    };
    const data = {  content: this.message, fromUserId: this.userId, toUserId: this.toUserId,  chatId: this.chatId};
    this.submitMessageObs.emit(data);
  }
}
