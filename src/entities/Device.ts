import { ObjectID, ObjectId } from 'bson';
import { actor } from '../types/actor';
import { ProductReference } from './ProductReference';

export class Device {
  private _id: ObjectID;
  private deviceName: string;
  private productReferenceID: ObjectID;
  private productReference: ProductReference[];
  private actor: actor;
  private requiresSequrityConfirmation: boolean;

  constructor(
    deviceID?: ObjectID,
    deviceName?: string,
    productReferenceID?: ObjectID,
    actor?: actor,
    requiresSequrityConfirmation?: boolean
  );
  constructor(
    deviceID?: ObjectID,
    deviceName?: string,
    productReferenceID?: ObjectID,
    actor?: actor,
    requiresSequrityConfirmation?: boolean,
    productReference?: ProductReference[]
  ) {
    this._id = deviceID;
    this.deviceName = deviceName;
    this.productReferenceID = productReferenceID;
    this.productReference = productReference;
    this.actor = actor;
    this.requiresSequrityConfirmation = requiresSequrityConfirmation;
  }

  getActor(): actor {
    return this.actor;
  }

  getProductReferenceID(): ObjectID {
    return this.productReferenceID;
  } 

  getDeviceName(): string {
    return this.deviceName;
  }
}
