import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from './infrastructure/entities/user.entity'
import { UserRepositoryAdapter } from './infrastructure/adapters/user-repository.adapter'
import { IdGeneratorAdapter } from './infrastructure/adapters/id-generator.adapter'
import { PasswordHasherAdapter } from './infrastructure/adapters/password-hasher.adapter'
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case'

import { UserRepositoryAbstract } from './domain/ports/user-repository.abstract'
import { IIdGenerator } from './domain/ports/id-generator.abstract'
import { PasswordHasherAbstract } from './domain/ports/password-hasher.abstract'
import { UserContextController } from './user-context.controller'


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])], // 注册实体
  controllers: [UserContextController],
  providers: [
    RegisterUserUseCase,
    { provide: UserRepositoryAbstract, useClass: UserRepositoryAdapter },
    { provide: IIdGenerator, useClass: IdGeneratorAdapter },
    { provide: PasswordHasherAbstract, useClass: PasswordHasherAdapter },
    // ... 其他 Service
  ],
  exports: [UserRepositoryAbstract, IIdGenerator, PasswordHasherAbstract], // 导出给应用层使用
})
export class UserContextModule {}