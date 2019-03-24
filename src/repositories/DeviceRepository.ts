import { Device } from '../entities/Device';
import { BaseRepository } from './base/BaseRepository';
import { ObjectID } from 'bson';
import { DeleteWriteOpResultObject } from 'mongodb';


export class DeviceRepository extends BaseRepository<Device> {
  async findDevicesByDeviceNames(deviceNames: Array<string>): Promise<Device[]> {
    const result: Device[] = await this.collection.find({deviceName: { $in: deviceNames }}).toArray();
    return result;
  }
  async findDeviceById(deviceID: ObjectID): Promise<Device> {
    const result: Device = await this.collection.findOne({_id: deviceID});
    return result;
  }
  async deleteDeviceById(deviceID: ObjectID): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.collection.deleteOne({_id: deviceID});
    return !!result.result.ok
  }
}