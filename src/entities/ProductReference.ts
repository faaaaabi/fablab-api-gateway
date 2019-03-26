import { ObjectID } from 'bson';

export class ProductReference {
  private _id: ObjectID;
  private erpIdentifier: string;
  private productID: string;

  constructor(
    ID?: ObjectID,
    erpIdentifier?: string,
    productID?: string
  ) {
    this._id = ID;
    this.erpIdentifier = erpIdentifier;
    this.productID = productID;
  }

  getProductID(): string {
    return this.productID;
  }
}
