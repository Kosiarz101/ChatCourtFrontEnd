import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  public tasks: String[]
  public activeChatRoom: String

  constructor() { 
    this.tasks = [
      "chatroom1",
      "chatroom2",
      "chatroom3"
    ]
    this.activeChatRoom = ""
  }

  ngOnInit(): void {

  }

  public changeChatroom(task: String) {
    this.activeChatRoom = task
  }
}
