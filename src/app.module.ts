import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { CommonModule } from './common/common.module';
import { SajuAnalysisModule } from './saju-analysis/saju-analysis.module';
import { PrismaService } from './database/prisma/prisma.service';

@Module({
  imports: [ConfigModule, CommonModule, SajuAnalysisModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
