import { DomainException, BusinessError } from '../../exceptions/domain.exception';
import { MysqlTranslator } from '../strategies/mysql-translator.strategy';

export function HandleDatabaseError(constraints: Record<string, BusinessError>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        // 获取翻译策略（实际项目中可通过依赖注入或工厂获取）
        const translator = new MysqlTranslator(); 
        const logicalKey = translator.getLogicalConstraintName(error);

        if (logicalKey && constraints[logicalKey]) {
          // 命中映射，抛出领域异常 🚀
          throw new DomainException('数据操作失败', [], [constraints[logicalKey]]);
        }
        
        // 未命中则交给 AllExceptionsFilter 兜底
        throw error;
      }
    };
  };
}