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

// ── Reusable email sender (SMTP primary, Resend fallback) ─────────────────────
async function sendEmail(params: { to: string; subject: string; text: string; html: string }) {
  const { to, subject, text, html } = params;
  const smtpFrom = Deno.env.get('SMTP_FROM') || 'Arizona Christian Tuition <info@actsto.org>';

  // Try SMTP first
  try {
    const smtpHost = Deno.env.get('SMTP_HOST') || 'smtp.hostinger.com';
    const smtpPort = Number(Deno.env.get('SMTP_PORT') || '465');
    const smtpUser = Deno.env.get('SMTP_USER') || 'info@actsto.org';
    const smtpPass = Deno.env.get('SMTP_PASS');

    if (!smtpPass) throw new Error('SMTP_PASS not configured');

    const client = new SmtpClient();
    await client.connect({ hostname: smtpHost, port: smtpPort, username: smtpUser, password: smtpPass, secure: true });
    await client.send({ from: smtpFrom, to, subject, content: text });
    await client.close();
    return { channel: 'smtp' };
  } catch (smtpErr) {
    console.warn('SMTP failed, falling back to Resend:', smtpErr);
  }

  // Fallback to Resend
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  if (!resendApiKey) throw new Error('Neither SMTP nor Resend is configured');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendApiKey}` },
    body: JSON.stringify({ from: 'info@actsto.org', to, subject, text, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed: ${response.status} ${body}`);
  }

  await response.json();
  return { channel: 'resend' };
}

// ── Contact form endpoint ─────────────────────────────────────────────────────
app.post("/contact", async (c) => {
  try {
    const body = await c.req.json();
    const { firstName, lastName, email, phone, inquiry } = body;

    if (!firstName || !email || !inquiry) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const smtpTo = Deno.env.get('SMTP_TO') || 'info@actsto.org';
    const subject = `Contact form submission from ${firstName} ${lastName}`;
    const text = `New contact form request:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nMessage:\n${inquiry}`;
    const html = `<h2>New contact form submission</h2><p><strong>Name</strong>: ${firstName} ${lastName}</p><p><strong>Email</strong>: ${email}</p><p><strong>Phone</strong>: ${phone || 'N/A'}</p><h3>Message</h3><p>${inquiry.replace(/\n/g, '<br/>')}</p>`;

    const result = await sendEmail({ to: smtpTo, subject, text, html });
    return c.json({ success: true, channel: result.channel });
  } catch (error) {
    console.error('Contact form error:', error);
    return c.json({ error: (error as Error).message || 'Unable to send message' }, 500);
  }
});

