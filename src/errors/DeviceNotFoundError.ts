import BaseError from "./BaseError";

export default class DeviceNotFoundError extends BaseError {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, DeviceNotFoundError.prototype);
  }
}