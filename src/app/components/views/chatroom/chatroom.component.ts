import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { SessionService } from 'src/app/services/frontend/session.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, OnDestroy {

  public chatrooms: Map<string, ChatroomChatPanel> = new Map();
  public selectedUpperButtonToggle: string;
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(private sessionService: SessionService, private chatroomManager: ChatroomManagerService, 
    private chatroomService: ChatroomService) { 
    this.selectedUpperButtonToggle = "chatroomList"
  }

  ngOnInit(): void {
    this.getAllChatrooms()
  }

  public upperButtonToggleHandler(value: string) {
    this.selectedUpperButtonToggle = value;
  }

  private getAllChatrooms() {
    this.subscriptions.push(this.sessionService.getId().subscribe(userId =>
      this.subscriptions.push(this.getAllCurrentUserChatrooms(userId)) 
    )) 
  }

  private getAllCurrentUserChatrooms(userId: string): Subscription {
    return this.chatroomService.findByUserId(userId, true, true).subscribe(x => 
      {
        this.chatroomManager.init(x.content as Array<ChatroomChatPanel>)
      }
    )
  }
  
  ngOnDestroy(): void {
    console.log(this.subscriptions)
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
