import type { ReactNode } from 'react';

export function Placeholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h1>{title}</h1>
      <p className="muted">{children}</p>
    </section>
  );
}
