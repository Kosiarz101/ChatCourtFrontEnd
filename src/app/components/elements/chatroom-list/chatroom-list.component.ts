import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit {

  public chatrooms: Array<Chatroom>
  public chosenChatroom: Chatroom = {} as Chatroom;
  @Output() public selectedChatroomEmitter = new EventEmitter<Chatroom>();

  constructor(private chatroomService: ChatroomService) { 
    this.chatrooms = []
    this.chatroomService.getAll().subscribe(x => 
      {
        this.chatrooms = x.content as Array<Chatroom>;
      }
    )
  }

  ngOnInit(): void {
  }

  public changeChatroom(chatroomId: string) {
    this.chosenChatroom = this.chatrooms.find(x => x.id == chatroomId) as Chatroom;
    this.selectedChatroomEmitter.emit(this.chosenChatroom);
    console.log('chatlist: ',this.chosenChatroom);
  }

}
