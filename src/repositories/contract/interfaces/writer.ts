import { Model } from 'sequelize';

export default interface Writer<I extends Model, A, C> {
  create(item: Partial<C>): Promise<I>;
  update(item: Partial<A>, query: any): Promise<[affectedCount: number]>;
  delete(query: any): Promise<number>;
}
