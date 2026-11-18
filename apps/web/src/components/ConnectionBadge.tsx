import { useRealtime } from '../realtime/RealtimeProvider';

export function ConnectionBadge() {
  const { connected } = useRealtime();
  return (
    <span className={`badge ${connected ? 'ok' : 'off'}`} title="Real-time connection to the server">
      {connected ? 'Live' : 'Offline'}
    </span>
  );
}
