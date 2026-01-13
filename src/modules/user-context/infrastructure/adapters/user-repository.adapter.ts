// src/modules/user-context/infrastructure/repositories/user-repository.adapter.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryAbstract } from '../../domain/ports/user-repository.abstract';
import { User } from '../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable() // 1. 让 NestJS 能够注入这个类
export class UserRepositoryAdapter implements UserRepositoryAbstract { // 2. 实现领域层契约
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeormRepository: Repository<UserEntity>, // 3. 注入原生 Repository
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.typeormRepository.findOneBy({ id });
    return UserMapper.toDomain(entity)
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.typeormRepository.findOneBy({ email });

    return UserMapper.toDomain(entity)
  }

  async save(user: User): Promise<User> {
    try {
      const entity = UserMapper.toPersistence(user);
      
      const savedEntity = await this.typeormRepository.save(entity);

      return UserMapper.toDomain(savedEntity) as User;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists (concurrent conflict)');
      }
      throw error; // 其他未知错误继续向上抛出
    }
  }
}