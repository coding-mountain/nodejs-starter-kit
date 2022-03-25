import { DataTypes, Model } from 'sequelize';
import sequelize from '@app/bootstrap/sequelize';
import { UserRole } from '@app/config/constant';
import { ProfileDTO, UserAttributes, UserCreationAttributes, UserDTO, UserStatus } from './types';

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;

  declare uid: string;

  declare name: string;

  declare password: string;

  declare email: string;

  declare role: UserRole;

  declare status: UserStatus;

  declare emailVerifiedAt?: Date;

  declare verifyToken: string | null;

  declare verifyTokenGeneratedAt: Date;

  declare authToken: string | null;

  declare forgotPasswordToken: string | null;

  declare forgotPasswordTokenGeneratedAt: Date | null;

  declare readonly createdAt: Date;

  declare readonly updatedAt: Date;

  declare readonly deletedAt: Date;

  public toDTO(): UserDTO {
    const data: UserDTO = {
      id: this.uid,
      email: this.email,
      name: this.name,
    };
    return data;
  }

  public toProfileDTO(): ProfileDTO {
    const data: ProfileDTO = {
      email: this.email,
      id: this.uid,
      name: this.name,
    };

    return data;
  }
}

User.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(255),
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
    },
    password: {
      type: DataTypes.STRING(255),
    },
    verifyToken: {
      type: DataTypes.STRING(255),
    },
    verifyTokenGeneratedAt: {
      type: DataTypes.DATE,
    },
    role: {
      type: DataTypes.ENUM(UserRole.ADMIN, UserRole.USER),
    },
    status: {
      type: DataTypes.ENUM(UserStatus.ACTIVE, UserStatus.BANNED, UserStatus.DELETED, UserStatus.INACTIVE),
      defaultValue: UserStatus.INACTIVE,
    },
    authToken: {
      type: DataTypes.STRING,
    },
    forgotPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    forgotPasswordTokenGeneratedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    sequelize,
    tableName: 'Users',
  }
);

export default User;
