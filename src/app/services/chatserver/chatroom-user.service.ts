import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseModel } from 'src/app/interfaces/entities/base-model';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatroomUserService {

  private endpoint: string = "/chatroom-user";

  constructor(private httpClient: HttpClient) { }

  public add(chatroomUser: ChatroomUser): Observable<HttpResponse<ChatroomUser>> {
    let url = environment.chatServerUrl;
    return this.httpClient.post<ChatroomUser>(url + this.endpoint, chatroomUser, {
        observe: 'response'
    });
  }
}
