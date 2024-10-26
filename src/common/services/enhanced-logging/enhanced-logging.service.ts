import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnhancedLoggingService implements LoggerService {
  constructor(private readonly configService: ConfigService) {}

  log(message: string, context?: string) {
    console.log(`[${context || 'LOG'}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    console.error(`[${context || 'ERROR'}] ${message}`, trace);
  }

  warn(message: string, context?: string) {
    console.warn(`[${context || 'WARN'}] ${message}`);
  }

  debug(message: string, context?: string) {
    if (this.configService.get('server.nodeEnv') === 'development') {
      console.debug(`[${context || 'DEBUG'}] ${message}`);
    }
  }

  verbose(message: string, context?: string) {
    if (this.configService.get('server.nodeEnv') === 'development') {
      console.log(`[${context || 'VERBOSE'}] ${message}`);
    }
  }
}
