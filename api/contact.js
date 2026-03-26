import { buffer as readStreamBuffer } from 'node:stream/consumers';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

/** Plain Node `http` has no `res.status().json()`; Vercel adds helpers. Use this everywhere. */
function json(res, status, data) {
  res.statusCode = status;
  if (!res.getHeader('Content-Type')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
  }
  res.end(JSON.stringify(data));
}

/**
 * Vercel may leave the body on the stream, set req.body to {}, or parse JSON.
 * Prefer a non-empty parsed object; otherwise read the full stream once.
 */
async function readJsonBody(req) {
  if (req.body != null && typeof req.body === 'object' && !Buffer.isBuffer(req.body) && !Array.isArray(req.body)) {
    const keys = Object.keys(req.body);
    if (keys.length > 0) return req.body;
  }
  if (typeof req.body === 'string' && req.body.length > 0) {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    try {
      return JSON.parse(req.body.toString('utf8'));
    } catch {
      return {};
    }
  }
  try {
    const raw = await readStreamBuffer(req);
    const s = raw.toString('utf8');
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
}

function sanitize(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

async function verifyTurnstile({ token, secret }) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!response.ok) {
    return { success: false, reason: 'verification_request_failed' };
  }

  const result = await response.json();
  return {
    success: Boolean(result?.success),
    reason: result?.['error-codes']?.join(',') || undefined,
  };
}

async function sendWithResend({ apiKey, from, to, subject, text, replyTo }) {
  const response = await fetch(RESEND_EMAILS_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: replyTo || undefined,
    }),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'resend_send_failed';
    return { success: false, message };
  }

  return { success: true };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, message: 'Method not allowed' });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  const notificationEmail = process.env.FORM_NOTIFICATION_EMAIL;

  if (!turnstileSecret || !resendApiKey || !resendFrom || !notificationEmail) {
    return json(res, 500, { ok: false, message: 'Server is not configured' });
  }

  const body = await readJsonBody(req);

  const nombre = sanitize(body.nombre, 120);
  const email = sanitize(body.email, 160);
  const empresa = sanitize(body.empresa, 160);
  const telefono = sanitize(body.telefono, 60);
  const servicio = sanitize(body.servicio, 120);
  const mensaje = sanitize(body.mensaje, 4000);
  // Response tokens are often 1–3k+ chars; truncating breaks siteverify (invalid-input-response).
  const turnstileToken = sanitize(body.turnstileToken, 32768);

  if (!nombre || !email || !mensaje || !turnstileToken) {
    return json(res, 400, { ok: false, message: 'Missing required fields' });
  }

  const verification = await verifyTurnstile({
    token: turnstileToken,
    secret: turnstileSecret,
  });

  if (!verification.success) {
    return json(res, 400, {
      ok: false,
      message: 'Captcha verification failed',
      code: verification.reason,
    });
  }

  const subject = `[Zuma Contact] ${nombre}${servicio ? ` - ${servicio}` : ''}`;
  const text = [
    'New contact submission',
    '',
    `Name: ${nombre}`,
    `Email: ${email}`,
    `Company: ${empresa || 'N/A'}`,
    `Phone: ${telefono || 'N/A'}`,
    `Service: ${servicio || 'N/A'}`,
    '',
    'Message:',
    mensaje,
    '',
    `Submitted at: ${new Date().toISOString()}`,
  ].join('\n');

  const sent = await sendWithResend({
    apiKey: resendApiKey,
    from: resendFrom,
    to: notificationEmail,
    subject,
    text,
    replyTo: email,
  });

  if (!sent.success) {
    return json(res, 502, {
      ok: false,
      message: sent.message || 'Failed to send email',
    });
  }

  return json(res, 200, { ok: true });
}
