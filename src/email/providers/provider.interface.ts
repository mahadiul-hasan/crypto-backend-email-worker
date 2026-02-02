export interface MailProvider {
  name: string;
  limit: number;

  send(to: string, subject: string, html: string): Promise<void>;
}
