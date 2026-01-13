import { User } from '../user';

export abstract class UserRepositoryAbstract {
  abstract findById(id: string): Promise<User | null>

  abstract findByEmail(email: string): Promise<User | null>

  abstract save(user: User): Promise<User>
}