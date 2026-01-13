import { IsEmail, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: '邮箱格式不正确' })
  readonly email: string;

  @IsString()
  @MinLength(8, { message: '密码至少需要8位' })
  @MaxLength(20)
  // 💡 甚至可以加正则表达式，强制要求包含数字和字母
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '密码太简单了，必须包含大小写字母和数字',
  })
  readonly password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(10)
  readonly nickname: string;
}