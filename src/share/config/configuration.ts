import type { Config, Default, Objectype, Production } from './config.interface';

const util = {
  isObject<T>(value: T): value is T & Objectype {
    return value != null && typeof value === 'object' && !Array.isArray(value);
  },
  deepMerge<T, U>(target: T, source: U): T & U {
    const output = Object.assign({}, target); // 复制 target 作为基础
    
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source as object).forEach(key => {
        const targetValue = (target as any)[key];
        const sourceValue = (source as any)[key];
        
        if (this.isObject(targetValue) && this.isObject(sourceValue)) {
          // 如果都是对象，则进行递归合并
          output[key] = this.deepMerge(targetValue, sourceValue);
        } else {
          // 否则，直接使用 source 的值覆盖 target 的值
          output[key] = sourceValue;
        }
      });
    }
    return output as T & U;
  }
};

export const configuration = (): Config => {
  const { config } = <{ config: Default }>require(`${__dirname}/envs/default`);
  const { config: environment } = <{ config: Production }>require(`${__dirname}/envs/${process.env.NODE_ENV || 'development'}`);

  // object deep merge
  return util.deepMerge(config, environment);
};