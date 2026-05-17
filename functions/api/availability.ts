/// <reference types="@cloudflare/workers-types" />

interface Env {
  AVAILABILITY: KVNamespace;
  AVAILABILITY_WRITE_TOKEN: string;
}

const STATUSES = ['available', 'busy', 'unavailable'] as const;
type Status = (typeof STATUSES)[number];

const isStatus = (v: unknown): v is Status =>
  typeof v === 'string' && (STATUSES as readonly string[]).includes(v);

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });

// GET /api/availability — public read of the current status.
// No value set in KV yet → 'empty' so the UI can show its distinct state.
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const stored = await env.AVAILABILITY.get('status');
  return json({ status: isStatus(stored) ? stored : 'empty' });
};

// POST /api/availability — write a new status. Bearer-token guarded.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (request.headers.get('Authorization') !== `Bearer ${env.AVAILABILITY_WRITE_TOKEN}`) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const status = (body as { status?: unknown } | null)?.status;
  if (!isStatus(status)) {
    return json({ error: 'Invalid status' }, 400);
  }

  await env.AVAILABILITY.put('status', status);
  return json({ ok: true, status });
};
