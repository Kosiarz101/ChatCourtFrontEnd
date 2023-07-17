import { Component, OnInit } from '@angular/core';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit {

  public tasks: String[]
  public activeChatRoom: String

  constructor(private chatroomService: ChatroomService) { 
    this.tasks = [
      "chatroom1",
      "chatroom2",
      "chatroom3"
    ]
    this.activeChatRoom = ""
    this.chatroomService.getAll().subscribe(x => console.log("TO TO: ", x))
  }

  ngOnInit(): void {
  }

  public changeChatroom(task: String) {
    this.activeChatRoom = task
  }

}
