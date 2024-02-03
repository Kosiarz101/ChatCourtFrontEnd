import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private prefix: string = 'notifications-'
  private limit: number = 10

  constructor() {}

  public add(chatroomId: string) {
    let newValue
    if (this.exists(chatroomId))
      newValue = Number(localStorage.getItem(this.key(chatroomId))!) + 1
    else
      newValue = 1
    localStorage.setItem(this.key(chatroomId), newValue.toString())
  }

  public remove(chatroomId: string) {
    localStorage.removeItem(this.key(chatroomId))
  }

  public get(chatroomId: string) {
    return Number(localStorage.getItem(this.key(chatroomId)))! 
  }

  public exists(chatroomId: string) {
    return localStorage.getItem(this.key(chatroomId)) != undefined 
  }

  public isUnderLimit(chatroomId: string) {
    return Number(localStorage.getItem(this.key(chatroomId)))! < this.limit
  }

  private key(chatroomId: string): string {
    return this.prefix + chatroomId
  }
}
