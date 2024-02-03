import { Component, OnDestroy, OnInit} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message } from 'src/app/interfaces/entities/message'
import { MessageService } from 'src/app/services/chatserver/message.service';
import { SessionService } from 'src/app/services/frontend/session.service';
import { ReplaySubject, Subscription, first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
//todo: proper cleaning before chatroom change
//todo: button not passed in every function
export class ChatPanelComponent implements OnInit, OnDestroy {

  public selectedChatroom = {} as ChatroomChatPanel;
  public selectedChatroom$ = new ReplaySubject<ChatroomChatPanel>();
  public hasNext: boolean = true;
  public messageContent: string = "";
  public chosenMessage: Message | undefined;
  public isUpdated: boolean = false;
  public currentUserId: string = '';
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(private messageService: MessageService, private sessionService: SessionService,
    private activeRoute: ActivatedRoute, private chatroomManager: ChatroomManagerService) { 
    sessionService.getId().subscribe(id =>
      this.currentUserId = id
    )
  }

  ngOnInit(): void {
    this.subscriptions.push(this.chatroomManager.getAll().subscribe(() => {
      this.subscriptions.push(this.activeRoute.params.subscribe(params => {
      this.chatroomManager.setActiveChatroom(params['id'])
      }))
    }))
    this.subscriptions.push(this.subscribeToActiveChatroomId())
  }

  public sendMessage(content: string, sendButton: MatButton) {
    if (this.isUpdated) {
      this.chosenMessage!.content = content
      this.messageService.updateMessage(this.chosenMessage!)
      this.cancelText(sendButton)
    } else {
      this.sessionService.getId().pipe(first()).subscribe(id => {
        let message: Message = {
          content: content,
          authorId: id,
          chatroomId: this.selectedChatroom.id,
          id: '',
          creationDate: new Date()
        }
        this.messageService.sendMessage(message)
        this.cancelText(sendButton)
      })
    }
  }

  public updateMessage(message: Message, sendButton: MatButton) {
    this.chosenMessage = message
    this.messageContent = message.content;
    this.isUpdated = true
    sendButton.disabled = false
  }

  public cancelText(sendButton: MatButton) {
    this.messageContent = ''
    this.chosenMessage = undefined
    this.isUpdated = false
    sendButton.disabled = true
  }

  public isMessageBoxEmpty(value: string, sendButton: MatButton) {
    if (value.trim() == '') {
      sendButton.disabled = true;
    } else {
      sendButton.disabled = false
    }
  }

  public getNextPageOfMessages() {
    return this.subscriptions.push(this.chatroomManager.getActiveChatroomId().pipe(first()).subscribe(id => {
      let startDate = this.selectedChatroom.messages![0].creationDate
      this.messageService.getMessagesBefore(id!, startDate).pipe(first()).subscribe(response => {
        let messages = response.body?.content as Array<Message>
        this.selectedChatroom.messages?.unshift(...messages)
        this.selectedChatroom.messages?.sort((a,b) => 
          new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
        )
        this.selectedChatroom$.next(this.selectedChatroom)
        this.hasNext = !response.body?.last;
      })
    }))
  }

  public getChosenMessageId() : string | undefined {
    return this.chosenMessage != undefined ? this.chosenMessage.id : undefined;
  }

  public getAuthorOfMessage(authorId: String): ChatroomUser | undefined {
    if (this.selectedChatroom.users != undefined)
      return this.selectedChatroom.users!.find(x => x.user.id == authorId)!;
    return undefined;
  }
  
  private subscribeToActiveChatroomId(): Subscription {
    return this.chatroomManager.getActiveChatroomId().subscribe(id => {
      this.hasNext = true;
      this.selectedChatroom = this.chatroomManager.get(id!)
      this.selectedChatroom.messages?.sort((a,b) => 
        new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()
      )
      this.selectedChatroom$.next(this.selectedChatroom)
      console.log('im in active chatroomid, selectedRoom = ', this.selectedChatroom)
    });
  }

  private existsCurrentUserId(): boolean {
    return this.sessionService.exists(this.sessionService.idKey)
  }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
