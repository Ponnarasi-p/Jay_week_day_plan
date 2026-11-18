import { useLiveWeek } from '../realtime/RealtimeProvider';

/** Monday of the current week as YYYY-MM-DD (local calendar). */
function currentMonday(): string {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function DayPlanPage() {
  const weekStart = currentMonday();
  const { viewers } = useLiveWeek(weekStart);

  return (
    <section>
      <h1>Day plan</h1>
      <p>
        Week starting <strong>{weekStart}</strong> · viewing now:{' '}
        {viewers.length ? viewers.map((v) => v.name).join(', ') : '—'}
      </p>
      <p className="muted">
        The 12-shift grid (Mon A … Sat B, machine line and machine number wise) with live carry-forward is
        built in phases 4–5. Open this page in two browser windows to see presence update in real time.
      </p>
    </section>
  );
}
