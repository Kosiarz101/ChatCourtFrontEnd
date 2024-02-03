import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatroomUserRole } from 'src/app/enums/chatroom-user-role';
import { Slice } from 'src/app/interfaces/chatserver/slice';
import { Category } from 'src/app/interfaces/entities/category';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { ChatroomSearch } from 'src/app/interfaces/entities/chatroom-search';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { AppUserService } from 'src/app/services/chatserver/app-user.service';
import { CategoryService } from 'src/app/services/chatserver/category.service';
import { ChatroomUserService } from 'src/app/services/chatserver/chatroom-user.service';
import { ChatroomService } from 'src/app/services/chatserver/chatroom.service';
import { ChatroomManagerService } from 'src/app/services/frontend/chatroom-manager.service';
import { RxStompConfigurationService } from 'src/app/services/frontend/rx-stomp-configuration.service';
import { SessionService } from 'src/app/services/frontend/session.service';

@Component({
  selector: 'app-chatroom-search',
  templateUrl: './chatroom-search.component.html',
  styleUrls: ['./chatroom-search.component.css']
})
export class ChatroomSearchComponent implements OnInit, OnDestroy {

  public chatroomTitle: string = ''
  public chosenCategoryId: string = '' //7cd2146c-da14-4053-9144-ffe10388f5d3
  public currentUserID: string = ''
  public chatrooms: Array<ChatroomSearch>;
  public categories: Array<Category> = [];
  public hasNext: boolean = false;
  public showNotFoundMessage = false;
  private pageNumber: number = 0;
  private subscriptions: Array<Subscription> = [];

  constructor(private categoryService: CategoryService, private chatroomService: ChatroomService, private chatroomUserService: ChatroomUserService,
    private sessionService: SessionService, private chatroomManager: ChatroomManagerService, private rxStompConfigurer: RxStompConfigurationService) { 
    this.chatrooms = new Array()
  }

  ngOnInit(): void {
    this.subscriptions.push(this.subscribeToCategories())
  }

  public sendSearchRequest() {
    if (!this.chatroomTitle)
      return;
    this.pageNumber = 0;
    this.hasNext = false;
    let chatroomTitle = this.prepareChatroomTitle();
    if (this.chosenCategoryId) {
      this.chatroomService.findByNameAndCategoryId(chatroomTitle, this.chosenCategoryId, this.pageNumber).subscribe(response =>
        this.handleSearchResponse(response)
      );
    } else {
      this.chatroomService.findByName(chatroomTitle, this.pageNumber).subscribe(response =>
        this.handleSearchResponse(response)
      );
    }
  }

  public getNextPageOfChatrooms() {
    let chatroomTitle = this.prepareChatroomTitle();
    if (this.hasNext) {
      if (this.chosenCategoryId) {
        this.chatroomService.findByNameAndCategoryId(chatroomTitle, this.chosenCategoryId, this.pageNumber).subscribe(response =>
          this.handleNextPageOfChatrooms(response)
        )
      } else {
        this.chatroomService.findByName(chatroomTitle, this.pageNumber).subscribe(response =>
          this.handleNextPageOfChatrooms(response)
        )
      }
    }
  }

  public joinChatroom(chatroom: Chatroom) {
    this.subscriptions.push(this.sessionService.getId().subscribe(id => {
      this.addUserToChatroom(chatroom.id, chatroom.category.id, id)
    }))
  }

  public onChangeSearchInput() {
    this.showNotFoundMessage = false;
  }

  private addUserToChatroom(chatroomId: string, chatroomCategoryId: string, userId: string) {
    let chatroomUser: ChatroomUser = {
      id: '',
      role: ChatroomUserRole.USER,
      chatroom: ChatroomService.init(chatroomId, chatroomCategoryId),
      user: AppUserService.init(userId),
      creationDate: new Date()
    }
    this.subscriptions.push(this.chatroomUserService.add(chatroomUser).subscribe(response =>  {
      if (response.status == 201) {
        this.addChatroomToLocalStorage((response.body as ChatroomUser).chatroom.id)
        console.log("You have been added to chatroom!")
      } else {
        console.log("Sorry, something went wrong")
      }
    })) 
  }

  private addChatroomToLocalStorage(id: string) {
    this.subscriptions.push(this.chatroomService.getById(id, true, true).subscribe(response => {
      this.chatroomManager.addAll([response])
      this.rxStompConfigurer.addToStompWatch(response)
    }))
  }

  private handleSearchResponse(response: Slice) {
    this.showNotFoundMessage = true;
    this.chatrooms = response.content as Array<ChatroomSearch>
    this.pageNumber++;
    this.hasNext = !response.last
  }

  private handleNextPageOfChatrooms(response: Slice) {
    this.chatrooms.push(...response.content as Array<ChatroomSearch>)
    this.chatrooms = [...this.chatrooms]
    this.pageNumber++;
    this.hasNext = !response.last
  }

  private prepareChatroomTitle(): string {
    return this.chatroomTitle.trim().toLocaleLowerCase()
  }

  private subscribeToCategories(): Subscription {
    return this.categoryService.getAll().subscribe(categories => {
      this.categories = categories;
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.map(sub => sub.unsubscribe())
  }
}
