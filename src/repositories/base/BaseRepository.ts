import { WritableRepo } from 'repositories/interfaces/WritableRepo';
import { ReadableRepo } from 'repositories/interfaces/ReadableRepo';

import { MongoClient, Db, Collection, InsertOneWriteOpResult, FindOneOptions } from 'mongodb';
import { Result } from 'range-parser';

// that class only can be extended
export abstract class BaseRepository<T> implements WritableRepo<T>, ReadableRepo<T> {
  public readonly collection: Collection;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection(collectionName);
  }

  async create(item: T): Promise<boolean> {
    const result: InsertOneWriteOpResult = await this.collection.insertOne(item);
    return !!result.result.ok;
  }
  update(id: string, item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async find(item: T): Promise<T[]> {
    const result: T[] = await this.collection.findOne(item);
    return result;
  }
  findOne(id: string): Promise<T> {
    throw new Error('Method not implemented.');
  }
}
