import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {

  public selectedUpperButtonToggle: string;

  constructor() { 
    this.selectedUpperButtonToggle = "chatroomList"
  }

  ngOnInit(): void {
  }

  public upperButtonToggleHandler(value: string) {
    console.log(value)
    this.selectedUpperButtonToggle = value;
  }
}
