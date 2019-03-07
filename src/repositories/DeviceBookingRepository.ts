import { DeviceBooking } from '../entities/deviceBooking';
import { BaseRepository } from './base/BaseRepository';

export class DeviceBookingRepository extends BaseRepository<DeviceBooking> {
  async findBookingsByDeviceNames(deviceNames: Array<string>): Promise<DeviceBooking[]> {
    const result: DeviceBooking[] = await this.collection.find({deviceName: { $in: deviceNames }}).toArray();
    return result;
  }
}
