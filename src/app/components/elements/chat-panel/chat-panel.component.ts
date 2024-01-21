import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message } from 'src/app/interfaces/entities/message'
import { MessageService } from 'src/app/services/chatserver/message.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { SessionService } from 'src/app/services/frontend/session.service';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { SessionService } from 'src/app/services/frontend/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit, OnDestroy {

  public selectedChatroom = {} as Chatroom;
  public selectedChatroom$ = new ReplaySubject<Chatroom>();
  public messageContent: string = "";
  public currentUserId: string = '';
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(private messageService: MessageService, private sessionService: SessionService, private stompMessageService: StompMessageService,
    private activeRoue: ActivatedRoute, private chatroomManager: ChatroomManagerService) { 
    if (this.existsCurrentUserId())
      this.currentUserId = sessionService.getId() as string;
    else 
      (sessionService.getId() as Observable<string>).subscribe(id =>
        this.currentUserId = id
      )
  }

  ngOnInit(): void {
    this.subscriptions.push(this.chatroomManager.getAll().subscribe(() => {
      this.subscriptions.push(this.activeRoue.params.subscribe(params => {
        this.chatroomManager.setActiveChatroom(params['id'])
      }))
    }))
    this.subscriptions.push(this.subscribeToActiveChatroomId())
  }

  public sendMessage(content: string) {
    if (this.existsCurrentUserId())
      this.executeSendMessage(content, this.sessionService.getId() as string)
    else {
      (this.sessionService.getId() as Observable<string>).subscribe(id => 
        this.executeSendMessage(content, id)
      )
    }   
  }

  public isMessageBoxEmpty(value: string, button: MatButton) {
    if (value) {
      button.disabled = false;
      console.log('should be true: ', button.disabled)
    } else {
      button.disabled = true
      console.log('should be false: ', button.disabled)
    }
  }

  private subscribeToActiveChatroomId(): Subscription {
    return this.chatroomManager.getActiveChatroomId().subscribe(id => {
      this.selectedChatroom = this.chatroomManager.get(id!)
      this.selectedChatroom$.next(this.selectedChatroom)
      console.log('im in active chatroomid, selectedRoom = ', this.selectedChatroom)
    });
  }

  private executeSendMessage(content: string, authorId: string) {
    let message: Message = {
      content: content,
      authorId: authorId,
      chatroomId: this.selectedChatroom.id,
      id: '',
      creationDate: new Date()
    }
    this.stompMessageService.publish({destination: `/app/message/add`, body: JSON.stringify(message)})
  }

  private existsCurrentUserId(): boolean {
    return this.sessionService.exists(this.sessionService.idKey)
  }

  private executeSendMessage(content: string, authorId: string) {
    let message: Message = {
      content: content,
      authorId: authorId,
      chatroomId: this.selectedChatroom.id,
      id: '',
      creationDate: new Date()
    }
    this.stompMessageService.publish({destination: `/app/message/add`, body: JSON.stringify(message)})
  }

  private existsCurrentUserId(): boolean {
    return this.sessionService.exists(this.sessionService.idKey)
  }

  // @Input() updateSelectedChatroom(value: any) {
  //   console.log('chat panel: ', value);
  //   this.selectedChatroom = value as Chatroom;
  //   this.chatroomTitle = this.selectedChatroom.name;
  // }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
