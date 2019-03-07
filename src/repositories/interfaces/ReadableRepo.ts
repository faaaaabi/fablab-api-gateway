export interface ReadableRepo<T> {
  find(item: T[]): Promise<T[]>;
  findOne(item: T): Promise<T>;
}
