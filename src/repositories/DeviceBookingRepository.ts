import DeviceBooking from '../entities/DeviceBooking';
import BaseRepository from './base/BaseRepository';
import { ObjectID } from 'bson';
import { DeleteWriteOpResultObject } from 'mongodb';

export default class DeviceBookingRepository extends BaseRepository<DeviceBooking> {
  async findBookingsByDeviceIDs(deviceIDs: Array<ObjectID>): Promise<DeviceBooking[]> {
    const result: DeviceBooking[] = await this.collection
      .find({ deviceID: { $in: deviceIDs } })
      .toArray();
    return result;
  }
  async findBookingByDeviceID(deviceID: ObjectID): Promise<DeviceBooking> {
    const deviceObjectID = new ObjectID(deviceID)
    const result: DeviceBooking = await this.collection.findOne({ deviceID: deviceObjectID });
    return result;
  }
  async findBookingByID(bookingID: ObjectID): Promise<DeviceBooking> {
    const bookingObjectID = new ObjectID(bookingID)
    const result: DeviceBooking = await this.collection.findOne({ _id: bookingObjectID });
    return result;
  }
  async findBookingsByID(bookingIDs: Array<ObjectID>): Promise<DeviceBooking[]> {
    const bookingObjectIDs = bookingIDs.map(bookingID => {
      return new ObjectID(bookingID);
    });
    const result: DeviceBooking[] = await this.collection
      .find({ _id: { $in: bookingObjectIDs } })
      .toArray();
    return result;
  }
  async deleteBookingById(bookingID: ObjectID): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.collection.deleteOne({ _id: bookingID });
    return !!result.result.ok;
  }
}
