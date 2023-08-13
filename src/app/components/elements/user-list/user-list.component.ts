import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/interfaces/entities/app-user';
import { AppUserService } from 'src/app/services/chatserver/app-user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  private appUsers: Array<AppUser> = []
  constructor(private appUserService: AppUserService) { 
  }

  ngOnInit(): void {
  }

  public retrieveUsers() {
  }

}
