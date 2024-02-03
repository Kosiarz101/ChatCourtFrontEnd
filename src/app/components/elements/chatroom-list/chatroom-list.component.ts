import { Component, OnDestroy, OnInit} from '@angular/core';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { NavigationStart, Router} from '@angular/router';
import { NotificationService } from 'src/app/services/frontend/notification.service';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';
import { RxStompConfigurationService } from 'src/app/services/frontend/rx-stomp-configuration.service';

@Component({
  selector: 'app-chatroom-list',
  templateUrl: './chatroom-list.component.html',
  styleUrls: ['./chatroom-list.component.css']
})
export class ChatroomListComponent implements OnInit, OnDestroy {

  public chatrooms: Map<string, ChatroomChatPanel> = new Map();
  public chatrooms$: ReplaySubject<Map<string, ChatroomChatPanel>>
  public chosenChatroom: ChatroomChatPanel | null = null;
  public chosenChatroom$: BehaviorSubject<ChatroomChatPanel | null>
  public selectedChatroomId$: BehaviorSubject<string>
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(public notificationService: NotificationService, public chatroomManager: ChatroomManagerService, 
    private router: Router, private rxStompConfigurer: RxStompConfigurationService) { 
    this.chatrooms$ = new ReplaySubject<Map<string, ChatroomChatPanel>>();
    this.chosenChatroom$ = new BehaviorSubject<ChatroomChatPanel | null>(null);
    this.selectedChatroomId$ = new BehaviorSubject<string>(this.chatroomManager.getChatroomIdFromUrl(this.router.url));
}

  ngOnInit(): void {
    this.subscriptions.push(this.getAllChatrooms()) 
    this.subscriptions.push(this.getActiveChatroom())
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        let id = this.chatroomManager.getChatroomIdFromUrl(event.url)
        this.selectedChatroomId$.next(id)    
      }
    })
  }

  // check if UI should notifiy user about unread message
  public isUserNotNotified(chatroom: ChatroomChatPanel): boolean {
    if (this.chosenChatroom != null && this.chosenChatroom!.id != chatroom.id) {
      return this.notificationService.exists(chatroom.id)
    }
    return false;
  }

  // needed to disable auto sorting in keyvalue pipe
  public returnZero(): number {
    return 0;
  }

  private getAllChatrooms(): Subscription {
    return this.chatroomManager.getAll().subscribe(x => {
      console.log('CHATS chatrooms', x)
      this.chatrooms = x
      if (!this.rxStompConfigurer.getIsConfigured())
        this.rxStompConfigurer.configureStompWatch(this.chatrooms.values())
    })
  }

  private getActiveChatroom(): Subscription  {
    return this.chatroomManager.getActiveChatroomId().subscribe(chatroomId => {
      console.log('active chatroom: ', chatroomId)
      if (chatroomId != null)
        this.chosenChatroom = this.chatrooms.get(chatroomId)!
      this.chosenChatroom$.next(this.chosenChatroom)
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
