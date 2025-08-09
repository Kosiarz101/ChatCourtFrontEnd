import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, first, map } from 'rxjs';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { Message } from 'src/app/interfaces/entities/message';

@Injectable({
  providedIn: 'root'
})
export class ChatroomManagerService {

  private chatrooms: Map<string, ChatroomChatPanel>;
  private chatrooms$: ReplaySubject<Map<string, ChatroomChatPanel>>;   
  private activeChatroomId: string | null = null;
  private activeChatroomId$ = new ReplaySubject<string | null>(1);

  constructor() { 
    this.chatrooms = new Map();
    this.chatrooms$ = new ReplaySubject(1);
  }

  public init(chatroomArray: Array<ChatroomChatPanel>) {
    this.chatrooms = new Map()
    this.addAll(chatroomArray)
  }

  public addAll(chatroomArray: Array<ChatroomChatPanel>) {
    chatroomArray.map(
      chatroom => this.chatrooms.set(chatroom.id, chatroom)
    )
    this.chatrooms$.next(this.chatrooms)
  }

  public addMessage(chatroomId: string, message: Message) {
    let chatroom = this.chatrooms.get(chatroomId)!
    if (chatroom.messages == null)
      chatroom.messages = new Array();
    return chatroom.messages.push(message)
  }

  public addChatroomUser(chatroomId: string, chatroomUser: ChatroomUser) {
    let chatroom = this.chatrooms.get(chatroomId)!
    if (chatroom.users == null)
      chatroom.users = new Array();
    return chatroom.users.unshift(chatroomUser)
  }

  public updateMessage(chatroomId: string, newMessage: Message) {
    let chatroom = this.chatrooms.get(chatroomId)!
    let index = chatroom.messages!.findIndex(m => m.id == newMessage.id)
    chatroom.messages![index] = newMessage
  }

  public deleteMessage(chatroomId: string, deletedMessage: Message) {
    let chatroom = this.chatrooms.get(chatroomId)!
    chatroom.messages = chatroom.messages!.filter(m => m.id !== deletedMessage.id)
  }

  public get(id: string): ChatroomChatPanel {
    console.log('chatrooms map get by id: ', this.chatrooms)
    return this.chatrooms.get(id)!;
  }

  public getAll(): Observable<Map<string, ChatroomChatPanel>> {
    return this.chatrooms$.pipe(first());
  }

  public getObservable(chatroomId: string): Observable<ChatroomChatPanel | undefined> {
    return this.chatrooms$.pipe(
      map(x => x.get(chatroomId)!)
    );
  }

  public setActiveChatroom(id: string | null) {
    this.activeChatroomId = id
    this.activeChatroomId$.next(id)
  }

  public getActiveChatroomId(): ReplaySubject<string | null> {
    return this.activeChatroomId$;
  }

  public getChatroomIdFromUrl(url: string): string {
    let urlParts = url.split('/')
    if (urlParts[1])
      return urlParts[2]
    return 'null'
  }
}
