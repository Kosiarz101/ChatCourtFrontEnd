import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Slice } from 'src/app/interfaces/chatserver/slice';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { environment } from 'src/environments/environment';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class ChatroomService {

  private endpoint: string = "/chatroom"
  private url: string;

  constructor(private httpClient: HttpClient) { 
    this.url = environment.chatServerUrl;
  }

  public getById(id: string): Observable<Chatroom> {
      return this.httpClient.get<Chatroom>(this.url + this.endpoint + "/" + id, {withCredentials: true})
  }

  public findByUserId(userId: string, includeMessages: boolean = false) : Observable<Slice> {
    return this.httpClient.get<Slice>(this.url + this.endpoint, 
      {  
        withCredentials: true, 
        params: { 
          includeMessages : includeMessages, 
          userId: userId
        } 
      }
    );
  }

  public findByNameAndCategoryId(name: string, categoryId: string, page: number) : Observable<Slice> {
    return this.httpClient.get<Slice>(this.url + this.endpoint, {  
      params: {
        chatroomName: name,
        categoryId: categoryId,
        page: page
      },
      withCredentials: true 
    });
  }

  public findByName(name: string, page: number) : Observable<Slice> {
    return this.httpClient.get<Slice>(this.url + this.endpoint, {  
      params: {
        chatroomName: name,
        page: page
      },
      withCredentials: true 
    });
  }

  public static init(id: string, categoryId: string): Chatroom {
    return {
      id: id,
      name: '',
      isPublic: false,
      category: CategoryService.init(categoryId),
      messages: new Array(),
      creationDate: new Date()
    }
  }
}
