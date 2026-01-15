import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export type TextualResponse = {
  content: { type: 'text', text: string }[],
  structuredContent?: Record<string, any>
}

export type ToolRunnerFn<T> = (args: T, extra: any) => Promise<TextualResponse>
export type ToolRegistryFunction = (server: McpServer) => void
