/**
 * POST /api/contact
 *
 * Cloudflare Pages Function that handles contact form submissions.
 *
 * Required environment variables (set in Cloudflare Dashboard):
 *   TURNSTILE_SECRET_KEY — Cloudflare Turnstile secret key
 *   CONTACT_TO_EMAIL — email address to receive leads
 *   CONTACT_FROM_EMAIL — verified sender email (must be verified in Cloudflare Email Routing)
 *
 * Required binding (set in wrangler.toml):
 *   EMAIL_BINDING — SendEmail binding for cloudflare:email
 *
 * Optional environment variables:
 *   ALLOWED_ORIGIN — restrict CORS to a specific origin in production
 *   TURNSTILE_SITE_KEY — used by the frontend (public)
 */

import { z } from "zod";
import type { PagesFunction } from "@cloudflare/workers-types";

// --- Types ---

interface Env {
  TURNSTILE_SECRET_KEY?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_FROM_EMAIL?: string;
  ALLOWED_ORIGIN?: string;
  EMAIL_BINDING?: SendEmail;
}

interface SendEmail {
  send(message: EmailMessage): Promise<void>;
}

interface EmailMessage {
  to: string;
  from: string;
  raw: string;
}

// --- Zod Validation Schema ---

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-().+]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  service: z.string().optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
  preferredContact: z.enum(["email", "phone"]).optional(),
  city: z.string().optional().or(z.literal("")),
  website: z.string().max(0, "Invalid submission").optional(),
  turnstileToken: z.string().min(1, "Security verification failed"),
  _timestamp: z.number().optional(),
});

type ContactPayload = z.infer<typeof contactSchema>;

// --- CORS Headers ---

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Headers": "Content-Type",
};

function getCorsHeaders(env: Env): Record<string, string> {
  const origin = env.ALLOWED_ORIGIN;
  if (origin) {
    return { ...corsHeaders, "Access-Control-Allow-Origin": origin };
  }
  return corsHeaders;
}

// --- Turnstile Verification ---

async function verifyTurnstileToken(
  token: string,
  secret: string,
  ip?: string,
): Promise<boolean> {
  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);

  if (ip) {
    formData.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    console.error("Turnstile verify HTTP error:", response.status);
    return false;
  }

  const result: any = await response.json();
  return Boolean(result.success);
}

// --- Email Sending ---

