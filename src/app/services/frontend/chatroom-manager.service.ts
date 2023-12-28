import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message } from 'src/app/interfaces/entities/message';

@Injectable({
  providedIn: 'root'
})
export class ChatroomManagerService {

  private chatrooms: Map<string, Chatroom> 
  private activeChatroomId = new Subject<string>();
  private activeChatroomId$ = this.activeChatroomId.asObservable();

  constructor() { 
    this.chatrooms = new Map();
  }

  public addAll(chatroomArray: Array<Chatroom>) {
    chatroomArray.map(
      chatroom => this.chatrooms.set(chatroom.id, chatroom)
    )
  }

  public addMessage(chatroomId: string, message: Message) {
    this.chatrooms.get(chatroomId)!.messages.push(message)
  }

  public get(id: string): Chatroom {
    return this.chatrooms.get(id)!;
  }

  public getAll(): Iterable<Chatroom> {
    return this.chatrooms.values()
  }

  public setActiveChatroom(id: string): Chatroom {
    this.activeChatroomId.next(id)
    return this.get(id);
  }

  public getActiveChatroomId(): Observable<string> {
    return this.activeChatroomId$;
  }
}
