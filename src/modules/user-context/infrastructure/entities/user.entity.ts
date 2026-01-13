import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from '../../domain/user.constants';
import { transform } from 'src/share/utils/transform';

@Entity('user')
export class UserEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id: string

  @Column({ length: 50 })
  name: string

  @Column({ length: 50 })
  email: string

  @Column({ length: 100 })
  password: string

  @Column({ 
    type: 'varchar',
    length: 100,
    transformer: transform(),
  })
  role: string[]

  @Column({ 
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Active,
  })
  status: UserStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateTime: Date
}