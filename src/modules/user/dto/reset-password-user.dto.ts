import { IsNotEmpty } from 'class-validator';

export class ResetPasswordUserDto {
  @IsNotEmpty()
  emailOrUsername: string;
}
