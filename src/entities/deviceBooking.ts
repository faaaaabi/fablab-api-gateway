import { ObjectID, ObjectId } from 'bson';

export class DeviceBooking {
  private deviceName: string;
  private userUID: string;
  private startTime: number;
  private endTime: number;
  private _id: ObjectID;

  constructor(deviceName?: string, userUID?: string, bookingID?: ObjectID) {
    this.deviceName = deviceName;
    this.userUID = userUID;
    this._id = bookingID;
  }

  set setStartTime(startTime: number){
    this.startTime = startTime;
  };

  get getDeviceName(): string {
    return this.deviceName;
  }

  get getUserID(): string {
    return this.userUID;
  }

  get getID(): ObjectId {
    return this._id;
  }
}
