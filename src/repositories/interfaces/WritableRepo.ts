import { ObjectID } from "bson";

export interface WritableRepo<T> {
  create(item: T): Promise<ObjectID>;
  update(id: string, item: T): Promise<boolean>;
  delete(id: ObjectID): Promise<boolean>;
}
