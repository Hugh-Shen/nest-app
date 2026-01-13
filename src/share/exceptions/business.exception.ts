export class BusinessException extends Error {
  constructor(public readonly message: string, public readonly code: string = 'BUSINESS_ERROR') {
    super(message);
  }
}

export class UserAlreadyExistsException extends BusinessException {
  constructor() {
    super('该邮箱已被注册', 'USER_ALREADY_EXISTS');
  }
}