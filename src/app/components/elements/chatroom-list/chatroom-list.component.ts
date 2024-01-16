import { Component, OnDestroy, OnInit} from '@angular/core';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { Message as StompMessage } from '@stomp/stompjs';
import { Message } from 'src/app/interfaces/entities/message';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { SessionService } from 'src/app/services/frontend/session.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit, OnDestroy {

  public chatrooms: Map<string, Chatroom> = new Map();
  public chatrooms$: ReplaySubject<Map<string, Chatroom>>
  public chosenChatroom: Chatroom | null = null;
  public chosenChatroom$: BehaviorSubject<Chatroom | null>
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(private chatroomService: ChatroomService, private stompMessageService: StompMessageService, 
    private sessionService: SessionService, public chatroomManager: ChatroomManagerService) { 
    this.chatrooms$ = new ReplaySubject<Map<string, Chatroom>>();
    this.chosenChatroom$ = new BehaviorSubject<Chatroom | null>(null);
}

  ngOnInit(): void {
    this.subscriptions.push(this.subscribeToChatroomsFromChatroomManager()) 
    this.subscriptions.push(this.subscribeToActiveChatroom())
    this.getAllChatroomsFromDB()
  }

  // needed to disable auto sorting in keyvalue pipe
  public returnZero(): number {
    return 0;
  }

  private subscribeToChatroomsFromChatroomManager(): Subscription {
    return this.chatroomManager.getAll().subscribe(x => {
      this.chatrooms = x
      this.chatrooms$.next(x)
      this.configureStompWatch(this.chatrooms.values())
    })
  }

  private getAllChatroomsFromDB()  {
    if (!this.sessionService.exists(this.sessionService.idKey)) {
      this.subscriptions.push((this.sessionService.getId() as Observable<string>).subscribe(userId =>
        this.subscriptions.push(this.subscribeToFindByUserId(userId)) 
      )) 
    } else {
      this.subscriptions.push(this.subscribeToFindByUserId(this.sessionService.getId() as string)) 
    }
  }

  private subscribeToFindByUserId(userId: string): Subscription {
    return this.chatroomService.findByUserId(userId, true).subscribe(x => 
      {
        this.chatroomManager.addAll(x.content as Array<Chatroom>)
      }
    )
  }

  private subscribeToActiveChatroom(): Subscription  {
    return this.chatroomManager.getActiveChatroomId().subscribe(chatroomId => {
      console.log('active chatroom: ', chatroomId)
      if (chatroomId != null)
        this.chosenChatroom = this.chatrooms.get(chatroomId)!
      this.chosenChatroom$.next(this.chosenChatroom)
    })
  }

  private configureStompWatch(chatrooms: IterableIterator<Chatroom>) {
    for (let chatroom of chatrooms) {
      this.subscriptions.push(this.stompMessageService.watch(`/topic/public/${chatroom.id}`).subscribe((response: StompMessage) => {
        let responseEntity: ResponseEntity = JSON.parse(response.body)
        console.log('new Message: ', responseEntity.body)
        this.chatroomManager.addMessage(chatroom.id, responseEntity.body as Message)
      }))
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
