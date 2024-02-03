import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatroomUser } from 'src/app/interfaces/entities/chatroom-user';
import { Message } from 'src/app/interfaces/entities/message';
import { MessageService } from 'src/app/services/chatserver/message.service';

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
  private messageSelectedColor: string = "rgb(37 37 37)"
  private messageNormalColor: string = '#3f51b5'

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
  }

  public updateMessage() {
    this.updateMessageEvent.emit(this.message);
  }

  public deleteMessage() {
    this.messageService.deleteMessage(this.message!.id)
  }

  public getMessageColor() : string | undefined {
    return (this.chosenMessageId != undefined && this.chosenMessageId == this.message!.id) ? this.messageSelectedColor : this.messageNormalColor
  }
}
