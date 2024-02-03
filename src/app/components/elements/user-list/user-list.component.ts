import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {

  public chatroomUsers: Array<ChatroomUser> = []
  private subscriptions: Array<Subscription> = new Array<Subscription>()

  constructor(public chatroomManager: ChatroomManagerService, private router: Router) { 
    this.chatroomManager.getObservable(this.chatroomManager.getChatroomIdFromUrl(this.router.url))
    .subscribe(chatroom => {
      if (chatroom != undefined && chatroom.users != undefined)
        this.chatroomUsers = chatroom!.users!
    })
  }

  ngOnInit(): void {
    this.subscriptions.push(this.getAllChatrooms())
  }

  public retrieveUsers() {
  }

  private getAllChatrooms(): Subscription {
    return this.router.events.subscribe((event) => {
      console.log('chatroomId in userlist')
      if (event instanceof NavigationStart) {
        let chatroomId = this.chatroomManager.getChatroomIdFromUrl(event.url)
        this.subscriptions.push(this.chatroomManager.getObservable(chatroomId).subscribe(chatroom =>
          this.chatroomUsers = chatroom!.users!
        ))
      }
    })
  }

  ngOnDestroy(): void {
    console.log(this.subscriptions)
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
