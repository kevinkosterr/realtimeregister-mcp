import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { useDomainTools } from './domains.js'
import type { ToolRegistryFunction } from '../models/tools.js'

export const initTools = (server: McpServer) => {
  useDomainTools(server) 
/**
 * Initialize all tools for the server.
 * @param server - MCP server instance.
 */
export const initTools: ToolRegistryFunction = (server: McpServer) => {
  useDomainTools(server)
}