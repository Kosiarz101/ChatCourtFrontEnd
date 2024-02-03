import { Injectable } from '@angular/core';
import { SessionUserNotFoundError } from 'src/app/exceptions/session-user-not-found-error';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { AppUserService } from '../chatserver/app-user.service';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public readonly idKey: string = "currentUserId"
  public readonly emailKey: string = "currentUserEmail"
  public readonly usernameKey: string = "currentUserUsername"
  public readonly creationDateKey: string = "currentUserCreationDate"

  constructor(private appUserService: AppUserService) {}

  public signIn(email: string, password: string): Observable<HttpResponse<AppUser>> {
    return this.appUserService.sendLoginRequest(email, password);
  }

  public setSessionUser(appUser: AppUser) {
    console.log('CURRENT USER ID: ', appUser.id)
    sessionStorage.setItem(this.idKey, appUser.id)
    sessionStorage.setItem(this.emailKey, appUser.email)
    sessionStorage.setItem(this.usernameKey, appUser.username)
    sessionStorage.setItem(this.creationDateKey, appUser.creationDate.toString())
  }

  public getId(): Observable<string> {
    console.log('current id', sessionStorage.getItem(this.idKey)!)
    return of(sessionStorage.getItem(this.idKey)).pipe(
      switchMap(id => {
        if (!id) {
          return this.createObs(this.idKey, "Id not found in a session storage")?.pipe(
            map(response => {
                return sessionStorage.getItem(this.idKey)!
            })
          )
        } else {
          return of(id)
        } 
      })
    )
  } 

  public getEmail(): string | Observable<string> {
    let obs = this.createObs(this.emailKey, "Email not found in a session storage")?.pipe(
      map(response => {
          return sessionStorage.getItem(this.emailKey)!
      })
    )
    return this.exists(this.emailKey) ? sessionStorage.getItem(this.emailKey)! : obs
  } 

  public getUsername(): string | Observable<string> {
    let obs = this.createObs(this.usernameKey, "Username not found in a session storage")?.pipe(
      map(response => {
          return sessionStorage.getItem(this.usernameKey)!
      })
    )
    return this.exists(this.usernameKey) ? sessionStorage.getItem(this.usernameKey)! : obs
  } 

  public getCreationDate(): Date | Observable<Date> {
    let obs = this.createObs(this.creationDateKey, "Creation Date not found in a session storage")?.pipe(
      map(response => {
          return new Date(sessionStorage.getItem(this.creationDateKey)!) 
      })
    )
    return this.exists(this.creationDateKey) ? new Date(sessionStorage.getItem(this.creationDateKey)!) : obs
  } 

  public exists(key: string) : boolean {
    return sessionStorage.getItem(key) != null 
  }

  private createObs(key: string, errorMessage: string): Observable<HttpResponse<AppUser>> {
    console.log('updating user in session service')
    return this.appUserService.getCurrentUser().pipe(
      tap(response => {
        if (response.status == 200 && response.body != null) {
          this.setSessionUser(response.body)
        }           
        else
          throw new SessionUserNotFoundError(errorMessage)          
      })
    )
  }
}
