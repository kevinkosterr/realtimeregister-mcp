import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { useDomainTools } from './domains.js'

export const initTools = (server: McpServer) => {
  useDomainTools(server) 
}