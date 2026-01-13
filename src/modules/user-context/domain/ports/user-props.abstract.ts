import { UserStatus } from '../user.constants';

export abstract class UserPropsAbstract {
  abstract id: string;
  abstract email: string;
  abstract name: string;
  abstract passwordHash: string; // 领域层建议命名为 Hash，明确其已加密
  abstract role: string[];
  abstract status: UserStatus;
  abstract createTime: Date;
  abstract updateTime: Date;
}