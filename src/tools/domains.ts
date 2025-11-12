import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { rtr } from '../api.js'
import type { IDomainCheckResponse } from '@realtimeregister/api'
import { z } from 'zod'
 
export const useDomainTools = (server: McpServer) => {

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

}