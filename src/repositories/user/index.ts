import { UserAttributes, UserCreationAttributes } from '@app/models/user/types';
import User from '@app/models/user';
import BaseRepository from '@app/repositories/contract/baseRepository';
import { WhereOptions } from 'sequelize';
import { UserRole } from '@app/config/constant';

class UserRepository extends BaseRepository<UserAttributes, UserCreationAttributes, User> {
  constructor() {
    super(User);
  }

  findUsers() {
    return this.find({});
  }

  public findById(id: number) {
    return this.findByPk(id);
  }

  public findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  public findByUid(uid: string, role?: UserRole): Promise<User | null> {
    const whereOptions: WhereOptions<UserAttributes> = { uid };
    if (role) {
      whereOptions.role = role;
    }
    return this.findOne({ where: whereOptions });
  }
}

export default new UserRepository();
