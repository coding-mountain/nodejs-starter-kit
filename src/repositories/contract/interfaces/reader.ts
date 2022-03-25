import { Model, FindOptions } from 'sequelize';

export default interface Reader<T extends Model> {
  find(query: FindOptions): Promise<T[]>;
  findOne(query: FindOptions): Promise<T | null>;
}
