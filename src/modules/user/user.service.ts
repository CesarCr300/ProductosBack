import { Injectable } from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repository/user.repository';
import { ServiceBase } from '../../base/service.base';
import { User } from './entities/user.entity';
import { FilterUserDto } from './dto/filter-user.dto';
import { HashingUtil } from '../../utils/hashing';

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
  constructor(_usersRepository: UserRepository) {
    super(_usersRepository, {
      article: 'el',
      resourceName: 'usuario',
      requiresValidationInUpdate: true,
      requiresValidationInCreation: true,
      adapterFindAll: (e: User) => e,
      adapterFindOne: (e: User) => e,
      functionToCreateObjectToFindIfTheEntityAlreadyExists: (dto: any) => ({
        email: dto.email,
      }),
    });
  }
  async update(id: number, dto: UpdateUserDto): Promise<any> {
    if (dto.password) {
      dto.password = await HashingUtil.hash(dto.password);
    }

    return await super.update(id, dto);
  }
}
