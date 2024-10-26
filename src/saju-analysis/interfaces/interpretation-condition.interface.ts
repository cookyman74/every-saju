export interface InterpretationCondition {
  type: string;
  value: any;
  required: boolean;
  validationRules?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: any) => boolean;
  };
}
