import { DeepPartial, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { classToPlain, plainToClass } from 'class-transformer';

import { AdminEntity, CustomerEntity, TechnicianEntity, UserEntity } from 'src/auth/entity/user.entity';
import { UserLoginDto } from 'src/auth/dto/user-login.dto';
import { BaseRepository } from 'src/common/repository/base.repository';
import { UserSerializer } from 'src/auth/serializer/user.serializer';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { UserStatusEnum } from 'src/auth/user-status.enum';
import { ExceptionTitleList } from 'src/common/constants/exception-title-list.constants';
import { StatusCodesList } from 'src/common/constants/status-codes-list.constants';
import { CustomHttpException } from 'src/exception/custom-http.exception';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity, UserSerializer> {
  /**
   * store new user
   * @param createUserDto
   * @param token
   */
  async store(
    createUserDto: DeepPartial<UserEntity>,
    token: string
  ): Promise<UserSerializer> {
    if (!createUserDto.status) {
      createUserDto.status = UserStatusEnum.INACTIVE;
    }
    createUserDto.salt = await bcrypt.genSalt();
    createUserDto.token = token;

    const Model = this.getUserInstanceType(createUserDto.roleId);
    const user = new Model();
    Object.assign(user, createUserDto);

    await user.save();
    return this.transform(user);
  }

  private getUserInstanceType(roleId: number) {
    switch (roleId) {
      case 1: return AdminEntity;
      case 2: return CustomerEntity;
      case 3:
      case 4:
        return TechnicianEntity;

      default: throw new CustomHttpException('Invalid roleId provided');
    }
  }

  /**
   * login user
   * @param userLoginDto
   */
  async login(
    userLoginDto: UserLoginDto
  ): Promise<[user: UserEntity, error: string, code: number]> {
    const { username, password } = userLoginDto;
    const user = await this.findOne({
      where: [
        {
          username: username
        },
        {
          email: username
        }
      ]
    });
    if (user && (await user.validatePassword(password))) {
      if (user.status !== UserStatusEnum.ACTIVE) {
        return [
          null,
          ExceptionTitleList.UserInactive,
          StatusCodesList.UserInactive
        ];
      }
      return [user, null, null];
    }
    return [
      null,
      ExceptionTitleList.InvalidCredentials,
      StatusCodesList.InvalidCredentials
    ];
  }

  /**
   * Get user entity for reset password
   * @param resetPasswordDto
   */
  async getUserForResetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<UserEntity> {
    const { token } = resetPasswordDto;
    const query = this.createQueryBuilder('user');
    query.where('user.token = :token', { token });
    query.andWhere('user.tokenValidityDate > :date', {
      date: new Date()
    });
    return query.getOne();
  }

  /**
   * transform user
   * @param model
   * @param transformOption
   */
  transform(model: UserEntity, transformOption = {}): UserSerializer {
    return plainToClass(
      UserSerializer,
      classToPlain(model, transformOption),
      transformOption
    );
  }

  /**
   * transform users collection
   * @param models
   * @param transformOption
   */
  transformMany(models: UserEntity[], transformOption = {}): UserSerializer[] {
    return models.map((model) => this.transform(model, transformOption));
  }
}
