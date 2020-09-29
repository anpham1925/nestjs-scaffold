import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogModule } from './common/modules/custom-logs/log.module';
import { LanguageModule } from './common/modules/languagues/language.module';
import { PasswordHelper } from './common/helpers/password.helper';
import { TokenHelper } from './common/helpers/token.helper';
import { Log } from './entities/log/log.entity';

const env = process.env.NODE_ENV || 'development';

const envFilePath =
  env === 'development' ? '.env' : `.env${process.env.NODE_ENV}`;

const entities = [
  Log,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_ROOT_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: entities,
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    LanguageModule,
    LogModule,
    PasswordHelper,
    TokenHelper
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
