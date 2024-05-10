import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ClsModule } from 'nestjs-cls';

import { dbConfig } from '../../config/db.config';
import { UserInterceptor } from '../../interceptors/user.interceptor';
import { AuditorySuscriber } from '../auditory/suscribers/auditory.suscriber';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(dbConfig),
    UserModule,
    AuthModule,
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserInterceptor,
    },
    AuditorySuscriber,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