// ── Welcome email (sent after registration) ──────────────────────────────────
app.post("/email/welcome", async (c) => {
  try {
    const { firstName, lastName, email, accountType } = await c.req.json();
    if (!email || !firstName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const typeLabel =
      accountType === 'business_donor' ? 'Business Donor'
      : accountType === 'parent' ? 'Parent / Guardian'
      : accountType === 'student' ? 'Student'
      : 'Individual Donor';

    const subject = `Welcome to Arizona Christian Tuition, ${firstName}!`;
    const text = `Hi ${firstName} ${lastName},\n\nWelcome to ACT! Your ${typeLabel} account has been created.\n\nYou can now:\n- Browse scholarship campaigns\n- Make tax-deductible donations\n- Track your Arizona Private School Tax Credits\n\nVisit your dashboard: https://arizonachristiantuition.com/dashboard\n\nThank you for supporting Christian education in Arizona!\n\n— The ACT Team`;
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a2d5a; padding: 24px; text-align: center;">
          <h1 style="color: white; font-family: 'Merriweather', Georgia, serif; margin: 0; font-size: 20px;">Arizona Christian Tuition</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #1a2d5a; font-family: 'Merriweather', Georgia, serif;">Welcome, ${firstName}!</h2>
          <p style="color: #555; line-height: 1.6;">Your <strong>${typeLabel}</strong> account has been created successfully.</p>
          <p style="color: #555; line-height: 1.6;">You can now browse campaigns, make tax-deductible donations, and track your Arizona Private School Tax Credits.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://arizonachristiantuition.com/dashboard" style="display: inline-block; background: #1a2d5a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Go to My Dashboard</a>
          </div>
          <p style="color: #999; font-size: 12px;">Thank you for supporting Christian education in Arizona!</p>
        </div>
      </div>`;

    const result = await sendEmail({ to: email, subject, text, html });
    return c.json({ success: true, channel: result.channel });
  } catch (error) {
    console.error('Welcome email error:', error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

// ── Donation receipt email ────────────────────────────────────────────────────
app.post("/email/donation-receipt", async (c) => {
  try {
    const { firstName, lastName, email, amount, campaignTitle, transactionId, taxCreditAmount, taxYear } = await c.req.json();
    if (!email || !amount || !campaignTitle) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const fmtAmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    const fmtCredit = taxCreditAmount ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(taxCreditAmount) : fmtAmt;
    const name = `${firstName || ''} ${lastName || ''}`.trim() || 'Donor';

    const subject = `Your ACT Donation Receipt — ${fmtAmt} to ${campaignTitle}`;
    const text = `Hi ${name},\n\nThank you for your generous donation!\n\nDonation: ${fmtAmt}\nCampaign: ${campaignTitle}\nTransaction ID: ${transactionId || 'N/A'}\nAZ Tax Credit: ${fmtCredit}\nTax Year: ${taxYear || new Date().getFullYear()}\n\nThis donation qualifies for Arizona's Private School Tax Credit (A.R.S. § 43-1089). Please retain this receipt for your tax records.\n\nACT (Arizona Christian Tuition) is a Certified School Tuition Organization.\nEIN: [Your EIN Here]\n\n— The ACT Team`;
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a2d5a; padding: 24px; text-align: center;">
          <h1 style="color: white; font-family: 'Merriweather', Georgia, serif; margin: 0; font-size: 20px;">Donation Receipt</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #1a2d5a; font-family: 'Merriweather', Georgia, serif;">Thank you, ${name}!</h2>
          <p style="color: #555; line-height: 1.6;">Your donation has been confirmed and processed.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; color: #888; font-size: 13px;">Amount</td><td style="padding: 10px 0; text-align: right; font-weight: 700; color: #c8202d; font-size: 18px;">${fmtAmt}</td></tr>
            <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; color: #888; font-size: 13px;">Campaign</td><td style="padding: 10px 0; text-align: right; color: #333; font-size: 13px;">${campaignTitle}</td></tr>
            ${transactionId ? `<tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; color: #888; font-size: 13px;">Transaction ID</td><td style="padding: 10px 0; text-align: right; color: #333; font-family: monospace; font-size: 12px;">${transactionId}</td></tr>` : ''}
            <tr style="background: #f0fdf4;"><td style="padding: 10px; color: #166534; font-size: 13px; font-weight: 600;">AZ Tax Credit</td><td style="padding: 10px; text-align: right; color: #166534; font-weight: 700; font-size: 16px;">${fmtCredit}</td></tr>
          </table>
          <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="color: #92400e; font-size: 12px; margin: 0; line-height: 1.5;"><strong>Tax Credit Notice:</strong> This donation qualifies for Arizona's Private School Tax Credit (A.R.S. § 43-1089). Attach this receipt to your AZ state tax return to claim a dollar-for-dollar credit.</p>
          </div>
          <p style="color: #999; font-size: 11px;">ACT (Arizona Christian Tuition) is a Certified School Tuition Organization.</p>
        </div>
      </div>`;

    const result = await sendEmail({ to: email, subject, text, html });
    return c.json({ success: true, channel: result.channel });
  } catch (error) {
    console.error('Donation receipt email error:', error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

// ── Parent approval email (when a student registers with parentEmail) ─────────
app.post("/email/parent-approval", async (c) => {
  try {
    const { parentEmail, studentFirstName, studentLastName, studentAge } = await c.req.json();
    if (!parentEmail || !studentFirstName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const studentName = `${studentFirstName} ${studentLastName || ''}`.trim();
    const subject = `ACT: Your child ${studentName} is requesting account approval`;
    const text = `Hello,\n\n${studentName} (age ${studentAge || 'unknown'}) has registered for a student account on Arizona Christian Tuition and listed you as their parent or guardian.\n\nTo approve their account, please log in to your ACT dashboard:\nhttps://arizonachristiantuition.com/dashboard\n\nIf you don't have an account, you can create one at:\nhttps://arizonachristiantuition.com/register/parent\n\nIf you did not expect this request, you can safely ignore this email.\n\n— The ACT Team`;
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a2d5a; padding: 24px; text-align: center;">
          <h1 style="color: white; font-family: 'Merriweather', Georgia, serif; margin: 0; font-size: 20px;">Parental Approval Requested</h1>
        </div>
        <div style="padding: 32px 24px;">
          <h2 style="color: #1a2d5a; font-family: 'Merriweather', Georgia, serif;">Hello!</h2>
          <p style="color: #555; line-height: 1.6;"><strong>${studentName}</strong>${studentAge ? ` (age ${studentAge})` : ''} has registered for a student account on ACT and listed you as their parent or guardian.</p>
          <p style="color: #555; line-height: 1.6;">Students under 16 require parental approval to create scholarship campaigns.</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://arizonachristiantuition.com/dashboard" style="display: inline-block; background: #1a2d5a; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Approve in My Dashboard</a>
          </div>
          <p style="color: #555; line-height: 1.6; font-size: 13px;">Don't have an account? <a href="https://arizonachristiantuition.com/register/parent" style="color: #c8202d;">Create a parent account</a> to manage your child's profile.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">If you did not expect this request, you can safely ignore this email.</p>
        </div>
      </div>`;

    const result = await sendEmail({ to: parentEmail, subject, text, html });
    return c.json({ success: true, channel: result.channel });
  } catch (error) {
    console.error('Parent approval email error:', error);
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Debug catch-all — logs actual path received from Supabase
app.all('*', (c) => c.json({ error: 'no route matched', path: c.req.path, method: c.req.method }, 404));

Deno.serve(app.fetch);