import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'

export interface ToolCallBack {
  content: { type: 'text', text: string }[],
  structuredContent?: Record<string, any>
}

export type ToolRunnerFn<T> = (args: T, extra: any) => Promise<ToolCallBack>
export type ToolRegistryFunction = (server: McpServer) => void
