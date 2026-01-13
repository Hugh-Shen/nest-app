import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    // 1. 提取错误详情
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const stack = exception instanceof Error ? exception.stack : null;

    // 2. 内部审计日志：对内记录所有细节
    const logFormat = `
      Request Original: ${request.method} ${request.url}
      User: ${request.user?.id || 'Guest'}
      Error Details: ${exception instanceof Error ? exception.message : exception}
      Stack: ${stack}
    `;

    // 💡 关键：根据严重程度分类记录
    if (status >= 500) {
      this.logger.error(logFormat); // 500 错误：立刻引起重视
      this.reportToDevelopers(exception, request); // 👈 上报逻辑
    } else {
      this.logger.warn(logFormat); // 400 错误：业务异常，仅警告
    }

    // 3. 对外翻译：保持礼貌与模糊
    response.status(status).json({
      success: false,
      message: status >= 500 ? '系统繁忙，请稍后再试' : (exception as any).message,
    });
  }

  private reportToDevelopers(exception: any, request: any) {
    // 这里的逻辑可以是：
    // 1. 发送 Webhook 到钉钉/飞书群
    // 2. 推送数据到 Sentry / ELK
    // 3. 发送邮件
  }
}