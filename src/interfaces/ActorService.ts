export interface ActorService<T> {
  toggleDeviceState(actor: T): Promise<void>;
  switchOnDevice(actor: T): Promise<boolean>;
  switchOffDevice(actor: T): Promise<boolean>;
}