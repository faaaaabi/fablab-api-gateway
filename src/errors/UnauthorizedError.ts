import BaseError from "./BaseError";

export default class UnauthorizedError extends BaseError {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}