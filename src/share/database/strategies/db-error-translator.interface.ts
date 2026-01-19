export interface DbErrorTranslator {
  // 返回识别到的“逻辑约束名”，如 'user_email_unique'
  getLogicalConstraintName(error: any): string | null;
}