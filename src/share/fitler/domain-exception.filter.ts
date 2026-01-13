// interface/http/common/filters/domain-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { DomainException } from '../exceptions/domain.exception';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 1. 统一状态码，通常领域校验失败属于“错误的请求”
    const status = HttpStatus.BAD_REQUEST;

    // 2. 构建标准响应结构 📦
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message, // 例如：“校验失败”
      // ⚡ 这里的 fields 是 DomainException 已经打平并去重后的统一数组
      errors: exception.fields, 
    });
  }
}