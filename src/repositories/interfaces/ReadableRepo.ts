export interface ReadableRepo<T> {
  find(item: T): Promise<T[]>;
  findOne(id: string): Promise<T>;
}
