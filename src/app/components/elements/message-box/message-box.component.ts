import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { Message } from 'src/app/interfaces/entities/message';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.css']
})
export class MessageBoxComponent implements OnInit {

  @Input() message: Message | undefined;
  @Input() author: ChatroomUser | undefined;
  @Input() chosenMessageId: string | undefined;
  @Input() public currentUserId: string | undefined;
  @Output() updateMessageEvent = new EventEmitter<Message>();
  @Output() deleteMessageEvent = new EventEmitter<string>();

  constructor() {}

  ngOnInit(): void {
  }

  public updateMessage() {
    this.updateMessageEvent.emit(this.message);
  }

  public deleteMessage() {
    this.deleteMessageEvent.emit(this.message!.id)
  }

  public isMessageSelected() : boolean {
    return (this.chosenMessageId != undefined && this.chosenMessageId == this.message!.id)
  }

  public isMessageDefault() : boolean {
    return (this.chosenMessageId == undefined || this.chosenMessageId != this.message!.id)
  }
}
