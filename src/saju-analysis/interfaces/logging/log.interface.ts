// logging/log.interface.ts

// 로그 레벨 정의
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// 로그 엔트리를 나타내는 인터페이스
export interface ILogEntry {
  // 로그 ID
  id: string;

  // 로그 레벨
  level: LogLevel;

  // 로그 메시지
  message: string;

  // 발생 시간
  timestamp: Date;

  // 로그 컨텍스트
  context: {
    module: string;
    function: string;
    userId?: string;
  };

  // 추가 데이터
  metadata?: Record<string, any>;

  // 관련 에러 정보
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// 로깅 설정을 나타내는 인터페이스
export interface ILoggingSettings {
  // 최소 로그 레벨
  minimumLevel: LogLevel;

  // 로그 저장 설정
  storage: {
    type: 'file' | 'database' | 'cloud';
    path?: string;
    retention: number; // 보관 기간 (일)
  };

  // 필터 설정
  filters: {
    excludePatterns: string[];
    includePatterns: string[];
  };

  // 알림 설정
  alerts: {
    enabled: boolean;
    minimumLevel: LogLevel;
    channels: string[]; // 알림을 보낼 채널
  };
}

// 로그 검색 조건을 나타내는 인터페이스
export interface ILogSearchCriteria {
  // 시작 시간
  startTime?: Date;

  // 종료 시간
  endTime?: Date;

  // 로그 레벨
  levels?: LogLevel[];

  // 모듈명
  modules?: string[];

  // 사용자 ID
  userId?: string;

  // 검색어
  searchText?: string;

  // 정렬 기준
  sortBy?: 'timestamp' | 'level' | 'module';

  // 정렬 방향
  sortDirection?: 'asc' | 'desc';

  // 페이지네이션
  pagination?: {
    page: number;
    limit: number;
  };
}

// 로그 분석 결과를 나타내는 인터페이스
export interface ILogAnalysis {
  // 기간별 로그 수
  timeSeries: {
    period: string;
    count: number;
    byLevel: Record<LogLevel, number>;
  }[];

  // 에러 분석
  errors: {
    mostFrequent: {
      error: string;
      count: number;
      lastOccurrence: Date;
    }[];
    totalCount: number;
    uniqueCount: number;
  };

  // 성능 메트릭
  performance: {
    averageResponseTime: number;
    errorRate: number;
    requestsPerMinute: number;
  };
}

// 로그 관리자 인터페이스
export interface ILogManager {
  // 로그 추가
  log(entry: Omit<ILogEntry, 'id' | 'timestamp'>): void;

  // 로그 검색
  search(criteria: ILogSearchCriteria): Promise<ILogEntry[]>;

  // 로그 분석
  analyze(timeRange: { start: Date; end: Date }): Promise<ILogAnalysis>;

  // 설정 업데이트
  updateSettings(settings: Partial<ILoggingSettings>): void;

  // 로그 정리
  cleanup(olderThan: Date): Promise<number>;

  // 로그 내보내기
  export(criteria: ILogSearchCriteria, format: 'csv' | 'json'): Promise<string>;
}
