import BaseError from './BaseError';

export default class UserNotFoundError extends BaseError {
  constructor(message?: string) {
    super(message || 'Requested user could not be found');
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
