import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClsService } from 'nestjs-cls';
import { env } from 'process';

import { ServiceBase } from '../../base/service.base';
import { HashingUtil } from '../../utils/hashing';
import { EmailService } from '../../services/email.service';
import { RecoveredPasswordPayload } from '../../entities/payload-recover-password.entity';
import { UserRepository } from './repository/user.repository';
import { User } from './entities/user.entity';
import { getRecoverPasswordUserEmail } from './emails/recover-password-user-email';
import {
  CreateUserDto,
  UpdatePasswordUserDto,
  UpdateUserDto,
  FilterUserDto,
  GetLinkToResetPasswordUserDto,
} from './dto';

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
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
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

  async sendLinkToResetPassword(dto: GetLinkToResetPasswordUserDto): Promise<any> {
    const user = await this._repository.findOne(
      {},
      {
        where: [
          { email: dto.emailOrUsername },
          { username: dto.emailOrUsername },
        ],
      },
    );
    //If the user does not exist, we do not send the email
    //and we have the same API response as if the user existed
    //because we do not want to give information about the existence of the user
    if (!user) {
      return;
    }
    const recoverPasswordPayload: RecoveredPasswordPayload = {
      sub: user.id,
      recoveringPassword: true,
    };
    const token = this.jwtService.sign(recoverPasswordPayload);
    const { content, subject } = getRecoverPasswordUserEmail(
      env.FRONTEND_URL,
      token,
    );

    this.emailService.sendEmail(user.email, subject, content);
    return;
  }

  async recoverPassword() {
    return 'accedio';
  }
}
