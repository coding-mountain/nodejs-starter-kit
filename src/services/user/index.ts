import { UserCreationAttributes, UserStatus, UserFillable } from '@app/models/user/types';
import User from '@app/models/user';
import { uniqueId, generateToken, isExpired } from '@app/utils';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ValidationException,
} from '@app/exceptions/index';
import JWT, { JwtData } from '@app/libs/jwt';
import { REFRESH_TOKEN_VERSION, TOKEN_EXPIRE_TIME } from '@app/config';
import EmailService from '@app/libs/email';
import Hash from '@app/utils/hash';
import UserRepository from '@app/repositories/user';
import { UserRole } from '@app/config/constant';

export interface UpdateableFields {
  name?: string;
}

class UserService {
  private user = UserRepository;

  /**
   * Find user by email
   *
   * @param   {string<User>}   email  [email of user]
   *
   * @return  {Promise<User>}         [return user instance]
   */
  public async findByEmail(email: string): Promise<User | null> {
    return this.user.findByEmail(email);
  }

  /**
   * Find by Uid
   *
   * @param   {string<User>}   uid  [uid of user]
   *
   * @return  {Promise<User>}       [return user instance]
   */
  public async findByUid(uid: string): Promise<User | null> {
    return this.user.findByUid(uid);
  }

  /**
   * create a user
   *
   * @param   {UserFillable<user>}  data  [fillable data]
   *
   * @return  {{user:User, verifyToken:string}}}                    [return user and token]
   */
  public async register(data: UserFillable) {
    const verifyToken = generateToken();
    const payload: UserCreationAttributes = {
      ...data,
      status: UserStatus.INACTIVE,
      verifyToken,
      verifyTokenGeneratedAt: new Date(),
      password: await Hash.create(data.password),
      uid: uniqueId(),
      authToken: null,
    };
    return this.user.create(payload);
  }

