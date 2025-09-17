export enum Severity {
  Critical = 'Critical',
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  Info = 'Info',
}

export interface ReviewSuggestion {
  line: number;
  severity: Severity;
  suggestion: string;
  explanation: string;
}
