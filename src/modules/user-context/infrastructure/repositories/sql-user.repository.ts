import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryAbstract } from '../../domain/ports/user-repository.abstract';
import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';
import { HandleDatabaseError } from '../../../../share/database/decorators/handle-database-error.decorator';

@Injectable()
export class SqlUserRepository implements UserRepositoryAbstract {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepo: Repository<UserEntity>,
  ) {}

  @HandleDatabaseError({
    // 将数据库物理索引 'UQ_USER_EMAIL' 映射为业务错误
    'UQ_USER_EMAIL': { property: 'email', message: '该邮箱已被系统占用' },
    'UQ_USER_NAME': { property: 'nickname', message: '昵称已被他人抢注' },
  })
  async save(user: User): Promise<User> {
    const persistenceModel = UserMapper.toPersistence(user);
    const savedEntity = await this.ormRepo.save(persistenceModel);
    return UserMapper.toDomain(savedEntity) as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.ormRepo.findOne({ where: { email } });
    return record ? UserMapper.toDomain(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.ormRepo.findOne({ where: { id } });
    return record ? UserMapper.toDomain(record) : null;
  }
}