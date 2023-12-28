import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatroomSearchComponent } from './chatroom-search.component';

describe('ChatroomSearchComponent', () => {
  let component: ChatroomSearchComponent;
  let fixture: ComponentFixture<ChatroomSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatroomSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatroomSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
