export abstract class IIdGenerator {
  /**
   * 生成一个全局唯一的字符串标识
   */
  abstract generate(): string;

  /**
   * 可选：校验一个字符串是否符合 ID 格式
   */
  abstract isValid(id: string): boolean;
}