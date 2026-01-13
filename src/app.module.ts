import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './share/config/config.module'
import { DatabaseModule } from './share/database/database.module'
import { UserContextModule } from './modules/user-context/user-context.module';

@Module({
  imports: [
    AppConfigModule,  
    DatabaseModule,
    UserContextModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
