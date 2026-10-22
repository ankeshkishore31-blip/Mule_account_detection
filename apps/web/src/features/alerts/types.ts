import { Alert, QueueFilter, RiskTier } from '@mule-platform/shared-types';

export interface AlertFilterState {
  category: QueueFilter;
  search: string;
  riskTier: RiskTier | 'ALL';
}

export interface PeekData {
  alert: Alert;
  rect: DOMRect;
}
