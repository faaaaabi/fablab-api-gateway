import { ObjectID, ObjectId } from 'bson';

export default class DeviceBooking {
  private deviceID: ObjectID;
  private userUID: string;
  private startTime: number;
  private endTime: number;
  private _id: ObjectID;

  constructor(deviceID?: ObjectID, userUID?: string, bookingID?: ObjectID) {
    this.deviceID = deviceID;
    this.userUID = userUID;
    this._id = bookingID;
  }

  set setStartTime(startTime: number){
    this.startTime = startTime;
  };

  get getStartTime(): number {
    return this.startTime;
  };

  get getDeviceID(): ObjectID {
    return this.deviceID;
  }

  get getUserID(): string {
    return this.userUID;
  }

  get getID(): ObjectId {
    return this._id;
  }
}
