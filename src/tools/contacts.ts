import type { TextualResponse, ToolRegistryFunction } from '../models/tools.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { rtr } from '../api.js'
import { ListParamsInputSchema } from '../models/listParams.js'
import type { ContactField, ContactFilterField, IContact, IPage, ListFilter } from '@realtimeregister/api'
import { replyText } from '../utils/generic.js'

export const useContactTools: ToolRegistryFunction = (server: McpServer): void => {

  /**
   * Get a contact by handle.
   * @param handle - Handle of the contact to retrieve.
   */
  server.registerTool(
    'get_contact',
    {
      title: 'Get Contact',
      description: 'Show contact information by handle',
      inputSchema: {
        handle: z.string().max(255).describe('The handle of the contact to retrieve')
      },
      annotations: {
        openWorldHint: true
      }
    },
    async ({ handle }) => {
      const response = await rtr.contacts.get(handle)
      return replyText(JSON.stringify(response), { ...response })
    }
  )

  /**
   * List contacts in your account.
   * @param limit - Maximum number of domains to return, defaults to 10.
   * @param fields - Fields to include in the response.
   * @param filters - Filters to apply to the list, defaults to no filters.
   * @param q - Search query to filter domains, undefined by default.
   */
  server.registerTool(
    'list_contacts',
    {
      title: 'List Contacts',
      description: 'List contacts in your account',
      inputSchema: ListParamsInputSchema._def.shape(),
      annotations: {
        openWorldHint: true
      }
    },
    async ({ limit, q, filters, fields }): Promise<TextualResponse> => {

      const contactLimit: number = limit || 10
      const contactFields: ContactField[] = (fields as ContactField[]) || []
      const contactFilters: ListFilter<ContactFilterField>[] = (filters as ListFilter<ContactFilterField>[]) || []

      const response: IPage<IContact> = await rtr.contacts.list({
        limit: contactLimit,
        fields: contactFields,
        filters: contactFilters,
        q
      })
      const contacts = [ ...response.entities ] as IContact[]
      return replyText(JSON.stringify(response.entities), { entities: contacts })
    }
  )


}