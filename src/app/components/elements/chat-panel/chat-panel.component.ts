import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Chatroom } from 'src/app/interfaces/entities/chatroom';
import { Message as StompMessage } from '@stomp/stompjs';
import { Message } from 'src/app/interfaces/entities/message'
import { AppUserService } from 'src/app/services/chatserver/app-user.service';
import { MessageService } from 'src/app/services/chatserver/message.service';
import { StompMessageService } from 'src/app/services/chatserver/stomp-message.service';
import { ResponseEntity } from 'src/app/interfaces/chatserver/response-entity';

@Component({
  selector: 'app-chat-panel',
  templateUrl: './chat-panel.component.html',
  styleUrls: ['./chat-panel.component.css']
})
export class ChatPanelComponent implements OnInit {

  @Input() public selectedChatroom = {} as Chatroom;
  public messageContent: string = "";
  public chatroomTitle = "Choose chatroom";

  constructor(private messageService: MessageService, private appUserService: AppUserService, private stompMessageService: StompMessageService) { }

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
    let message: Message = {
      content: content,
      authorId: this.appUserService.getCurrentUser().id,
      chatroomId: this.selectedChatroom.id,
      id: '',
      creationDate: new Date()
    }
    // this.messageService.sendMessage(message).subscribe(res => {
    //   console.log(res);
    // })
    // this.stompMessageService.watch(`/topic/public/${message.chatroomId}`).subscribe((response: StompMessage) => {
    //   let responseEntity: ResponseEntity = JSON.parse(response.body)
    //   console.log('new re: ', responseEntity)
    //   console.log('new Message: ', responseEntity.body)
    //   this.selectedChatroom.messages.push(responseEntity.body as Message)
    // })
    this.stompMessageService.publish({destination: `/app/message/add`, body: JSON.stringify(message)})
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

  // @Input() updateSelectedChatroom(value: any) {
  //   console.log('chat panel: ', value);
  //   this.selectedChatroom = value as Chatroom;
  //   this.chatroomTitle = this.selectedChatroom.name;
  // }

}
