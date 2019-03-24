import { ObjectID, ObjectId } from 'bson';
import { actor } from '../types/actor';

export class Device {
  private _id: ObjectID;
  private deviceName: string;
  private actor: actor;
  private requiresSequrityConfirmation: boolean;

  constructor(
    deviceID?: ObjectID,
    deviceName?: string,
    actor?: actor,
    requiresSequrityConfirmation?: boolean
  ) {
    this._id = deviceID;
    this.deviceName = deviceName;
    this.actor = actor;
    this.requiresSequrityConfirmation = requiresSequrityConfirmation;
  }

  getActor(): actor {
    return this.actor
  }
}
