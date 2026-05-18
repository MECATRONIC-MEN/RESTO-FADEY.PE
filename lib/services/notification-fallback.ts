import type { AdminNotification, CommercialLeadRecord, DemoRequestRecord } from '@/lib/domain/types';

export function leadToNotification(lead: CommercialLeadRecord): AdminNotification {
  const parts = [
    lead.email,
    lead.phone ? `Tel: ${lead.phone}` : null,
    lead.planInterest ? `Plan: ${lead.planInterest}` : null,
  ].filter(Boolean);

  return {
    id: `lead_fb_${lead.id}`,
    type: 'lead',
    title: `Nueva solicitud: ${lead.businessName || lead.name}`,
    body: parts.join(' · '),
    payload: {
      leadId: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      businessName: lead.businessName,
      planInterest: lead.planInterest,
      fallback: true,
    },
    readAt: null,
    createdAt: lead.createdAt,
  };
}

export function demoToNotification(demo: DemoRequestRecord): AdminNotification {
  const parts = [demo.email, demo.phone ? `Tel: ${demo.phone}` : null].filter(Boolean);

  return {
    id: `demo_fb_${demo.id}`,
    type: 'demo_request',
    title: `Nueva demo: ${demo.businessName}`,
    body: [demo.name, ...parts].join(' · '),
    payload: {
      demoId: demo.id,
      name: demo.name,
      email: demo.email,
      phone: demo.phone,
      businessName: demo.businessName,
      fallback: true,
    },
    readAt: null,
    createdAt: demo.createdAt,
  };
}

export function mergeNotificationsWithFallback(
  fromDb: AdminNotification[],
  leads: CommercialLeadRecord[],
  demos: DemoRequestRecord[]
): AdminNotification[] {
  const byLeadId = new Set(
    fromDb.map((n) => n.payload.leadId).filter((id): id is string => typeof id === 'string')
  );
  const byDemoId = new Set(
    fromDb.map((n) => n.payload.demoId).filter((id): id is string => typeof id === 'string')
  );

  const extra: AdminNotification[] = [
    ...leads.filter((l) => !byLeadId.has(l.id)).map(leadToNotification),
    ...demos.filter((d) => !byDemoId.has(d.id)).map(demoToNotification),
  ];

  return [...fromDb, ...extra]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
