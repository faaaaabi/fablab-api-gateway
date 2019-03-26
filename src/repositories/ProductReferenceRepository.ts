import { BaseRepository } from './base/BaseRepository';
import { ObjectID } from 'bson';
import { ProductReference } from '../entities/ProductReference';

export class ProductReferenceRepository extends BaseRepository<ProductReference> {
  async findProductReferenceById(ProductReferenceID: ObjectID): Promise<ProductReference> {
    const result: ProductReference = await this.collection.findOne({
      _id: new ObjectID(ProductReferenceID)
    });
    return result;
  }
}
