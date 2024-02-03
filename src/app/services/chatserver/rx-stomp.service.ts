import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { ChatroomChatPanel } from 'src/app/interfaces/entities/chatroom-chat-panel';
import { Message } from 'src/app/interfaces/entities/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RxStompService extends RxStomp {

  constructor() {
    super();
    this.configure({
      brokerURL: environment.webSocketUrl,
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      debug: (msg: string): void => {
        console.log(new Date(), msg);
      }
    });
    this.activate();
  }
}
