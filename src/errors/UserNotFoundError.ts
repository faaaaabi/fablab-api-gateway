export default class UserNotFoundError extends Error {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}