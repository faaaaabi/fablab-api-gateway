import { ObjectID, ObjectId } from 'bson';

export class Device {
  private _id: ObjectID;
  private deviceName: string;
  private automationBusReference: string;

  constructor(deviceID?: ObjectID, deviceName?: string, automationBus?: string) {
    this._id = deviceID;
    this.deviceName = deviceName;
    this.automationBusReference = automationBus;
  }

}
