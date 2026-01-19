import { DbErrorTranslator } from './db-error-translator.interface';

export class MysqlTranslator implements DbErrorTranslator {
  getLogicalConstraintName(error: any): string | null {
    if (error.errno === 1062) {
      const match = error.message.match(/for key '(.+?)'/);
      if (match) match[1].split('.').pop() || null;
    }
    return null;
  }
}