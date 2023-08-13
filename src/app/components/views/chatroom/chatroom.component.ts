import { Component, OnInit } from '@angular/core';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  public selectedUpperButtonToggle: string;
  public selectedChatroom: Chatroom = {} as Chatroom

  constructor() { 
    this.selectedUpperButtonToggle = "chatroomList"
  }

  ngOnInit(): void {
  }

  public upperButtonToggleHandler(value: string) {
    this.selectedUpperButtonToggle = value;
  }

  public updateChatroom(chatroom: any) {
    this.selectedChatroom = chatroom;
  }

  public getSelectedChatroom() {
    return this.selectedChatroom;
  }
}
