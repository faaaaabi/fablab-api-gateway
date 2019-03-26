import { WritableRepo } from 'repositories/interfaces/WritableRepo';
import { ReadableRepo } from 'repositories/interfaces/ReadableRepo';

import {
  MongoClient,
  Db,
  Collection,
  InsertOneWriteOpResult,
  FindOneOptions,
  ObjectID,
  DeleteWriteOpResultObject
} from 'mongodb';
import { Result } from 'range-parser';

// that class only can be extended
export abstract class BaseRepository<T> implements WritableRepo<T>, ReadableRepo<T> {
  public readonly collection: Collection;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(item: T): Promise<ObjectID> {
    const result: InsertOneWriteOpResult = await this.collection.insertOne(item);
    return result.insertedId;
  }
  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async delete(id: ObjectID): Promise<boolean> {
    const result: DeleteWriteOpResultObject = await this.collection.deleteOne({ _id: id });
    return !!result.result.ok;
  }
  async findOne(item: T): Promise<T> {
    const result: T = await this.collection.findOne(item);
    return result;
  }

  async find(item: T[]): Promise<T[]> {
    const result: T[] = await this.collection.find(item).toArray();
    return result;
  }
}
