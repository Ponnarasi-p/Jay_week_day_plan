/** Small fetch wrapper. In development Vite proxies /api to the Nest server. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const isJson = init.body && !(init.body instanceof FormData);
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { ...(isJson ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = body.message ?? msg;
    } catch {
      /* not JSON */
    }
    throw new Error(Array.isArray(msg) ? msg.join(', ') : String(msg));
  }
  return res.json() as Promise<T>;
}
