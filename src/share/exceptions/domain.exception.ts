// domain/exceptions/domain.exception.ts
import { ValidationError } from 'class-validator';

export interface ValidationErrorItem {
  field: string;
  message: string;
}

export interface BusinessError {
  property: string;
  message: string;
}

export class DomainException extends Error {
  public readonly fields: ValidationErrorItem[];

  constructor(
    message: string,
    validatorErrors: ValidationError[] = [], // class-validator 产生的原始错误树
    businessErrors: BusinessError[] = []    // 我们在 onValidate 钩子里定义的业务错误
  ) {
    super(message);
    
    // ⚡ 核心转换流水线
    const decoratorFields = this.flattenValidatorErrors(validatorErrors);
    const businessFields = businessErrors.map(err => ({
      field: err.property,
      message: err.message
    }));

    // 合并并去重：如果一个字段同时有格式和逻辑错误，只展示第一个
    this.fields = this.deduplicate([...decoratorFields, ...businessFields]);
  }

  // 🌳 递归打平：处理类似 address.city.zipCode 的深层路径
  private flattenValidatorErrors(errors: ValidationError[], parentPath = ''): ValidationErrorItem[] {
    const result: ValidationErrorItem[] = [];

    for (const error of errors) {
      const path = parentPath ? `${parentPath}.${error.property}` : error.property;

      if (error.constraints) {
        result.push({ field: path, message: Object.values(error.constraints)[0] });
      }

      if (error.children?.length) {
        result.push(...this.flattenValidatorErrors(error.children, path));
      }
    }
    return result;
  }

  private deduplicate(errors: ValidationErrorItem[]): ValidationErrorItem[] {
    const seen = new Set<string>();
    return errors.filter(item => {
      if (seen.has(item.field)) return false;
      seen.add(item.field);
      return true;
    });
  }
}