export interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(payload: EmailPayload): Promise<void>;
}
