import { ToolCallBack } from './models/tools.js'

export function textResponse (text: string, structuredContent?: Record<string, any>): ToolCallBack {
  return { content: [ { type: 'text', text } ], structuredContent }
}