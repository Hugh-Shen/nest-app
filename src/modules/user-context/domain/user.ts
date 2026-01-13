import { UserStatus } from './user.constants';
import { RegisterUserDto } from '../application/dtos/register-user.dto';
import type { PasswordHasherAbstract } from './ports/password-hasher.abstract';
import type { UserPropsAbstract } from './ports/user-props.abstract'
import type { IIdGenerator } from './ports/id-generator.abstract';

import { UserPropsImpl } from './user-props.impl';
import { BaseDomainEntity } from '../../../share/entity/base-domain-entity';


export class User extends BaseDomainEntity<UserPropsAbstract> {
  private domainEvents: any[] = [];

  constructor(props: UserPropsAbstract) {
    super(props, UserPropsImpl);
  }

  static async create(dto: RegisterUserDto, idGenerator: IIdGenerator, passwordHasher: PasswordHasherAbstract) {
    const hashedPassword = await passwordHasher.hash(dto.password);
    const user = new User({
      id: idGenerator.generate(), // 生成唯一标识
      email: dto.email,
      name: dto.nickname, // 对应 DTO 里的字段
      passwordHash: hashedPassword,
      role: ['USER'],
      status: UserStatus.PENDING,
      createTime: new Date(),
      updateTime: new Date(),
    });

    return user;
  }

  async comparePassword(password: string, hasher: PasswordHasherAbstract): Promise<boolean> {
    return await hasher.compare(password, this.props.passwordHash);
  }

  async changePassword(password: string, hasher: PasswordHasherAbstract): Promise<void> {
    this.props.passwordHash = await hasher.hash(password);
    this.props.updateTime = new Date();
  }

  async activate(): Promise<void> {
    this.props.status = UserStatus.Active;
    this.props.updateTime = new Date();
  }

  public getEmail(): string {
    return this.props.email;
  }

  public getProps(): UserPropsAbstract {
    return Object.freeze({ ...this.props });
  }
}