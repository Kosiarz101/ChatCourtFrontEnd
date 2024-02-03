import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginRequest } from 'src/app/interfaces/chatserver/login-request';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { environment } from 'src/environments/environment';
import { SessionService } from '../frontend/session.service';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  private userEndpoint: string = "/user"
  private authEndpoint: string = "/auth"
  private chatServerUrl: string;

  constructor(private httpClient: HttpClient) { 
    this.chatServerUrl = environment.chatServerUrl
  }

  public add(user: AppUser): Observable<HttpResponse<AppUser>> {
    let url = this.chatServerUrl + this.userEndpoint;
    console.log('adding user: ', user, ' to url: ', url)
    return this.httpClient.post<AppUser>(url, user,  {
      observe: 'response'
    });
  }

  public sendLoginRequest(email: string, password: string): Observable<HttpResponse<AppUser>> {
    let loginRequest: LoginRequest = {"email": email, "password": password}
    let url = this.chatServerUrl + this.authEndpoint + "/login";
    console.log('lgo: ', loginRequest, ' to url ', url)
    let currentUser: Observable<HttpResponse<AppUser>> = this.httpClient.post<AppUser>(url, loginRequest, {
      observe: 'response',
      withCredentials: true 
    });
    return currentUser; 
  }

  public existsByEmail(email: string): Observable<boolean> {
    let params = new HttpParams().set('email', email);
    console.log(params)
    return this.httpClient.get<boolean>(this.chatServerUrl + this.userEndpoint + '/exists-by-email', {params});
  }

  public getCurrentUser(): Observable<HttpResponse<AppUser>> {
    let url = this.chatServerUrl + this.userEndpoint
    return this.httpClient.get<AppUser>(url, {
      observe: 'response',
    })
  }

  public isUserIwaniuk(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        return value.toLowerCase().includes("iwaniuk") ? {forbiddenName: {value: control.value}} : null;
    }
  }

  public static init(id: string): AppUser {
    return {
      id: id,
      email: '',
      password: '',
      username: '',
      creationDate: new Date()
    }
  }
}
