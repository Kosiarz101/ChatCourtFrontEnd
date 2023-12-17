import { TestBed } from '@angular/core/testing';

import { StompMessageService } from './stomp-message.service';

describe('StompMessageService', () => {
  let service: StompMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StompMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
