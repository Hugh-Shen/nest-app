import { plainToInstance, instanceToPlain } from 'class-transformer';
import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserStatus } from '../../domain/user.constants';
import { UserResponseDto } from '../../interface/http/dtos/user-response.dto';

export class UserMapper {
  /**
   * 1. 数据库实体 -> 领域实体 (Reconstitution)
   */
  static toDomain(entity: UserEntity | null): User | null {
    if (!entity) return  null

    const props = {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      passwordHash: entity.password, // 👈 这里的对齐至关重要
      role: entity.role || ['USER'],
      status: entity.status as UserStatus,
      createTime: entity.createTime,
      updateTime: entity.updateTime,
    }

    return new User(props);
  }

  /**
   * 2. 领域实体 -> 数据库实体 (Persistence)
   */
  static toPersistence(user: User): UserEntity {
    const props = user.getProps();
    const entity = new UserEntity();

    // 将领域对象转为普通 JSON 对象，再赋值给实体
    // 这里可以利用 class-transformer 的 @Exclude() 装饰器在领域类上标记敏感字段
    // const plain = instanceToPlain(user);
    
    Object.assign(entity, { 
      ...props,  
      password: props.passwordHash,
    });
    return entity;
  }
}