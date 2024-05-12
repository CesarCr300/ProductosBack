import { HttpException, Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { ServiceBase } from '../../base/service.base';
import { User } from './entities/user.entity';
import { FilterUserDto } from './dto/filter-user.dto';
import { HashingUtil } from '../../utils/hashing';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { ClsService } from 'nestjs-cls';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';

@Injectable()
export class UserService extends ServiceBase<
  {
    name: 'User';
    type: User;
  },
  User,
  User,
  User,
  FilterUserDto,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(
    _usersRepository: UserRepository,
    private readonly cls: ClsService,
  ) {
    super(_usersRepository, {
      article: 'el',
      resourceName: 'usuario',
      requiresValidationInUpdate: true,
      requiresValidationInCreation: true,
      adapterFindAll: (e: User) => e,
      adapterFindOne: (e: User) => e,
      functionToCreateObjectToFindIfTheEntityAlreadyExists: (dto: any) => ({
        email: dto.email,
        username: dto.username,
      }),
    });
  }
  async update(id: number, dto: UpdateUserDto): Promise<any> {
    if (dto.password) {
      dto.password = await HashingUtil.hash(dto.password);
    }

    return await super.update(id, dto);
  }

  async create(dto: CreateUserDto): Promise<User> {
    dto.password = await HashingUtil.hash(dto.password);
    return await super.create(dto);
  }

  async updatePassword(dto: UpdatePasswordUserDto): Promise<any> {
    const userFounded = await this._repository.findOne({
      id: this.cls.get('user').sub,
    });
    if (!userFounded) {
      throw new HttpException('Usuario no encontrado', 404);
    }
    if (
      !(await HashingUtil.compare(dto.originalPassword, userFounded.password))
    ) {
      throw new HttpException('Contraseña incorrecta', 400);
    }
    if (dto.newPassword === dto.originalPassword) {
      throw new HttpException(
        'La nueva contraseña debe ser diferente a la anterior',
        400,
      );
    }
    const newPassword = await HashingUtil.hash(dto.newPassword);
    await this._repository.update(userFounded.id, {
      password: newPassword,
    });
    return null;
  }

  async sendLinkToResetPassword(dto: ResetPasswordUserDto): Promise<any> {
    const user = await this._repository.findOne(
      {},
      {
        where: [
          { email: dto.emailOrUsername },
          { username: dto.emailOrUsername },
        ],
      },
    );
    if (!user) {
      return;
    }

    return null;
  }
}
