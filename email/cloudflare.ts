import type { EmailPayload, EmailProvider } from "./provider";

interface EmailBinding {
  send(message: EmailMessage): Promise<void>;
}

interface EmailMessage {
  to: string;
  from: string;
  raw: string;
}

/**
 * Cloudflare Email Routing provider using the `cloudflare:email` binding
 *
 * This requires the `send_email` binding in wrangler.toml:
 * ```
 * [[send_email]]
 * name = "EMAIL_BINDING"
 * ```
 *
 * The sender email must be verified in Cloudflare Email Routing dashboard:
 * https://dash.cloudflare.com/email/routing/overview
 */
export class CloudflareEmailProvider implements EmailProvider {
  private binding: EmailBinding;
  private senderName: string;

  constructor(binding: EmailBinding, senderName?: string) {
    this.binding = binding;
    this.senderName = senderName || "Website Contact Form";
  }

  async send(payload: EmailPayload): Promise<void> {
    const messageId = `<${crypto.randomUUID()}@contact-form>`;
    const date = new Date().toUTCString();

    // Build MIME message with both plain text and HTML parts
    const raw = [
      `Message-ID: ${messageId}`,
      `Date: ${date}`,
      `To: ${payload.to}`,
      `From: ${this.senderName} <${payload.from}>`,
      ...(payload.replyTo ? [`Reply-To: ${payload.replyTo}`] : []),
      `Subject: ${payload.subject}`,
      "MIME-Version: 1.0",
      'Content-Type: multipart/alternative; boundary="alt-boundary"',
      "",
      "--alt-boundary",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      payload.text,
      "",
      "--alt-boundary",
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: quoted-printable",
      "",
      payload.html || this.textToSimpleHtml(payload.text),
      "",
      "--alt-boundary--",
    ].join("\r\n");

    await this.binding.send({
      to: payload.to,
      from: payload.from,
      raw,
    });
  }

  private textToSimpleHtml(text: string): string {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const withBreaks = escaped.replace(/\n/g, "<br>\n");
    return `<html><body style="font-family: sans-serif; padding: 20px;">${withBreaks}</body></html>`;
  }
}
