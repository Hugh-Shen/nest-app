import * as bcrypt from 'bcrypt';
import { PasswordHasherAbstract } from '../../domain/ports/password-hasher.abstract';

export class PasswordHasherAdapter implements PasswordHasherAbstract {
  async hash(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}