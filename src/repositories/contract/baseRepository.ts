import { Model, ModelStatic, FindAndCountOptions, FindOptions, UpdateOptions, DestroyOptions } from 'sequelize';
import Writer from '@app/repositories/contract/interfaces/writer';
import Reader from '@app/repositories/contract/interfaces/reader';

/**
 * A - model attributes
 * C - creation attributes
 * I - model instance
 */
abstract class BaseRepository<A, C, I extends Model<A, C>> implements Writer<I, A, C>, Reader<I> {
  protected model: ModelStatic<I>;

  constructor(model: ModelStatic<I>) {
    this.model = model;
  }

  public build(data: C) {
    return this.model.build(data);
  }

  public find(query: FindOptions<A>): Promise<I[]> {
    return this.model.findAll(query);
  }

  public findOne(query: FindOptions<A>): Promise<I | null> {
    return this.model.findOne(query);
  }

  public findByPk(id: number): Promise<I | null> {
    return this.model.findByPk(id);
  }

  public create(data: C): Promise<I> {
    return this.model.create(data);
  }

  public update(data: Partial<A>, query: UpdateOptions): Promise<[number, I[]]> {
    return this.model.update(data, query);
  }

  public delete(query: DestroyOptions): Promise<number> {
    return this.model.destroy(query);
  }

  public findAndCountAll(options: FindAndCountOptions<A>): Promise<{
    rows: I[];
    count: number;
  }> {
    return this.model.findAndCountAll(options);
  }

  public bulkCreate(data: C[]): Promise<I[]> {
    return this.model.bulkCreate(data);
  }
}

export default BaseRepository;
