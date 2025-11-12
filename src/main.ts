import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { initTools } from './tools/index.js'
import server from './server.js'

async function main(): Promise<void> {
  const transport = new StdioServerTransport()
  initTools(server)
  await server.connect(transport)
}

main().catch((error): void => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})