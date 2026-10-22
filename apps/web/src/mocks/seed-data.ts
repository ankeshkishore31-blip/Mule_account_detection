import { Alert, Case, FraudRing, RiskTier } from '@mule-platform/shared-types';

const BANKS = [
  { code: 'HDFC', name: 'HDFC Bank', ifscPrefix: 'HDFC000' },
  { code: 'SBIN', name: 'State Bank of India', ifscPrefix: 'SBIN000' },
  { code: 'ICIC', name: 'ICICI Bank', ifscPrefix: 'ICIC000' },
  { code: 'AXIS', name: 'Axis Bank', ifscPrefix: 'UTIB000' },
  { code: 'KKBK', name: 'Kotak Mahindra Bank', ifscPrefix: 'KKBK000' },
  { code: 'PUNB', name: 'Punjab National Bank', ifscPrefix: 'PUNB000' },
];

const UPI_PROVIDERS = ['okaxis', 'okhdfcbank', 'oksbi', 'paytm', 'ybl', 'ibl'];

const FIRST_NAMES = [
  'Aarav', 'Ravi', 'Priya', 'Amit', 'Vikram', 'Suresh', 'Deepak', 'Ananya',
  'Sunil', 'Rajesh', 'Pooja', 'Manoj', 'Kavita', 'Neha', 'Gaurav', 'Arjun',
  'Sneha', 'Mohit', 'Pankaj', 'Karan', 'Rahul', 'Vivek', 'Manish', 'Sanjay'
];

const LAST_NAMES = [
  'Kumar', 'Sharma', 'Patel', 'Singh', 'Nair', 'Verma', 'Gupta', 'Joshi',
  'Reddy', 'Mehta', 'Choudhury', 'Yadav', 'Mishra', 'Bose', 'Das', 'Pandey'
];

const SIGNAL_TEMPLATES: [string, string, string][] = [
  [
    '94% fund outflow within 14 mins of IMPS/UPI credit',
    'Shared device fingerprint across 9 dormant student accounts',
    'Rapid velocity spike: 28 credits followed by immediate ATM cash-out'
  ],
  [
    'Immediate pass-through ratio of 0.98 to unverified mule node',
    'New account opened < 18 days ago with sudden ₹4.8L turnover',
    'Geographic anomaly: login IP in Jamtara, branch in Pune'
  ],
  [
    'Multiple inward UPI tranches matching telegram phishing modus',
    'Beneficiary bank accounts flagged in NCRB cybercrime registry',
    'Dormant account activated after 11 months with zero KYC refresh'
  ],
  [
    'Circular fund routing detected across 4 intermediary bank accounts',
    'Account holder declared income < ₹1.5L/yr; ₹12.4L turnover in 48h',
    'Same IMEISV device token linked to previously frozen syndicate'
  ],
  [
    'Layering pattern: 16 inward IMPS deposits split into 4 equal RTGS transfers',
    'Sim swap detected 36 hours prior to high-volume transaction flurry',
    'Account operated strictly between 01:00 IST and 04:30 IST'
  ],
  [
    'Pass-through ratio 0.96 within 6 minutes of NEFT credit',
    'Device hash shared with known cyber fraud ring in Bharatpur cluster',
    'PAN card linked to 14 different saving accounts across 5 states'
  ]
];

export const FRAUD_RINGS: FraudRing[] = [
  {
    id: 'RING-MH-8812',
    name: 'Mumbai Suburban Mule Syndicate 8812',
    accountCount: 42,
    totalExposedINR: 38450000,
    leadAccountMasked: 'HDFC-XXXX8812',
    deviceFingerprint: 'DEV-F7B2-991A-4C10',
    firstDetected: '2026-09-14T08:30:00Z',
    patternType: 'RAPID_DISPERSAL',
  },
  {
    id: 'RING-JH-4409',
    name: 'Jamtara Cluster — Telegram Part-Time Job Scam',
    accountCount: 68,
    totalExposedINR: 62100000,
    leadAccountMasked: 'SBIN-XXXX4409',
    deviceFingerprint: 'DEV-88CD-11FA-903E',
    firstDetected: '2026-08-02T11:15:00Z',
    patternType: 'DEVICE_FARM',
  },
  {
    id: 'RING-NCR-1903',
    name: 'NCR Crypto P2P Arbitrage Layering Network',
    accountCount: 29,
    totalExposedINR: 24700000,
    leadAccountMasked: 'ICIC-XXXX1903',
    deviceFingerprint: 'DEV-41A8-D882-77BA',
    firstDetected: '2026-10-01T14:45:00Z',
    patternType: 'CIRCULAR_ROUTING',
  },
];

