import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module';
import { DomainExceptionFilter } from './share/fitler/domain-exception.filter';
import { AllExceptionsFilter } from './share/fitler/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // 过滤器逻辑是从右到左
  app.useGlobalFilters(new AllExceptionsFilter(), new DomainExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
