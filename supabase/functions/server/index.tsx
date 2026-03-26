import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { SmtpClient } from "https://deno.land/x/smtp/mod.ts";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

async function sendEmailViaResend(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiry: string;
}) {
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const { firstName, lastName, email, phone, inquiry } = payload;
  const subject = `Contact form submission from ${firstName} ${lastName}`;
  const text = `New contact form request:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${inquiry}`;
  const html = `
    <h2>New contact form submission</h2>
    <p><strong>Name</strong>: ${firstName} ${lastName}</p>
    <p><strong>Email</strong>: ${email}</p>
    <p><strong>Phone</strong>: ${phone || 'N/A'}</p>
    <h3>Message</h3>
    <p>${inquiry.replace(/\n/g, '<br/>')}</p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: 'info@actsto.org',
      to: 'info@actsto.org',
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${response.status} ${body}`);
  }

  return await response.json();
}

// Contact form endpoint
app.post("/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, phone, inquiry } = body;

    if (!firstName || !email || !inquiry) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    try {
      const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.hostinger.com';
      const smtpPort = Number(Deno.env.get('SMTP_PORT') || '465');
      const smtpUser = Deno.env.get('SMTP_USER') || 'info@actsto.org';
      const smtpPass = Deno.env.get('SMTP_PASS');
      const smtpFrom = Deno.env.get('SMTP_FROM') || 'Arizona Christian Tuition <info@actsto.org>';

      if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        throw new Error('SMTP credentials are not fully configured in environment variables');
      }

      const client = new SmtpClient();
      await client.connect({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUser,
        password: smtpPass,
        secure: true,
      });

      const smtpTo = Deno.env.get('SMTP_TO') || 'info@actsto.org';

      const message = {
        from: smtpFrom,
        to: smtpTo,
        subject: `Contact form submission from ${firstName} ${lastName}`,
        content: `New contact form request:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${inquiry}`,
      };
      await client.send(message);
      await client.close();

      return c.json({ success: true, channel: 'smtp' });
    } catch (smtpError) {
      console.warn('SMTP send failed, falling back to Resend.', smtpError);
      await sendEmailViaResend({ firstName, lastName, email, phone, inquiry });
      return c.json({ success: true, channel: 'resend' });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: (error as Error).message || 'Unable to send message' }, 500);
  }
});

Deno.serve(app.fetch);