function buildEmailContent(payload: ContactPayload, ip: string | null): {
  subject: string;
  text: string;
  html: string;
} {
  const timestamp = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  });

  const subject = `New Website Lead from ${payload.name}`;

  const field = (label: string, value: string | undefined) =>
    value ? `${label}: ${value}` : "";

  const textParts = [
    `New contact form submission received.`,
    "",
    field("Name", payload.name),
    field("Email", payload.email),
    field("Phone", payload.phone),
    field("Service Needed", payload.service),
    field("Preferred Contact", payload.preferredContact),
    field("City / ZIP", payload.city),
    "",
    "Message:",
    payload.message,
    "",
    "---",
    `Submitted: ${timestamp}`,
    ip ? `IP: ${ip}` : "",
  ];

  const text = textParts.filter(Boolean).join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 20px; color: #333; }
    .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 20px; }
    .body { padding: 20px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 12px; }
    .field-label { font-weight: 600; font-size: 12px; color: #6b7280; text-transform: uppercase; }
    .field-value { margin-top: 2px; }
    .message { background: #f9fafb; padding: 12px; border-radius: 6px; margin-top: 16px; white-space: pre-wrap; }
    .footer { margin-top: 16px; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="header"><h1>New Website Lead</h1></div>
  <div class="body">
    ${buildField("Name", payload.name)}
    ${buildField("Email", payload.email, `mailto:${payload.email}`)}
    ${buildField("Phone", payload.phone)}
    ${buildField("Service Needed", payload.service)}
    ${buildField("Preferred Contact", payload.preferredContact)}
    ${buildField("City / ZIP", payload.city)}
    <div class="field-label">Message</div>
    <div class="message">${escapeHtml(payload.message)}</div>
    <div class="footer">Submitted: ${timestamp}<br>${ip ? `IP: ${ip}` : ""}</div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

function buildField(label: string, value: string | undefined, href?: string): string {
  if (!value) return "";
  const val = href
    ? `<a href="${escapeHtml(href)}">${escapeHtml(value)}</a>`
    : escapeHtml(value);
  return `<div class="field"><div class="field-label">${escapeHtml(label)}</div><div class="field-value">${val}</div></div>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(
  env: Env,
  payload: ContactPayload,
  ip: string | null,
): Promise<void> {
  if (!env.EMAIL_BINDING) {
    throw new Error("EMAIL_BINDING not configured");
  }

  const toEmail = env.CONTACT_TO_EMAIL;
  const fromEmail = env.CONTACT_FROM_EMAIL;

  if (!toEmail || !fromEmail) {
    throw new Error("CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL must be set");
  }

  const { subject, text, html } = buildEmailContent(payload, ip);

  const messageId = `<${crypto.randomUUID()}@contact-form>`;
  const date = new Date().toUTCString();

  const raw = [
    `Message-ID: ${messageId}`,
    `Date: ${date}`,
    `To: ${toEmail}`,
    `From: Website Contact Form <${fromEmail}>`,
    `Reply-To: ${payload.name} <${payload.email}>`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: multipart/alternative; boundary="alt-boundary"',
    "",
    "--alt-boundary",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    text,
    "",
    "--alt-boundary",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: quoted-printable",
    "",
    html,
    "",
    "--alt-boundary--",
  ].join("\r\n");

  await env.EMAIL_BINDING.send({
    to: toEmail,
    from: fromEmail,
    raw,
  });
}

// --- Simple IP-based Rate Limiter ---

interface RateLimitStore {
  get(key: string): Promise<{ value: number } | null>;
  put(key: string, value: number, expirationTtl?: number): Promise<void>;
}

const IP_RATE_LIMIT = 10; // max requests per window
const IP_RATE_WINDOW = 300; // 5 minutes in seconds

async function checkRateLimit(
  request: Request,
  env: Env,
): Promise<{ allowed: boolean; retryAfter?: number }> {
  // In-memory fallback — for production, use KV or durable objects
  // Since Cloudflare Pages Functions don't have native in-memory store across invocations,
  // this is a basic per-execution check. For production, add KV binding.

  // For now, use a simple approach: check the CF-Connecting-IP header
  // and track in a global variable (limited effectiveness in serverless)
  return { allowed: true };
}

// --- Main Handler ---

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: getCorsHeaders(env),
    });
  }

  // Only accept POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ success: false, message: "Method not allowed" }), {
      status: 405,
      headers: {
        ...getCorsHeaders(env),
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Parse body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid JSON body" }),
        {
          status: 400,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Check honeypot (website field should be empty)
    if (body.website && typeof body.website === "string" && body.website.length > 0) {
      // Silently accept as success to not tip off bots
      console.log("Honeypot triggered — rejecting silently");
      return new Response(
        JSON.stringify({ success: true, message: "Thanks for reaching out!" }),
        {
          status: 200,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Check for suspiciously fast submission (< 3 seconds)
    if (body._timestamp && typeof body._timestamp === "number") {
      const elapsed = Date.now() - body._timestamp;
      if (elapsed < 3000) {
        console.log("Suspiciously fast submission rejected:", elapsed, "ms");
        return new Response(
          JSON.stringify({ success: true, message: "Thanks for reaching out!" }),
          {
            status: 200,
            headers: {
              ...getCorsHeaders(env),
              "Content-Type": "application/json",
            },
          },
        );
      }
    }

    // Validate with Zod
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: "Please fix the errors below.",
          errors,
        }),
        {
          status: 400,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    const payload = result.data;

    // Verify Turnstile token
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error("TURNSTILE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          message: "Server configuration error. Please contact us directly.",
        }),
        {
          status: 500,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Get visitor IP from Cloudflare headers
    const visitorIP =
      request.headers.get("CF-Connecting-IP") ||
      request.headers.get("X-Forwarded-For") ||
      null;

    const turnstileValid = await verifyTurnstileToken(
      payload.turnstileToken,
      turnstileSecret,
      visitorIP || undefined,
    );

    if (!turnstileValid) {
      console.warn("Turnstile verification failed for:", payload.email);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Security verification failed. Please try again.",
        }),
        {
          status: 403,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Send email
    try {
      await sendEmail(env, payload, visitorIP);
      console.log("Lead email sent successfully from:", payload.email);
    } catch (emailErr: any) {
      console.error("Failed to send email:", emailErr);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send your message. Please try again or call us directly.",
        }),
        {
          status: 500,
          headers: {
            ...getCorsHeaders(env),
            "Content-Type": "application/json",
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thanks for reaching out! We'll get back to you within 24 hours.",
      }),
      {
        status: 200,
        headers: {
          ...getCorsHeaders(env),
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err: any) {
    console.error("Unhandled error in /api/contact:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      }),
      {
        status: 500,
        headers: {
          ...getCorsHeaders(env),
          "Content-Type": "application/json",
        },
      },
    );
  }
};
