import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  private endpoint: string = "/user"

  constructor(private httpClient: HttpClient) { 
  }

  public existsByEmail(email: string): Observable<boolean> {
    let url = environment.chatServerUrl;
    let params = new HttpParams().set('email', email);
    console.log(params)
    return this.httpClient.get<boolean>(url + this.endpoint + '/exists', {params});
  }

  public add(user: AppUser): Observable<HttpResponse<AppUser>> {
    let url = environment.chatServerUrl + this.endpoint;
    return this.httpClient.post<AppUser>(url, user,  {
      observe: 'response'
    });
  }
}
