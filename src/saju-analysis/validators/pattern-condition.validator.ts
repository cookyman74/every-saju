import { Injectable } from '@nestjs/common';
import { InterpretationCondition } from '../interfaces/interpretation-condition.interface';

@Injectable()
export class PatternConditionValidator {
  validate(condition: InterpretationCondition): ValidationResult {
    return {
      isValid:
        this.validateConditionType(condition) &&
        this.validateConditionValue(condition),
      errors: this.collectErrors(condition),
    };
  }

  private validateConditionType(condition: InterpretationCondition) {}

  private validateConditionValue(condition: InterpretationCondition) {
    return false;
  }

  private collectErrors(condition: InterpretationCondition) {}
}
