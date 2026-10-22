import { http, HttpResponse } from 'msw';
import { generateSeedAlerts, generateSeedCases, FRAUD_RINGS } from './seed-data';
import { Alert, TriagePayload } from '@mule-platform/shared-types';

let mockAlerts: Alert[] = generateSeedAlerts(450);
const mockCases = generateSeedCases(mockAlerts);

export const handlers = [
  // GET Alerts
  http.get('/api/alerts', ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || 'ALL';
    const search = (url.searchParams.get('q') || '').toLowerCase().trim();
    const riskTier = url.searchParams.get('riskTier');
    const simulateError = url.searchParams.get('error') === 'true';

    if (simulateError) {
      return new HttpResponse(
        JSON.stringify({
          message: 'Internal Gateway Timeout: Core Rule Engine node unreachable (HTTP 504)',
          code: 'ERR_RULE_ENGINE_TIMEOUT',
          timestamp: new Date().toISOString(),
          requestId: 'req-88bf-992a',
        }),
        { status: 504, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let filtered = mockAlerts.filter(a => a.status !== 'DISMISSED' && a.status !== 'FROZEN');

    if (category === 'MY_QUEUE') {
      filtered = filtered.filter(a => a.assignedTo !== undefined);
    } else if (category === 'HIGH_RISK') {
      filtered = filtered.filter(a => a.riskScore >= 75 || a.riskTier === 'CRITICAL');
    } else if (category === 'RINGS') {
      filtered = filtered.filter(a => Boolean(a.ringId));
    } else if (category === 'NEW_TODAY') {
      filtered = filtered.filter(a => a.queueCategory === 'NEW_TODAY');
    }

    if (riskTier && riskTier !== 'ALL') {
      filtered = filtered.filter(a => a.riskTier === riskTier);
    }

    if (search) {
      filtered = filtered.filter(a =>
        a.id.toLowerCase().includes(search) ||
        a.accountId.toLowerCase().includes(search) ||
        a.bankName.toLowerCase().includes(search) ||
        a.ifsc.toLowerCase().includes(search) ||
        a.upiHandleMasked.toLowerCase().includes(search)
      );
    }

    const counts = {
      all: mockAlerts.filter(a => a.status !== 'DISMISSED' && a.status !== 'FROZEN').length,
      myQueue: mockAlerts.filter(a => a.assignedTo && a.status !== 'DISMISSED' && a.status !== 'FROZEN').length,
      highRisk: mockAlerts.filter(a => (a.riskScore >= 75 || a.riskTier === 'CRITICAL') && a.status !== 'DISMISSED').length,
      rings: mockAlerts.filter(a => Boolean(a.ringId) && a.status !== 'DISMISSED').length,
      newToday: mockAlerts.filter(a => a.queueCategory === 'NEW_TODAY' && a.status !== 'DISMISSED').length,
    };

    return HttpResponse.json({
      items: filtered,
      total: filtered.length,
      counts,
      lastSynced: new Date().toISOString(),
    });
  }),

  // POST Triage action
  http.post('/api/alerts/triage', async ({ request }) => {
    const payload = (await request.json()) as TriagePayload;
    const { action, alertIds } = payload;

    mockAlerts = mockAlerts.map(a => {
      if (alertIds.includes(a.id)) {
        if (action === 'FREEZE') return { ...a, status: 'FROZEN' as const };
        if (action === 'DISMISS') return { ...a, status: 'DISMISSED' as const };
        if (action === 'ESCALATE') return { ...a, status: 'ESCALATED' as const };
        if (action === 'ASSIGN') return { ...a, assignedTo: payload.analystId };
      }
      return a;
    });

    return HttpResponse.json({
      success: true,
      affectedCount: alertIds.length,
      actionId: `ACT-${Date.now().toString(36).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    });
  }),

  // POST Undo triage action
  http.post('/api/alerts/triage/undo', async ({ request }) => {
    const { alertIds } = (await request.json()) as { alertIds: string[] };

    mockAlerts = mockAlerts.map(a => {
      if (alertIds.includes(a.id)) {
        return { ...a, status: 'NEW' as const };
      }
      return a;
    });

    return HttpResponse.json({ success: true, restoredCount: alertIds.length });
  }),

  // GET Cases
  http.get('/api/cases', () => {
    return HttpResponse.json({
      items: mockCases,
      total: mockCases.length,
    });
  }),

  // GET Single Case
  http.get('/api/cases/:id', ({ params }) => {
    const found = mockCases.find(c => c.id === params.id);
    if (!found) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(found);
  }),

  // GET Fraud Rings
  http.get('/api/rings', () => {
    return HttpResponse.json({
      items: FRAUD_RINGS,
      total: FRAUD_RINGS.length,
    });
  }),

  // POST Audit log for PII reveal
  http.post('/api/audit/pii-reveal', async ({ request }) => {
    const body = (await request.json()) as { field?: string; accountId?: string };
    return HttpResponse.json({
      auditId: `AUDIT-SEC-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'LOGGED_TO_SIEM',
      timestamp: new Date().toISOString(),
      expiresInSeconds: 30,
      field: body?.field || 'full_account',
    });
  }),
];
