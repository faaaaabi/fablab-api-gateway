import BaseError from "./BaseError";

export default class DeviceStateError extends BaseError {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, DeviceStateError.prototype);
  }
}