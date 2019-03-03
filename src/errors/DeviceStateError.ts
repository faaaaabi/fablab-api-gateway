export default class DeviceStateError extends Error {
  constructor(message: string) {
      super(message);

      // Set the prototype explicitly.
      Object.setPrototypeOf(this, DeviceStateError.prototype);
  }
}