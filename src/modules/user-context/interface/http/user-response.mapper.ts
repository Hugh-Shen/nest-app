import { plainToInstance } from 'class-transformer';
import { User } from '../../domain/user';
import { UserResponseDto } from './dtos/user-response.dto';

export class UserResponseMapper {
  static toResponse(user: User): UserResponseDto {
    return plainToInstance(UserResponseDto, user.getProps(), {
      excludeExtraneousValues: true, // 开启白名单模式 🛡️
    });
  }
}