import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Slice } from 'src/app/interfaces/chatserver/slice';
import { Message } from 'src/app/interfaces/entities/message';
import { environment } from 'src/environments/environment';
import { RxStompService } from './rx-stomp.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private endpoint: string = "/message"
  private stompEndpoint: string

  constructor(private httpClient: HttpClient, private rxStompService: RxStompService) { 
    this.stompEndpoint = '/app' + this.endpoint
  }

  public sendMessage(message: Message) {
    this.rxStompService.publish({destination: `${this.stompEndpoint}/add`, body: JSON.stringify(message)})
  }

  public updateMessage(message: Message) {
    this.rxStompService.publish({destination: `${this.stompEndpoint}/update`, body: JSON.stringify(message)})
  }

  public deleteMessage(id: string) {
    this.rxStompService.publish({destination: `${this.stompEndpoint}/delete`, body: JSON.stringify(id)})
  }

  public getMessages(chatroomId: string, page: number): Observable<HttpResponse<Slice>> {
    let url = environment.chatServerUrl;
    return this.httpClient.get<Slice>(url + this.endpoint, {
        observe: 'response',
        params: { 
          chatroomId : chatroomId, 
          page: page
        },
        withCredentials: true,
    });
  }

  public getMessagesBefore(chatroomId: string, startDate: Date, size?: number): Observable<HttpResponse<Slice>> {
    let url = environment.chatServerUrl;
    let params = new HttpParams().set('chatroomId', chatroomId).set('startDate', startDate.toLocaleString() )
    if (size) 
      params.set('size', size)
    return this.httpClient.get<Slice>(url + this.endpoint, {
        observe: 'response',
        params,
        withCredentials: true,
    });
  }
}
