import { IsEmail, IsString, IsEnum, MinLength } from 'class-validator';
import { UserStatus } from './user.constants';
import { UserPropsAbstract } from './ports/user-props.abstract';

export class UserPropsImpl implements UserPropsAbstract {
  @IsString()
  id: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @IsString()
  @MinLength(2, { message: '昵称太短了' })
  name: string;

  passwordHash: string;
  role: string[];
  
  @IsEnum(UserStatus)
  status: UserStatus;

  createTime: Date;
  updateTime: Date;
}