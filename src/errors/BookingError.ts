export default class BookingError extends Error {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, BookingError.prototype);
  }
}