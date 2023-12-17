import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoginRequest } from 'src/app/interfaces/chatserver/login-request';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {

  private userEndpoint: string = "/user"
  private authEndpoint: string = "/auth"
  private userStorageKey: string = "CurrentChatCourtAppUser"

  constructor(private httpClient: HttpClient) { 
  }

  public add(user: AppUser): Observable<HttpResponse<AppUser>> {
    let url = environment.chatServerUrl + this.userEndpoint;
    console.log('adding user: ', user, ' to url: ', url)
    return this.httpClient.post<AppUser>(url, user,  {
      observe: 'response'
    });
  }

  public login(email: string, password: string): Observable<HttpResponse<AppUser>> {
    let loginRequest: LoginRequest = {"email": email, "password": password}
    let url = environment.chatServerUrl + this.authEndpoint + "/login";
    console.log('lgo: ', loginRequest, ' to url ', url)
    let obs: Observable<HttpResponse<AppUser>> = this.httpClient.post<AppUser>(url, loginRequest, {
      observe: 'response',
      withCredentials: true 
    });
    obs.subscribe(response => {
      console.log(response)
      if (response.status == 200 && response.body != null) {
        this.saveUserInStorage(response.body)
      }
    })
    return obs; 
  }

  public getCurrentUser(): AppUser {
    let userStringify: string | null = localStorage.getItem(this.userStorageKey);
    if (userStringify != null) {
      return JSON.parse(userStringify)
    }
    return {} as AppUser;
  }

  public saveUserInStorage(appUser: AppUser) {
    localStorage.setItem(this.userStorageKey, JSON.stringify(appUser));
  }

  public existsByEmail(email: string): Observable<boolean> {
    let url = environment.chatServerUrl;
    let params = new HttpParams().set('email', email);
    console.log(params)
    return this.httpClient.get<boolean>(url + this.userEndpoint + '/exists-by-email', {params});
  }

  public isUserIwaniuk(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        return value.toLowerCase().includes("iwaniuk") ? {forbiddenName: {value: control.value}} : null;
    }
  }
}
