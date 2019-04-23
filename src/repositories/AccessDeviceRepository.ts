import BaseRepository from './base/BaseRepository';
import Place from '../entities/Place';
import AccessDevice from "../entities/AccessDevice";


export default class AccessDeviceRepository extends BaseRepository<Place> {
    async findAccessDeviceByIdentifier(identifier: string): Promise<AccessDevice> {
        const result: AccessDevice = await this.collection.findOne({identifier});
        return result;
    }
}