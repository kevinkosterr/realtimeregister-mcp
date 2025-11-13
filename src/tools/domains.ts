import { z } from 'zod'
import { rtr } from '../api.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type {
  IDomainCheckResponse,
  IPage,
  IDomain,
  DomainField,
  DomainFilterField,
  ListFilter, IQuote, IDomainCreateProcessResponse, IDomainRegister
} from '@realtimeregister/api'
import { ListParamsInputSchema } from '../models/listParams.js'
import { DomainRegistration, DomainRegistrationSchema } from '../models/domains.js'
import { asSensitive } from '../decorators.js'
import {ToolCallBack, ToolRegistryFunction} from '../models/tools.js'
import {textResponse} from '../helpers.js'

export const useDomainTools: ToolRegistryFunction = (server: McpServer): void => {

  /**
   * Check Domain Availability
   * @param domain - Domain name to check.
   */
  server.registerTool('check_domain', {
    title: 'Check Domain Availability',
    description: 'Check if a domain is available for registration',
    inputSchema: {
      domain: z.string().max(255).describe('The domain to check'),
    }
  }, async ({ domain }) => {
    const response: IDomainCheckResponse = await rtr.domains.check(domain)
    return {
      content: [{ type: 'text', text: JSON.stringify(response) }],
      structuredContent: { ...response }
    }
  })

  /**
   * List the domains inside your account.
   * @param limit - Maximum number of domains to return, defaults to 10.
   * @param fields - Fields to include in the response, defaults to ['domainName'].
   * @param filters - Filters to apply to the list, defaults to no filters.
   */
  server.registerTool('list_domains', {
    title: 'List Domains',
    description: 'List domains within your account',
    inputSchema: ListParamsInputSchema
  }, async ({ limit, fields, filters, q }) => {

    const domainLimit: number = limit || 10
    const domainFields: DomainField[] = (fields as DomainField[]) || ['domainName']
    const domainFilters: ListFilter<DomainFilterField>[] = (filters as ListFilter<DomainFilterField>[]) || []

    const response: IPage<IDomain> = await rtr.domains.list({
        limit: domainLimit,
        fields: domainFields,
        filters: domainFilters,
        q
      })
    const domains = [ ...response.entities ] as Record<string, any>[]
    return {
      content: [{ type: 'text', text: JSON.stringify(response.entities) }],
      structuredContent: { entities: domains }
    }
  })


  /**
   * Register a new domain.
   * @param domain - Domain name to register.
   * @param registrant - Contact handle of the registrant.
   * @param quote - If true, requests a quote for the domain registration.
   */
  server.registerTool(
    'register_domain',
    {
      title: 'Register Domain',
      description: 'Register a new domain',
      inputSchema: DomainRegistrationSchema._def.shape(),
    },
    asSensitive<DomainRegistration>(
      'register_domain',
      async (args: DomainRegistration): Promise<ToolCallBack> => {

        const data = {
          ...args,
          contacts: args.contacts.length ? args.contacts : [
            { role: 'ADMIN', handle: args.registrant },
            { role: 'TECH', handle: args.registrant },
            { role: 'BILLING', handle: args.registrant },
          ],
        } as IDomainRegister

        const response = await rtr.domains.register(data, args.quote)

        if (args.quote) {
          return textResponse('Quote requested successfully', { ...response } as IQuote)
        }

        return textResponse('Domain registration started successfully', { ...response } as IDomainCreateProcessResponse)
    })
  )

}