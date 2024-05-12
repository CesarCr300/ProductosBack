import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RolesGuard } from '../auth/guards/roles-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';
import { Public } from '../auth/utils/isPublic';
import { ResetPasswordUserDto } from './dto/reset-password-user.dto';
import { JwtRecoverPasswordAuthGuard } from '../auth/guards/jwt-recover-password.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('update-password')
  updatePassword(@Body() update: UpdatePasswordUserDto) {
    return this.userService.updatePassword(update);
  }

  @Get('link-to-reset-password')
  @Public()
  sendLinkToResetPassword(@Query() dto: ResetPasswordUserDto) {
    return this.userService.sendLinkToResetPassword(dto);
  }

  @Post('recover-password')
  @Public()
  @UseGuards(JwtRecoverPasswordAuthGuard)
  recoverPassword() {
    return this.userService.recoverPassword();
  }
}
