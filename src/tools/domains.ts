import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type {
  IDomainCheckResponse,
  IPage,
  IDomain,
  DomainField,
  DomainFilterField,
  ListFilter,
  IQuote,
  IDomainCreateProcessResponse,
  IDomainRegister
} from '@realtimeregister/api'

import { rtr } from '../api.js'
import { replyText } from '../utils/generic.js'
import { mapContacts } from '../utils/domains.js'
import { ListParamsInputSchema } from '../models/listParams.js'
import { DomainRegistration, DomainRegistrationSchema } from '../models/domains.js'
import { asSensitive } from '../decorators.js'
import { TextualResponse, ToolRegistryFunction } from '../models/tools.js'

/**
 * Tools for managing domains via the Realtime Register API.
 * @param server - MCP server instance.
 */
export const useDomainTools: ToolRegistryFunction = (server: McpServer): void => {

  /**
   * List the domains inside your account.
   * @param limit - Maximum number of domains to return, defaults to 10.
   * @param fields - Fields to include in the response, defaults to ['domainName'].
   * @param filters - Filters to apply to the list, defaults to no filters.
   * @param q - Search query to filter domains, undefined by default.
   * @link https://dm.realtimeregister.com/docs/api/domains/list
   */
  server.registerTool('list_domains', {
    title: 'List Domains',
    description: 'List domains within your account',
    inputSchema: ListParamsInputSchema._def.shape(),
    annotations: {
      openWorldHint: true
    }
  }, async ({ limit, fields, filters, q }) => {

    const domainLimit: number = limit || 10
    const domainFields: DomainField[] = (fields as DomainField[]) || [ 'domainName' ]
    const domainFilters: ListFilter<DomainFilterField>[] = (filters as ListFilter<DomainFilterField>[]) || []

    const response: IPage<IDomain> = await rtr.domains.list({
      limit: domainLimit,
      fields: domainFields,
      filters: domainFilters,
      q
    })
    const domains = [ ...response.entities ] as Record<string, any>[]
    return replyText(JSON.stringify(response.entities), { entities: domains })
  })

  /**
   * Get a domain from your account.
   * @param domainName - Domain name to retrieve.
   * @param fields - Fields to include in the response, defaults to all fields.
   * @link https://dm.realtimeregister.com/docs/api/domains/get
   */
  server.registerTool(
    'get_domain',
    {
      title: 'Get Domain',
      description: 'Show domain information by domain name available within your account.',
      inputSchema: DomainGetSchema._def.shape(),
      annotations: {
        openWorldHint: true
      }
    },
    async ({ domainName, fields }): Promise<TextualResponse> => {
      const response = await rtr.domains.get(domainName, fields as (keyof IDomain)[])
      const jsonString = JSON.stringify(response)
      return replyText(jsonString, JSON.parse(jsonString))
    }
  )


  /**
   * Register a new domain.
   * @param domain - Domain name to register.
   * @param registrant - Contact handle of the registrant.
   * @param quote - If true, requests a quote for the domain registration.
   * @link https://dm.realtimeregister.com/docs/api/domains/create
   */
  server.registerTool(
    'register_domain',
    {
      title: 'Register Domain',
      description: 'Checks if a domain name is available and registers it if available',
      inputSchema: DomainRegistrationSchema._def.shape(),
      annotations: {
        openWorldHint: true
      }
    },
    asSensitive<DomainRegistration>(
      'register_domain',
      async (args: DomainRegistration): Promise<TextualResponse> => {
        const domainCheckResponse: IDomainCheckResponse = await rtr.domains.check(args.domainName)
        if (domainCheckResponse.available) {
          const data = {
            ...args,
            contacts: mapContacts(args.registrant, args.contacts)
          } as IDomainRegister

          const response = await rtr.domains.register(data, args.quote)

          if (args.quote) {
            return replyText('Quote requested successfully', { ...response } as IQuote)
          }

          return replyText('Domain registration started successfully', { ...response } as IDomainCreateProcessResponse)
        }

        return replyText(`Sorry, ${args.domainName} is unavailable.`, domainCheckResponse)
      })
  )

}