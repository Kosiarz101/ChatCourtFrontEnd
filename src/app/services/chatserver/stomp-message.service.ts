import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StompMessageService extends RxStomp {

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
