import { type DomainRegistration } from '../models/domains.js'

/**
 * Map contacts for domain operations like registrations and transfers.
 * If no contacts are supplied, it will return the registrant as every type of contact.
 * @param registrant - Registrant of the domain.
 * @param contacts - Optional array of contacts.
 */
export function mapContacts (registrant: string, contacts?: DomainRegistration['contacts']) {
  if (contacts && contacts.length) return contacts
  return [
    { role: 'ADMIN', handle: registrant },
    { role: 'TECH', handle: registrant },
    { role: 'BILLING', handle: registrant }
  ]
}
