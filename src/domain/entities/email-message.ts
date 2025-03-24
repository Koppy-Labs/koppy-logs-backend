export type EmailMessage = {
  to: string[]
  subject: string
  html: string
  replyTo?: string
}
