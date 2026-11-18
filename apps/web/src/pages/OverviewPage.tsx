import type { HealthStatus } from '@autoplan/shared';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function OverviewPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => api<HealthStatus>('/health'),
    refetchInterval: 10_000,
  });

  return (
    <section>
      <h1>Overview</h1>
      <div className="cards">
        <div className="card">
          <div className="label">API</div>
          <div className="value">{health.isError ? 'Not reachable' : health.data ? 'Running' : '…'}</div>
        </div>
        <div className="card">
          <div className="label">Database</div>
          <div className="value">
            {health.data ? (health.data.db === 'up' ? 'Connected' : 'Not connected') : '…'}
          </div>
        </div>
      </div>
      <p className="muted">
        Order, stock and plan summaries arrive here in phase 2, once uploads and plan runs are built.
      </p>
    </section>
  );
}
