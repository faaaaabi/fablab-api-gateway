export default class DeviceNotFoundError extends Error {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, DeviceNotFoundError.prototype);
  }
}