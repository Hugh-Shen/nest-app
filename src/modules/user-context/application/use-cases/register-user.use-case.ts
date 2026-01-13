import { Injectable, Inject } from '@nestjs/common';
import type { RegisterUserDto } from '../dtos/register-user.dto';
import { User } from '../../domain/user';
import { PasswordHasherAbstract } from '../../domain/ports/password-hasher.abstract';
import { UserRepositoryAbstract } from '../../domain/ports/user-repository.abstract';
import { IIdGenerator } from '../../domain/ports/id-generator.abstract';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryAbstract,
    private readonly passwordHasher: PasswordHasherAbstract,
    private readonly idGenerator: IIdGenerator,
  ) {}

  async execute(props: RegisterUserDto): Promise<User> {
    const newUser = await User.create(props, this.idGenerator, this.passwordHasher);
    const existingUser = await this.userRepository.findByEmail(newUser.getEmail());

    if (existingUser) {
      throw new Error('Email already exists');
    }
  
    await this.userRepository.save(newUser);
    return newUser;
  }
}