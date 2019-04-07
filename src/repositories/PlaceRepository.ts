import BaseRepository from './base/BaseRepository';
import { ObjectID } from 'bson';
import { DeleteWriteOpResultObject } from 'mongodb';
import Place from '../entities/Place';


export default class PlaceRepository extends BaseRepository<Place> {
  async findPlaceById(placeID: ObjectID): Promise<Place> {
    const result: Place = await this.collection.findOne({_id: new ObjectID(placeID)});
    return result;
  }
  async deletePlaceById(placeID: ObjectID): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.collection.deleteOne({_id: placeID});
    return !!result.result.ok
  }
}