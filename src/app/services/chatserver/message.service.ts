import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Message } from 'src/app/interfaces/entities/message';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private endpoint: string = "/message"

  constructor(private httpClient: HttpClient) { }

  public sendMessage(message: Message): Observable<HttpResponse<any>> {
    let url = environment.chatServerUrl;
    return this.httpClient.post(url + this.endpoint, message, {
        observe: 'response'
    });
  }
}
