import { z } from 'zod'

export const ContactRole = z.enum(['ADMIN', 'TECH', 'BILLING'])

export const ContactSchema = z.object({
  role: ContactRole.describe('The role of the contact'),
  handle: z.string().describe('The handle of the contact'),
}).strict()