import { v4 as uuidv4, validate } from 'uuid';
import { IIdGenerator } from '../../domain/ports/id-generator.abstract';

export class IdGeneratorAdapter implements IIdGenerator {
  generate(): string {
    return uuidv4();
  }

  isValid(id: string): boolean {
    return validate(id);
  }
}