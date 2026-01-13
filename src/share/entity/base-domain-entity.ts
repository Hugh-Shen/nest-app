import { validateSync, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { DomainException, BusinessError } from '../exceptions/domain.exception';

export abstract class BaseDomainEntity<T extends object> {
  protected props: T;

  constructor(props: T, propsConstructor: new () => T) {
    // 1. 转换实例以激活装饰器
    const instance = plainToInstance(propsConstructor, props);
    
    // 2. 建立 Proxy 拦截
    this.props = this.createProxy(instance);
    
    // 3. 执行首次全量校验
    this.validate();
  }

  // 🛡️ 提取 Proxy 创建逻辑，保持构造函数清爽
  private createProxy(target: T): T {
    return new Proxy(target, {
      set: (obj, prop, value, receiver) => {
        const result = Reflect.set(obj, prop, value, receiver);
        this.validate(); // ⚡ 属性变动即刻校验
        return result;
      }
    });
  }

  protected validate(): void {
    // 🔍 收集装饰器错误
    const decoratorErrors = validateSync(this.props as object);
    
    // 🔍 收集自定义业务逻辑错误
    const businessErrors = this.onValidate(this.props);

    // 🚀 如果存在任何错误，抛出统一异常
    if (decoratorErrors.length > 0 || businessErrors.length > 0) {
      throw new DomainException('领域校验失败', decoratorErrors, businessErrors);
    }
  }

  // 💡 钩子：子类可覆盖此方法实现复杂逻辑
  protected onValidate(props: T): BusinessError[] {
    return [];
  }
}