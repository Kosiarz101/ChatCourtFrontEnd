import { SessionUserNotFoundError } from './session-user-not-found-error';

describe('SessionUserNotFoundError', () => {
  it('should create an instance', () => {
    expect(new SessionUserNotFoundError()).toBeTruthy();
  });
});
