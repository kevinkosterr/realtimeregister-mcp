import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { useDomainTools } from './domains.js'
import { useGenericTools } from './generic.js'
import type { ToolRegistryFunction } from '../models/tools.js'

/**
 * Initialize all tools for the server.
 * @param server - MCP server instance.
 */
export const initTools: ToolRegistryFunction = (server: McpServer) => {
  useGenericTools(server)
  useDomainTools(server)
}