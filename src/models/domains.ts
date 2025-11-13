import { z } from 'zod'
import { ContactSchema } from './contacts.js'

/**
 * Input schema for domain registrations.
 */
export const DomainTransferSchema = z.object({
  domainName: z.string().max(255).describe('The domain name to register'),
  quote: z.boolean().default(false).describe('If true, requests a quote for the domain registration'),
  registrant: z.string().describe('Contact handle of the registrant'),
  contacts: z.array(ContactSchema).max(3).default([]).describe('Contacts associated with the domain registration'),
  authcode: z.string().optional(),
  autoRenew: z.boolean().default(false).describe('If true, automatically renews the domain when it expires'),
  privacyProtect: z.boolean().default(false).describe('If true, enables privacy protection for the domain'),
  period: z.number().optional().describe('The period in months for the domain registration'),
  ns: z.array(z.string()).optional().describe('Name servers to use for the domain registration')
}).strict()

export const DomainRegistrationSchema = DomainTransferSchema.extend({
  skipValidation: z.boolean().default(false)
})

export type DomainTransfer = z.infer<typeof DomainTransferSchema>
export type DomainRegistration = z.infer<typeof DomainRegistrationSchema>


