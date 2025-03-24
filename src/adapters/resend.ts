import { Resend } from 'resend'

import type { EmailMessage } from '@/domain/entities/email-message'
import { env } from '@/env'
import type { EmailService } from '@/ports/email-service'

const resend = new Resend(env.services.RESEND_API_KEY)

async function sendEmail(emailMessage: EmailMessage, type: string) {
  const safeType = type.replace(/[^a-zA-Z0-9-]/g, '')

  try {
    await resend.emails.send({
      from: `Koppy Logs <hello@${safeType}.logs.koppy.app>`,
      to: emailMessage.to,
      subject: emailMessage.subject,
      html: emailMessage.html,
      replyTo: emailMessage.replyTo ?? 'support@logs.koppy.app',
    })
  } catch (err) {
    console.error(`Failed to send ${safeType} email:`, err)

    throw new Error(`Failed to send email: ${err.message || 'Unknown error'}`)
  }
}

const ResendAdapter: EmailService = {
  sendEmail: (emailMessage, type) => sendEmail(emailMessage, type),
}

export { ResendAdapter }
