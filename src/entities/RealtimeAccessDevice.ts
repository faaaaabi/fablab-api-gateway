import { Observer } from '../interfaces/Observer';

export class RealtimeAccessDevice implements Observer {
  private accessDeviceName: string;
  private deviceLocation: string;

  constructor(deviceName: string, deviceLocation: string) {
    this.accessDeviceName = deviceName;
    this.deviceLocation = deviceLocation;
  }

  pushChange = (): void => {};
}
