import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ConfigModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
