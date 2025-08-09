import { Injectable } from '@angular/core';
import { ChatroomManagerService } from './chatroom-manager.service';
import { RxStompService } from '../chatserver/rx-stomp.service';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';
import { environment } from 'src/environments/environment';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { Message } from 'src/app/interfaces/entities/message';
import { Message as StompMessage } from '@stomp/stompjs';
import { NotificationService } from './notification.service';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RxStompConfigurationService {

  private selectedChatroomId: string
  private configuredIds: Set<string> = new Set<string>()
  private isConfigured: boolean = false

  constructor(private rxStompService: RxStompService, private chatroomManager: ChatroomManagerService, private notificationService: NotificationService,
    private router: Router) { 
      this.selectedChatroomId = this.chatroomManager.getChatroomIdFromUrl(this.router.url);
      this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        let id = this.chatroomManager.getChatroomIdFromUrl(event.url)
        this.selectedChatroomId = id
        if (this.notificationService.exists(id))
          this.notificationService.remove(id)    
      }
    })
  }

  public getIsConfigured(): boolean {
    return this.isConfigured;
  }

  public configureStompWatch(chatrooms: IterableIterator<ChatroomChatPanel>) {
    for (let chatroom of chatrooms) {
      this.addToStompWatch(chatroom)
    }
    this.isConfigured = true;
  }

  public addToStompWatch(chatroom: ChatroomChatPanel) {
    let stompEndpoint = environment.stompEndpoint
    if (this.configuredIds.has(chatroom.id))
      return;

    // add message
    this.rxStompService.watch(`${stompEndpoint}/message/add/${chatroom.id}`).subscribe((response: StompMessage) => {
      let responseEntity: ResponseEntity = JSON.parse(response.body)
      console.log('new message: ', responseEntity.body)
      this.tryAddToNotifications(chatroom)
      this.chatroomManager.addMessage(chatroom.id, responseEntity.body as Message)
    })

    // update message
    this.rxStompService.watch(`${stompEndpoint}/message/update/${chatroom.id}`).subscribe((response: StompMessage) => {
      let responseEntity: ResponseEntity = JSON.parse(response.body)
      console.log('updated message: ', responseEntity.body)
      this.chatroomManager.updateMessage(chatroom.id, responseEntity.body as Message)
    })

    // delete message
    this.rxStompService.watch(`${stompEndpoint}/message/delete/${chatroom.id}`).subscribe((response: StompMessage) => {
      let responseEntity: ResponseEntity = JSON.parse(response.body)
      console.log('deleted message id: ', responseEntity.body)
      this.chatroomManager.deleteMessage(chatroom.id, responseEntity.body as Message)
    })

    // add chatroom-user
    this.rxStompService.watch(`${stompEndpoint}/chatroom-user/add/${chatroom.id}`).subscribe((response: StompMessage) => {
      let responseEntity: ResponseEntity = JSON.parse(response.body)
      console.log('add user: ', responseEntity.body)
      this.chatroomManager.addChatroomUser(chatroom.id, responseEntity.body as ChatroomUser)
    })
    this.isConfigured = true;
    this.configuredIds.add(chatroom.id)
  }

  private tryAddToNotifications(chatroom: ChatroomChatPanel) {
    if (!this.notificationService.exists(chatroom.id) || (this.notificationService.exists(chatroom.id) && this.notificationService.isUnderLimit(chatroom.id))) {
      if (this.selectedChatroomId == 'null' || (this.selectedChatroomId != 'null' && this.selectedChatroomId != chatroom.id)) {
        this.notificationService.add(chatroom.id)
      }
    }
  }
}
