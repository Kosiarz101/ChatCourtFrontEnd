import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/views/login/login.component';
import { ChatroomComponent } from './components/views/chatroom/chatroom.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMatModule } from './modules/app-mat/app-mat.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { ChatroomListComponent } from './components/elements/chatroom-list/chatroom-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatroomComponent,
    ChatroomListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppMatModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
