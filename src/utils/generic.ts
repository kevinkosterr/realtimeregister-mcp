import { TextualResponse } from '../models/tools.js'

/**
 * Create textual reply with optional structured content
 * @param text - Text content of the reply.
 * @param structuredContent - Additional structured content to support the reply.
 */
export function replyText (text: string, structuredContent?: Record<string, any>): TextualResponse {
  return {
    content: [ { type: 'text', text } ],
    structuredContent
  }
}
