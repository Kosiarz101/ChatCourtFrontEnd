import { Injectable } from '@angular/core';
import {  ReplaySubject } from 'rxjs';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message } from 'src/app/interfaces/entities/message';

@Injectable({
  providedIn: 'root'
})
export class ChatroomManagerService {

  private chatrooms: Map<string, Chatroom>;
  private chatrooms$: ReplaySubject<Map<string, Chatroom>>;   
  private activeChatroomId: string | null = null;
  private activeChatroomId$ = new ReplaySubject<string | null>(1);

  constructor() { 
    this.chatrooms = new Map();
    this.chatrooms$ = new ReplaySubject(1);
}

  public addAll(chatroomArray: Array<Chatroom>) {
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

  public get(id: string): Chatroom {
    console.log('chatrooms map right now: ', this.chatrooms)
    return this.chatrooms.get(id)!;
  }

  public getAll(): ReplaySubject<Map<string, Chatroom>> {
    return this.chatrooms$;
  }

  public setActiveChatroom(id: string | null) {
    this.activeChatroomId = id
    this.activeChatroomId$.next(id)
  }

  public getActiveChatroomId(): ReplaySubject<string | null> {
    return this.activeChatroomId$;
  }
}
