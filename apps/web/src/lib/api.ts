import {
  AlertsResponse,
  Case,
  FraudRing,
  PiiRevealRequest,
  PiiRevealResponse,
  QueueFilter,
  RiskTier,
  TriagePayload,
  TriageResponse,
} from '@mule-platform/shared-types';

export interface FetchAlertsParams {
  category?: QueueFilter;
  search?: string;
  riskTier?: RiskTier | 'ALL';
  simulateError?: boolean;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public technicalDetails?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData: { message?: string; code?: string; requestId?: string } | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Non-JSON error body
    }

    const message = errorData?.message || `Request failed with HTTP status ${response.status}`;
    const tech = errorData ? JSON.stringify(errorData, null, 2) : `HTTP ${response.status} ${response.statusText}`;
    throw new ApiError(response.status, message, tech);
  }

  return response.json();
}

export const api = {
  getAlerts: async (params?: FetchAlertsParams): Promise<AlertsResponse> => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'ALL') {
      query.set('category', params.category);
    }
    if (params?.search) {
      query.set('q', params.search);
    }
    if (params?.riskTier && params.riskTier !== 'ALL') {
      query.set('riskTier', params.riskTier);
    }
    if (params?.simulateError) {
      query.set('error', 'true');
    }

    const qs = query.toString();
    const endpoint = `/api/alerts${qs ? `?${qs}` : ''}`;
    return request<AlertsResponse>(endpoint);
  },

  triageAlerts: async (payload: TriagePayload): Promise<TriageResponse> => {
    return request<TriageResponse>('/api/alerts/triage', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  undoTriage: async (alertIds: string[]): Promise<{ success: boolean; restoredCount: number }> => {
    return request<{ success: boolean; restoredCount: number }>('/api/alerts/triage/undo', {
      method: 'POST',
      body: JSON.stringify({ alertIds }),
    });
  },

  getCases: async (): Promise<{ items: Case[]; total: number }> => {
    return request<{ items: Case[]; total: number }>('/api/cases');
  },

  getCaseById: async (id: string): Promise<Case> => {
    return request<Case>(`/api/cases/${encodeURIComponent(id)}`);
  },

  getFraudRings: async (): Promise<{ items: FraudRing[]; total: number }> => {
    return request<{ items: FraudRing[]; total: number }>('/api/rings');
  },

  requestPiiReveal: async (req: PiiRevealRequest): Promise<PiiRevealResponse> => {
    return request<PiiRevealResponse>('/api/audit/pii-reveal', {
      method: 'POST',
      body: JSON.stringify(req),
    });
  },
};
