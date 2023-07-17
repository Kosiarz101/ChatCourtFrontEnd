import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Slice } from 'src/app/interfaces/chatserver/slice';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  private endpoint: string = "/chatroom"

  constructor(private httpClient: HttpClient) { }

  public getAll() : Observable<Slice> {
    let url = environment.chatServerUrl;
    return this.httpClient.get<Slice>(url + this.endpoint);
  }
}
