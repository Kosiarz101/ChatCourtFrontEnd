import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/views/login/login.component';
import { ChatroomComponent } from './components/views/chatroom/chatroom.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AppMatModule } from './modules/app-mat/app-mat.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ChatroomListComponent } from './components/elements/chatroom-list/chatroom-list.component';
import { ChatPanelComponent } from './components/elements/chat-panel/chat-panel.component';
import { UserListComponent } from './components/elements/user-list/user-list.component';
import { JWTInterceptor } from './interceptors/jwt.interceptor';
import { ChatroomSearchComponent } from './components/views/chatroom-search/chatroom-search.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatroomComponent,
    ChatroomListComponent,
    ChatPanelComponent,
    UserListComponent,
    ChatroomSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppMatModule,
    NgbModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JWTInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
