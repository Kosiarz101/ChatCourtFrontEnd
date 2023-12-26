import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { Message as StompMessage } from '@stomp/stompjs';
import { Message } from 'src/app/interfaces/entities/message';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit {

  public chatrooms: Array<Chatroom>
  public chosenChatroom: Chatroom = {} as Chatroom;
  @Output() public selectedChatroomEmitter = new EventEmitter<Chatroom>();
  selectedChatroom: any;

  constructor(private chatroomService: ChatroomService, private stompMessageService: StompMessageService) { 
    this.chatrooms = []
  }

  ngOnInit(): void {
    this.chatroomService.getAll().subscribe(x => 
      {
        this.chatrooms = x.content as Array<Chatroom>;
        this.configureStompWatch(this.chatrooms)
      }
    )
    
  }

  public configureStompWatch(chatrooms: Array<Chatroom>) {
    chatrooms.map(chatroom => {
      this.stompMessageService.watch(`/topic/public/${chatroom.id}`).subscribe((response: StompMessage) => {
        let responseEntity: ResponseEntity = JSON.parse(response.body)
        console.log('new Message: ', responseEntity.body)
        chatroom.messages.push(responseEntity.body as Message)
      })
    }) 
  }

  public changeChatroom(chatroomId: string) {
    this.chosenChatroom = this.chatrooms.find(x => x.id == chatroomId) as Chatroom;
    this.selectedChatroomEmitter.emit(this.chosenChatroom);
    console.log('chatlist: ',this.chosenChatroom);
  }

}
