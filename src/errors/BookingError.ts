import BaseError from "./BaseError";

export default class BookingError extends BaseError {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, BookingError.prototype);
  }
}