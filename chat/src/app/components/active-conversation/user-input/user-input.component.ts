import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { NgForm } from '@angular/forms';
import { IonTextarea } from "@ionic/angular";

import { AuthService } from "src/app/services/auth/auth.service";

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.scss']
})

export class  UserInputComponent implements OnInit {
  @ViewChild('inputArea', { static: false }) inputArea!: IonTextarea;
  @Output() submitMessageObs = new EventEmitter<any>();
  @Output() createConversation = new EventEmitter<string>();
  @Output() typingListener = new EventEmitter<any>();
  @Input() chatId: any;
  @Input() toUserId: any;


  message= '';
  private userId: any;
  constructor(private authService: AuthService){
    this.authService.userId.subscribe( data =>{
      this.userId = data;
    });
  }

  ngOnInit() {
    console.log("Hello from inPut");

  }

     // Here we listen to user typing event
     onTextChange(text: any) {
        this.typingListener.emit(text)
     }

  onSubmit (f: NgForm) {

    if (!f.valid || this.message.trim().length === 0) {
      return
    }

    console.log('====================================');
    console.log(this.message, !f.valid );
    console.log('====================================');

    if (!this.chatId) {
      this.createConversation.emit(this.message)
      f.reset();
      return;
    }

    this.sendMessage(this.message);

    f.reset();
  }

  sendMessage(message: string){
    if (!this.userId) {
      return
    };
    const data = {  content: this.message, fromUserId: this.userId, toUserId: this.toUserId,  chatId: this.chatId};
    console.log(data, "Hello data to send 🌋🌋🌋");

    this.submitMessageObs.emit(data);

  }

}
