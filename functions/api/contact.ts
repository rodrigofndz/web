/// <reference types="@cloudflare/workers-types" />

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

// POST /api/contact — validates the form and relays it as email via Resend.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Honeypot: real users never fill the hidden `company` field. Bots do.
  // Pretend success so the bot sees no signal, but send nothing.
  if (str(body.company) !== '') {
    return json({ ok: true });
  }

  const name = str(body.name);
  const email = str(body.email);
  const message = str(body.message);
  const service = str(body.service);

  if (!name || !email || !message) {
    return json({ error: 'Missing required fields' }, 400);
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000 || service.length > 100) {
    return json({ error: 'Field too long' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Invalid email' }, 400);
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    ...(service ? [`Service: ${service}`] : []),
    '',
    message,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: env.CONTACT_TO,
      reply_to: email,
      subject: `New contact message from ${name}`,
      text,
    }),
  });

  if (!res.ok) {
    console.error('Resend error', res.status, await res.text());
    return json({ error: 'Email delivery failed' }, 502);
  }

  return json({ ok: true });
};