export function generateSeedAlerts(count = 450): Alert[] {
  const alerts: Alert[] = [];
  const now = Date.now();

  for (let i = 1; i <= count; i++) {
    const bank = BANKS[i % BANKS.length];
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const upiProvider = UPI_PROVIDERS[i % UPI_PROVIDERS.length];
    const fourDigit = String(1000 + ((i * 37) % 9000));
    const ifscNum = String(1000 + ((i * 19) % 8999));

    // Risk score distribution: skewed towards high and critical for realistic queue
    let riskScore: number;
    let riskTier: RiskTier;

    if (i % 5 === 0) {
      riskScore = 88 + (i % 12);
      riskTier = 'CRITICAL';
    } else if (i % 3 === 0) {
      riskScore = 72 + (i % 16);
      riskTier = 'HIGH';
    } else if (i % 2 === 0) {
      riskScore = 52 + (i % 19);
      riskTier = 'MEDIUM';
    } else {
      riskScore = 28 + (i % 24);
      riskTier = 'LOW';
    }

    const passThroughRatio = Number((0.72 + (Math.sin(i) * 0.12 + 0.14)).toFixed(2));
    const graphDegree = 3 + ((i * 7) % 29);
    const accountAgeDays = Math.max(3, (i * 13) % 420);
    const amountAtRiskINR = Math.round((45000 + ((i * 23157) % 1850000)) / 100) * 100;
    
    // Recent timestamps within last 48 hours in IST
    const minutesAgo = i * 6 + ((i * 17) % 15);
    const timestamp = new Date(now - minutesAgo * 60 * 1000).toISOString();

    const ring = i % 7 === 0 ? FRAUD_RINGS[i % FRAUD_RINGS.length] : undefined;

    let queueCategory: 'MY_QUEUE' | 'HIGH_RISK' | 'RINGS' | 'NEW_TODAY' = 'MY_QUEUE';
    if (ring) {
      queueCategory = 'RINGS';
    } else if (riskTier === 'CRITICAL' || riskScore >= 75) {
      queueCategory = 'HIGH_RISK';
    } else if (minutesAgo < 1440) {
      queueCategory = 'NEW_TODAY';
    }

    alerts.push({
      id: `ALT-${80000 + i}`,
      accountId: `${bank.code}-XXXX${fourDigit}`,
      accountHolderMasked: `${first.charAt(0)}${'*'.repeat(first.length - 1)} ${last.charAt(0)}${'*'.repeat(last.length - 1)}`,
      bankName: bank.name,
      ifsc: `${bank.ifscPrefix}${ifscNum}`,
      upiHandleMasked: `${first.toLowerCase()}.${last.charAt(0).toLowerCase()}**@${upiProvider}`,
      riskScore,
      riskTier,
      passThroughRatio,
      graphDegree,
      accountAgeDays,
      amountAtRiskINR,
      timestamp,
      ringId: ring?.id,
      status: i % 11 === 0 ? 'INVESTIGATING' : 'NEW',
      queueCategory,
      signals: SIGNAL_TEMPLATES[i % SIGNAL_TEMPLATES.length],
      assignedTo: i % 4 === 0 ? 'ANALYST-104 (Current Session)' : undefined,
      isRestricted: i % 31 === 0,
    });
  }

  return alerts;
}

export function generateSeedCases(alerts: Alert[]): Case[] {
  const cases: Case[] = [];
  const highRiskAlerts = alerts.filter(a => a.riskScore >= 75).slice(0, 32);

  highRiskAlerts.forEach((alt, idx) => {
    const hoursRemaining = Math.max(0.8, 12 - (idx * 0.38));
    const slaDeadline = new Date(Date.now() + hoursRemaining * 3600 * 1000).toISOString();

    cases.push({
      id: `CAS-2026-${1000 + idx}`,
      alertId: alt.id,
      title: `Rapid Mule Layering on ${alt.accountId} (${alt.bankName})`,
      riskScore: alt.riskScore,
      primaryAccount: alt.accountId,
      primaryHolderMasked: alt.accountHolderMasked,
      bankName: alt.bankName,
      ifsc: alt.ifsc,
      slaDeadline,
      status: idx % 6 === 0 ? 'UNDER_REVIEW' : idx % 9 === 0 ? 'STR_SUBMITTED' : 'OPEN',
      assignedAnalyst: 'ANALYST-104 (Current Session)',
      totalExposedINR: alt.amountAtRiskINR,
      summary: `Automated detection triggered by pass-through velocity ${alt.passThroughRatio} with ${alt.graphDegree} counterparty edges in network. ${alt.signals[0]}.`,
      createdAt: alt.timestamp,
    });
  });

  return cases;
}
