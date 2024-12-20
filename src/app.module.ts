import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import * as path from 'path';
import * as config from 'config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {
  CookieResolver,
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver
} from 'nestjs-i18n';
// import { WinstonModule } from 'nest-winston';

import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/role/roles.module';
import { PermissionsModule } from 'src/permission/permissions.module';
import * as ormConfig from 'src/config/ormconfig';
import * as throttleConfig from 'src/config/throttle-config';
import { MailModule } from 'src/mail/mail.module';
import { EmailTemplateModule } from 'src/email-template/email-template.module';
import { RefreshTokenModule } from 'src/refresh-token/refresh-token.module';
import { I18nExceptionFilterPipe } from 'src/common/pipes/i18n-exception-filter.pipe';
import { CustomValidationPipe } from 'src/common/pipes/custom-validation.pipe';
import { TwofaModule } from 'src/twofa/twofa.module';
import { CustomThrottlerGuard } from 'src/common/guard/custom-throttle.guard';
import { DashboardModule } from 'src/dashboard/dashboard.module';
import { AppController } from 'src/app.controller';
import { TechnicianTeamsModule } from './technician-teams/technician-teams.module';
import { OrdersModule } from './orders/orders.module';
import { AuditLogModule } from './audit/auditLog.module';
// import winstonConfig from 'src/config/winston';
import { AuditLogMiddleware } from './audit/audit-log.middleware';
import { BullModule } from '@nestjs/bull';
import { ServicesModule } from './services/services.module';

const appConfig = config.get('app');
const queueConfig = config.get('queue');

@Module({
  imports: [
    // The module that injects the queue needs to import the queue registration. don't put the queue regsitration in the audit module because it is not used there (check the mail module, contrast case)
    // https://stackoverflow.com/questions/66494091/cant-resolve-dependency-when-try-to-inject-a-bull-queue-in-nestjs
    BullModule.registerQueue({
      name: config.get('audit.queueName'),
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST || queueConfig.host,
          port: process.env.REDIS_PORT || queueConfig.port,
          retryStrategy(times) {
            return Math.min(times * 50, 2000);
          }
        }
      })
    }),
    // WinstonModule.forRoot(winstonConfig),
    ThrottlerModule.forRootAsync({
      useFactory: () => throttleConfig
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ormConfig
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: appConfig.fallbackLanguage,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true
        }
      }),
      parser: I18nJsonParser,
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang', 'locale', 'l']
        },
        new HeaderResolver(['x-custom-lang']),
        new CookieResolver(['lang', 'locale', 'l'])
      ]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*']
    }),
    AuthModule,
    RolesModule,
    PermissionsModule,
    MailModule,
    EmailTemplateModule,
    RefreshTokenModule,
    TwofaModule,
    DashboardModule,
    TechnicianTeamsModule,
    OrdersModule,
    AuditLogModule,
    ServicesModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: I18nExceptionFilterPipe
    // }
  ],
  controllers: [AppController]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuditLogMiddleware)
      .exclude({ path: '*', method: RequestMethod.GET }) // Exclude GET requests
      .forRoutes('*'); // Apply to all other routes
  }
}
