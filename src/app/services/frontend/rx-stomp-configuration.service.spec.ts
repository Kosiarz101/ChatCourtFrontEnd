import { TestBed } from '@angular/core/testing';

import { RxStompConfigurationService } from './rx-stomp-configuration.service';

describe('RxStompConfigurationService', () => {
  let service: RxStompConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxStompConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
