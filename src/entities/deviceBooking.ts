export class DeviceBooking {
  private deviceName: string;
  private userUID: string;
  private startTime: number;
  private endTime: number;

  constructor(deviceName: string, userUID: string) {
    this.deviceName = deviceName;
    this.userUID = userUID;
  }

  setStartTime = (startTime: number) => {
    this.startTime = startTime;
  }
}
