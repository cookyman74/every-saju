// cache/cache.interface.ts

import { IAnalysisResult } from '../analysis/analysis-result.interface';

// 캐시 설정을 나타내는 인터페이스
export interface ICacheSettings {
  // TTL (Time To Live) 설정
  ttl: number; // 캐시 유지 시간 (초)

  // 최대 캐시 항목 수
  maxItems: number;

  // 캐시 정책
  policy: {
    // 만료된 항목 처리 방식
    expirationPolicy: 'delete' | 'refresh' | 'keep';

    // 캐시 교체 정책
    replacementPolicy: 'LRU' | 'FIFO' | 'LFU';

    // 캐시 갱신 정책
    refreshPolicy: {
      autoRefresh: boolean; // 자동 갱신 여부
      refreshInterval?: number; // 갱신 주기 (초)
    };
  };

  // 저장소 설정
  storage: {
    type: 'memory' | 'redis' | 'hybrid';
    compression: boolean; // 압축 사용 여부
    encryption: boolean; // 암호화 사용 여부
  };
}

// 캐시된 항목의 메타데이터를 나타내는 인터페이스
export interface ICacheMetadata {
  // 캐시 생성 시간
  createdAt: Date;

  // 마지막 접근 시간
  lastAccessedAt: Date;

  // 접근 횟수
  accessCount: number;

  // 만료 시간
  expiresAt: Date;

  // 캐시 키 생성에 사용된 매개변수
  parameters: Record<string, any>;

  // 신선도 정보
  freshness: {
    isStale: boolean; // 신선도 여부
    staleSince?: Date; // 신선도 상실 시점
    refreshedAt?: Date; // 마지막 갱신 시점
  };
}

// 캐시 작업 결과를 나타내는 인터페이스
export interface ICacheOperationResult {
  // 작업 성공 여부
  success: boolean;

  // 작업 종류
  operation: 'get' | 'set' | 'delete' | 'clear' | 'refresh';

  // 캐시 키
  key: string;

  // 작업 시간
  timestamp: Date;

  // 소요 시간 (밀리초)
  duration: number;

  // 캐시 히트 여부 (get 작업의 경우)
  cacheHit?: boolean;

  // 오류 정보 (실패한 경우)
  error?: {
    code: string;
    message: string;
  };
}

// 캐시 상태 정보를 나타내는 인터페이스
export interface ICacheStatus {
  // 전체 항목 수
  totalItems: number;

  // 메모리 사용량
  memoryUsage: {
    current: number; // 현재 사용량 (bytes)
    limit: number; // 최대 제한 (bytes)
  };

  // 캐시 성능 통계
  statistics: {
    hits: number; // 캐시 히트 수
    misses: number; // 캐시 미스 수
    hitRate: number; // 캐시 히트율 (0-1)
  };

  // 만료된 항목 정보
  expiration: {
    expiredItems: number; // 만료된 항목 수
    nextExpirationAt: Date; // 다음 만료 예정 시간
  };
}

// 캐시 결과를 나타내는 인터페이스
export interface ICacheInfo {
  // 캐시 히트 여부
  cacheHit: boolean;

  // 캐시된 시간
  cachedAt: Date;

  // 만료 시간
  expiresAt: Date;

  // 메타데이터
  metadata: ICacheMetadata;

  // 성능 정보
  performance: {
    retrievalTime: number; // 검색 소요 시간 (ms)
    savingTime?: number; // 저장 소요 시간 (ms)
  };
}

// 캐시 관리자 인터페이스
export interface ICacheManager {
  // 설정 가져오기
  getSettings(): ICacheSettings;

  // 설정 업데이트
  updateSettings(settings: Partial<ICacheSettings>): Promise<void>;

  // 캐시 상태 확인
  getStatus(): ICacheStatus;

  // 캐시 정리
  cleanup(): Promise<void>;

  // 통계 초기화
  resetStatistics(): void;

  // 모니터링 데이터 가져오기
  getMonitoringData(): {
    status: ICacheStatus;
    recentOperations: ICacheOperationResult[];
  };
}
