import { describe, it, expect } from 'vitest';
import {
  getVisibleRequests,
  getVisibleComplaints,
  ROLE_CLASSIFICATIONS,
} from '@/lib/rbac';

describe('RBAC visibility tests', () => {
  const requests = [
    { id: 'r1', type: 'warehouse', userId: 'u1', status: 'pending', date: '2026-02-01' },
    { id: 'r2', type: 'trolley', userId: 'u2', status: 'approved', date: '2026-02-02' },
    { id: 'r3', type: 'warehouse', userId: 'u2', status: 'rejected', date: '2026-02-03' },
    { id: 'r4', type: 'trolley', userId: 'u1', status: 'pending', date: '2026-02-04' },
  ];

  const complaints = [
    { id: 'c1', userId: 'u1', status: 'pending', title: 'c1', location: 'A', date: '2026-02-01' },
    { id: 'c2', userId: 'u2', status: 'in_progress', title: 'c2', location: 'B', date: '2026-02-02' },
    { id: 'c3', userId: 'u3', status: 'resolved', title: 'c3', location: 'C', date: '2026-02-03' },
  ];

  it('Maritime Agency (community) should not see warehouse requests and only own complaints', () => {
    const visibleReqs = getVisibleRequests(requests, 'COMMUNITY', 'u1', ROLE_CLASSIFICATIONS.MARITIME_AGENCY);
    expect(visibleReqs.every(r => r.type !== 'warehouse')).toBe(true);
    expect(visibleReqs.every(r => r.userId === 'u1')).toBe(true);

    const visibleComps = getVisibleComplaints(complaints, 'COMMUNITY', 'u1', ROLE_CLASSIFICATIONS.MARITIME_AGENCY);
    expect(visibleComps.length).toBe(1);
    expect(visibleComps[0].userId).toBe('u1');
  });

  it('Shipping Company (community) should not see trolley requests and only own complaints', () => {
    const visibleReqs = getVisibleRequests(requests, 'COMMUNITY', 'u2', ROLE_CLASSIFICATIONS.SHIPPING_COMPANY);
    expect(visibleReqs.every(r => r.type !== 'trolley')).toBe(true);
    expect(visibleReqs.every(r => r.userId === 'u2')).toBe(true);

    const visibleComps = getVisibleComplaints(complaints, 'COMMUNITY', 'u2', ROLE_CLASSIFICATIONS.SHIPPING_COMPANY);
    expect(visibleComps.length).toBe(1);
    expect(visibleComps[0].userId).toBe('u2');
  });

  it('Admin should see all requests and complaints', () => {
    const visibleReqs = getVisibleRequests(requests, 'ADMIN', 'admin');
    expect(visibleReqs.length).toBe(requests.length);

    const visibleComps = getVisibleComplaints(complaints, 'ADMIN', 'admin');
    expect(visibleComps.length).toBe(complaints.length);
  });
});
