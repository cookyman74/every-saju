import { Injectable } from '@nestjs/common';
import { SajuPillar } from '../../interfaces/saju-pillar.interface';
import { InterpretationPattern } from '@prisma/client';
import { InterpretationCondition } from '../../interfaces/interpretation-condition.interface';

// pattern-matching.service.ts
@Injectable()
export class PatternMatchingService {
  async findMatches(sajuPillar: SajuPillar): Promise<InterpretationPattern[]> {
    // 1. 패턴 조건 생성
    const conditions: InterpretationCondition =
      this.createConditions(sajuPillar);

    // 2. 조건 검증
    const validationResult =
      await this.patternConditionValidator.validate(conditions);
    if (!validationResult.isValid) {
      throw new ValidationException(validationResult.errors);
    }

    // 3. 매칭 패턴 검색
    return this.interpretationRepo.findMatchingPatterns(conditions);
  }
}
