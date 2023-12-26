import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message as StompMessage } from '@stomp/stompjs';
import { Message } from 'src/app/interfaces/entities/message'
import { AppUserService } from 'src/app/services/chatserver/app-user.service';
import { MessageService } from 'src/app/services/chatserver/message.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';
import { SessionService } from 'src/app/services/frontend/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  @Input() public selectedChatroom = {} as Chatroom;
  public messageContent: string = "";
  public chatroomTitle = "Choose chatroom";
  public currentUserId: string = '';

  constructor(private messageService: MessageService, private sessionService: SessionService, private stompMessageService: StompMessageService) { 
    if (this.existsCurrentUserId())
      this.currentUserId = sessionService.getId() as string;
    else 
      (sessionService.getId() as Observable<string>).subscribe(id =>
        this.currentUserId = id
      )
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedChatroom']) {
      this.updateSelectedChatroom()
    } 
  }
  @Input() updateSelectedChatroom() {
    this.chatroomTitle = this.selectedChatroom.name;
  }

  public sendMessage(content: string) {
    if (this.existsCurrentUserId())
      this.executeSendMessage(content, this.sessionService.getId() as string)
    else {
      (this.sessionService.getId() as Observable<string>).subscribe(id => 
        this.executeSendMessage(content, id)
      )
    }   
  }

  public isMessageBoxEmpty(value: string, button: MatButton) {
    if (value) {
      button.disabled = false;
      console.log('should be true: ', button.disabled)
    } else {
      button.disabled = true
      console.log('should be false: ', button.disabled)
    }
  }

  private executeSendMessage(content: string, authorId: string) {
    let message: Message = {
      content: content,
      authorId: authorId,
      chatroomId: this.selectedChatroom.id,
      id: '',
      creationDate: new Date()
    }
    this.stompMessageService.publish({destination: `/app/message/add`, body: JSON.stringify(message)})
  }

  private existsCurrentUserId(): boolean {
    return this.sessionService.exists(this.sessionService.idKey)
  }

  // @Input() updateSelectedChatroom(value: any) {
  //   console.log('chat panel: ', value);
  //   this.selectedChatroom = value as Chatroom;
  //   this.chatroomTitle = this.selectedChatroom.name;
  // }

}
