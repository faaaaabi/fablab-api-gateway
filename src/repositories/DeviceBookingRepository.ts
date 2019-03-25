import { DeviceBooking } from '../entities/DeviceBooking';
import { BaseRepository } from './base/BaseRepository';
import { ObjectID } from 'bson';
import { DeleteWriteOpResultObject } from 'mongodb';


export class DeviceBookingRepository extends BaseRepository<DeviceBooking> {
  async findBookingsByDeviceIDs(deviceIDs: Array<ObjectID>): Promise<DeviceBooking[]> {
    const result: DeviceBooking[] = await this.collection.find({_id: { $in: deviceIDs }}).toArray();
    return result;
  }
  async findBookingById(bookingID: ObjectID): Promise<DeviceBooking> {
    const result: DeviceBooking = await this.collection.findOne({_id: bookingID});
    return result;
  }
  async deleteBookingById(bookingID: ObjectID): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.collection.deleteOne({_id: bookingID});
    return !!result.result.ok
  }
}
