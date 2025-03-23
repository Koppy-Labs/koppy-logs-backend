import { Resend } from 'resend'

import type { EmailMessage } from '@/domain/entities/email-message'
import { env } from '@/env'
import type { EmailService } from '@/ports/email-service'

const resend = new Resend(env.services.RESEND_API_KEY)

async function sendEmail(emailMessage: EmailMessage, type: string) {
  await resend.emails.send({
    from: `Koppy Logs <hello@${type}.logs.koppy.app>`,
    to: emailMessage.to,
    subject: emailMessage.subject,
    html: emailMessage.html,
    replyTo: emailMessage.replyTo ?? 'support@logs.koppy.app',
  })
}

const ResendAdapter: EmailService = {
  sendEmail: (emailMessage, type) => sendEmail(emailMessage, type),
}

export { ResendAdapter }
