import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';
import { ChatroomComponent } from './components/views/chatroom/chatroom.component';
import { ChatroomSearchComponent } from './components/views/chatroom-search/chatroom-search.component';
import { ChatPanelComponent } from './components/elements/chat-panel/chat-panel.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'chatroom', component: ChatroomComponent, children: [
    { path: 'search', component: ChatroomSearchComponent },
    { path: ':id', component: ChatPanelComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
