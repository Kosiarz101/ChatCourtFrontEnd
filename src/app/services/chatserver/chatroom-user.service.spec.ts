import { TestBed } from '@angular/core/testing';

import { ChatroomUserService } from './chatroom-user.service';

describe('ChatroomUserService', () => {
  let service: ChatroomUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatroomUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
