import BaseError from './BaseError';

export default class NotFoundError extends BaseError {
  constructor(message?: string) {
    super(message || 'Requested entity could not be found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
