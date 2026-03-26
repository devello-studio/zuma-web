const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAILS_URL = 'https://api.resend.com/emails';

function sanitize(value, maxLength = 2000) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

async function verifyTurnstile({ token, secret, remoteIp }) {
  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteIp) {
    body.set('remoteip', remoteIp);
  }

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
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM;
  const notificationEmail = process.env.FORM_NOTIFICATION_EMAIL;

  if (!turnstileSecret || !resendApiKey || !resendFrom || !notificationEmail) {
    return res.status(500).json({ ok: false, message: 'Server is not configured' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  const nombre = sanitize(body.nombre, 120);
  const email = sanitize(body.email, 160);
  const empresa = sanitize(body.empresa, 160);
  const telefono = sanitize(body.telefono, 60);
  const servicio = sanitize(body.servicio, 120);
  const mensaje = sanitize(body.mensaje, 4000);
  const turnstileToken = sanitize(body.turnstileToken, 1000);

  if (!nombre || !email || !mensaje || !turnstileToken) {
    return res.status(400).json({ ok: false, message: 'Missing required fields' });
  }

  const ipHeader = req.headers['x-forwarded-for'];
  const remoteIp = Array.isArray(ipHeader)
    ? ipHeader[0]
    : typeof ipHeader === 'string'
      ? ipHeader.split(',')[0]?.trim()
      : undefined;

  const verification = await verifyTurnstile({
    token: turnstileToken,
    secret: turnstileSecret,
    remoteIp,
  });

  if (!verification.success) {
    return res.status(400).json({
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
    return res.status(502).json({ ok: false, message: 'Failed to send email' });
  }

  return res.status(200).json({ ok: true });
}