  /**
   * Login user
   *
   * @param   {string}   email     [email of user]
   * @param   {string}   password  [password of user]
   *
   * @return  {object}            [return token and user]
   */
  public async login(email: string, password: string, role: UserRole) {
    const user = await this.user.findByEmail(email);
    if (!user || user.role !== role || !Hash.compare(password, user.password)) {
      throw new ValidationException('Incorrect Email or Password');
    }

    if (user.status === UserStatus.INACTIVE) {
      const verifyTokenGeneratedAt = String(user.verifyTokenGeneratedAt);
      if (isExpired(verifyTokenGeneratedAt, TOKEN_EXPIRE_TIME)) {
        const token = await this.generateVerifyToken(user.email);
        await EmailService.sendVerificationEmail(user.email, user.name, token);
        throw new ValidationException('VERIFICATION_EMAIL_SENT');
      }
      throw new ValidationException('USER_NOT_ACTIVE');
    }

    user.authToken = uniqueId();
    await user.save();

    return {
      token: {
        accessToken: await JWT.generate(user.uid, user.authToken!),
        refreshToken: await JWT.generate(user.uid, user.authToken!, true),
      },
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }

  /**
   * [async description]
   *
   * @param   {string}   email  [email of user]
   * @param   {string}   token  [token ]
   *
   * @return  {Promise<User>}         [return prommise of user instance]
   */
  public async verifyEmail(email: string, token: string) {
    const user = await this.user.findByEmail(email);
    if (!user || user.status !== UserStatus.INACTIVE || user.verifyToken !== token) {
      throw new ValidationException('Invalid request');
    }
    const verifyTokenGeneratedAt = user.verifyTokenGeneratedAt as unknown;
    if (isExpired(verifyTokenGeneratedAt as string, TOKEN_EXPIRE_TIME)) {
      throw new ValidationException('Token Expired');
    }
    user.status = UserStatus.ACTIVE;
    user.emailVerifiedAt = new Date();
    user.verifyToken = null;
    user.authToken = uniqueId();
    await user.save();
    return {
      token: {
        accessToken: await JWT.generate(user.uid, user.authToken!),
        refreshToken: await JWT.generate(user.uid, user.authToken!, true),
      },
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }

  /**
   * Generate verification token
   *
   * @param   {string}  email  [email description]
   *
   * @return  {string}         [return token]
   */
  public async generateVerifyToken(email: string): Promise<string> {
    const verifyToken = generateToken();
    const verifyTokenGeneratedAt = new Date();
    await this.user.update({ verifyToken, verifyTokenGeneratedAt }, { where: { email } });
    return verifyToken;
  }

  /**
   * Update User Profile
   *
   * @param   {number}  userId  [user id]
   * @param   {object}  data    [user data]
   *
   * @return  {object}          [return user instance]
   */
  public async updateProfile(userId: number, data: UpdateableFields) {
    const { name } = data;
    const user = await this.user.findByPk(userId);
    if (!user) {
      throw new ValidationException('Invalid request');
    }

    if (name) {
      user.name = name;
    }

    await user.save();
    return user.toProfileDTO();
  }

  /**
   * [async get user profile]
   *
   * @param   {string}  userUid  [userUid description]
   *
   * @return  {ProfileDTO}           [return description]
   */
  public async getProfile(userUid: string) {
    const user = await this.user.findByUid(userUid);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('profile not found');
    }
    return user.toProfileDTO();
  }

  public async refreshJwtToken(email: string, refreshToken: string) {
    let tokenPayload;
    try {
      tokenPayload = JWT.verify(refreshToken, true) as JwtData;
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (tokenPayload.version !== REFRESH_TOKEN_VERSION) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const user = await this.user.findByUid(tokenPayload.uid);
    if (!user || user.email !== email) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (tokenPayload.authToken !== user.authToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    user.authToken = uniqueId();
    await user.save();
    return {
      token: {
        accessToken: await JWT.generate(user.uid, user.authToken!),
        refreshToken: await JWT.generate(user.uid, user.authToken!, true),
      },
      user: {
        uid: user.uid,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    };
  }

  /**
   * [async description]
   *
   * @param   {number}  userId       [userId description]
   * @param   {string}  oldPassword  [oldPassword description]
   * @param   {string}  newPassword  [newPassword description]
   *
   * @return  {boolean}               [return description]
   */
  public async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.user.findByPk(userId);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (!Hash.compare(oldPassword, user.password)) {
      throw new ValidationException('invalid old password');
    }
    user.password = await Hash.create(newPassword);
    await user.save();
    return true;
  }

  /**
   * [async get update forgot password token]
   *
   * @param   {string}  email  [email]
   *
   * @return  {boolean}         []
   */
  public async forgotPassword(email: string, role: UserRole) {
    const user = await this.user.findByEmail(email);
    if (!user || user.role !== role) {
      throw new ValidationException('user not found');
    }
    const token = generateToken();
    user.forgotPasswordToken = token;
    user.forgotPasswordTokenGeneratedAt = new Date();
    await user.save();
    return true;
  }

  /**
   * [async reset password with forgot password token]
   *
   * @param   {string}  email     [email]
   * @param   {string}  token     [otp token]
   * @param   {string}  password  [new password]
   *
   * @return  {boolean}            [return]
   */
  public async updateForgotPassword(email: string, token: string, password: string) {
    const user = await this.user.findByEmail(email);
    if (!user) {
      throw new ValidationException('user not found');
    }

    if (
      user.forgotPasswordToken !== token ||
      !user.forgotPasswordTokenGeneratedAt ||
      isExpired(user.forgotPasswordTokenGeneratedAt, TOKEN_EXPIRE_TIME)
    ) {
      throw new ValidationException('invalid token');
    }

    user.password = await Hash.create(password);
    await user.save();
    return true;
  }

  /**
   * [async logout user]
   *
   * @param   {number}  userId  [userId description]
   *
   * @return  {boolean}          [return description]
   */
  public async logout(userId: number) {
    const user = await this.user.findByPk(userId);
    if (!user) {
      throw new BadRequestException('user not found');
    }
    user.authToken = uniqueId();
    await user.save();
    return true;
  }
}

export default new UserService();
