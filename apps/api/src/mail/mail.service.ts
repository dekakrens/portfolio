import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  inquiryId?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend | null = null;
  private readonly fromEmail: string;
  private readonly toEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL || 'Deny Kurniawan <onboarding@resend.dev>';
    this.toEmail = process.env.RESEND_TO_EMAIL || 'dekakrens@gmail.com';

    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log(`📧 MailService initialized with Resend (to: ${this.toEmail})`);
    } else {
      this.logger.warn('⚠️ RESEND_API_KEY not found. Outgoing contact notification emails will be skipped.');
    }
  }

  async sendContactInquiryNotification(payload: ContactNotificationPayload): Promise<boolean> {
    if (!this.resend) {
      this.logger.warn('Skipping email notification: Resend client not configured.');
      return false;
    }

    try {
      const { name, email, subject, message, inquiryId } = payload;
      const formattedDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Jakarta',
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1e293b; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px;">
          <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; color: #0f172a; font-size: 20px; font-weight: 700;">📬 New Contact Inquiry</h2>
            <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">dekakrens.com Portfolio Platform</p>
          </div>

          <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 90px; font-weight: 600;">From:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Email:</td>
                <td style="padding: 6px 0;">
                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-weight: 500;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Subject:</td>
                <td style="padding: 6px 0; color: #0f172a;">${subject}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; font-weight: 600;">Received:</td>
                <td style="padding: 6px 0; color: #64748b;">${formattedDate} WIB</td>
              </tr>
              ${
                inquiryId
                  ? `<tr>
                      <td style="padding: 6px 0; color: #64748b; font-weight: 600;">ID:</td>
                      <td style="padding: 6px 0; color: #94a3b8; font-family: monospace; font-size: 12px;">${inquiryId}</td>
                    </tr>`
                  : ''
              }
            </table>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b;">Message:</h3>
            <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="text-align: center; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <a href="mailto:${email}?subject=${encodeURIComponent('Re: ' + subject)}" style="display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 14px; font-weight: 600;">
              Reply to ${name}
            </a>
            <p style="margin: 12px 0 0; color: #94a3b8; font-size: 12px;">
              You can also reply directly to this email in your email client.
            </p>
          </div>
        </div>
      `;

      const response = await this.resend.emails.send({
        from: this.fromEmail,
        to: [this.toEmail],
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject} - from ${name}`,
        html: htmlContent,
      });

      if (response.error) {
        this.logger.error(`Resend API dispatch failed: ${response.error.message}`, response.error);
        return false;
      }

      this.logger.log(`✅ Contact inquiry email dispatched successfully via Resend (ID: ${response.data?.id})`);
      return true;
    } catch (err: any) {
      this.logger.error(`Failed to dispatch email via Resend: ${err.message}`, err.stack);
      return false;
    }
  }
}
