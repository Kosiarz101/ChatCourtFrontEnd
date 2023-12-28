import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { Message as StompMessage } from '@stomp/stompjs';
import { Message } from 'src/app/interfaces/entities/message';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit {

  public chosenChatroom: Chatroom = {} as Chatroom;
  public chatrooms: Array<Chatroom> = [];
  public chatrooms$ = new BehaviorSubject<Array<Chatroom>>(this.chatrooms);;
  @Output() public selectedChatroomEmitter = new EventEmitter<Chatroom>();
  selectedChatroom: any;

  constructor(private chatroomService: ChatroomService, private stompMessageService: StompMessageService, public chatroomManager: ChatroomManagerService) { 
  }

  ngOnInit(): void {
    console.log('init of chatroom list')
    this.chatroomService.getAll().subscribe(x => 
      {
        this.chatrooms = x.content as Array<Chatroom>
        this.chatrooms$.next(this.chatrooms)
        this.chatroomManager.addAll(this.chatrooms)
        this.configureStompWatch(this.chatrooms)
      }
    )
    this.chatroomManager.getActiveChatroomId().subscribe(chatroomId => {
      console.log('active chatroom: ', chatroomId)
      this.chosenChatroom = this.chatroomManager.get(chatroomId)
    })
  }

  public configureStompWatch(chatrooms: Array<Chatroom>) {
    chatrooms.map(chatroom => {
      this.stompMessageService.watch(`/topic/public/${chatroom.id}`).subscribe((response: StompMessage) => {
        let responseEntity: ResponseEntity = JSON.parse(response.body)
        console.log('new Message: ', responseEntity.body)
        this.chatroomManager.addMessage(chatroom.id, responseEntity.body as Message)
      })
    }) 
  }
}
