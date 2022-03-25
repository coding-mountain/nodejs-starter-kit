import { Optional } from 'sequelize';
import { UserRole } from '@app/config/constant';

export enum UserStatus {
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
}

export interface Profile {
  name: string;
}

export interface UserFillable {
  name: string;
  password: string;
  email: string;
  role: UserRole;
}

export interface UserAttributes {
  id: number;
  uid: string;
  name: string;
  password: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt?: Date;
  verifyToken: string | null;
  verifyTokenGeneratedAt: Date;
  authToken: string | null;
  forgotPasswordToken: string | null;
  forgotPasswordTokenGeneratedAt: Date | null;
}

type OptionalUserAttributes = 'id' | 'emailVerifiedAt' | 'forgotPasswordToken' | 'forgotPasswordTokenGeneratedAt';

export interface UserCreationAttributes extends Optional<UserAttributes, OptionalUserAttributes> {}

export interface UserDTO {
  id: UserAttributes['uid'];
  email: UserAttributes['email'];
  name: UserAttributes['name'];
}

export interface ProfileDTO {
  id: UserAttributes['uid'];
  name: UserAttributes['name'];
  email: UserAttributes['email'];
}
