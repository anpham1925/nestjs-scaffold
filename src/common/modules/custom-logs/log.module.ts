import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from 'src/entities/log/log.entity';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  controllers: [],
  providers: [LogService],
})
export class LogModule {}
