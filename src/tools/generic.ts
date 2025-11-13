import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { cancelPendingAction, executePendingAction } from '../store/index.js'
import type { ToolRegistryFunction } from '../models/tools.js'

export const useGenericTools: ToolRegistryFunction = (server: McpServer) => {

  /**
   * Confirm a pending action.
   */
  server.registerTool(
    'confirm_pending_action',
    {
      title: 'Confirm Pending Action',
      description: 'Confirm a pending action'
    },
    async () => await executePendingAction()
  )

  /**
   * Cancel a pending action.
   */
  server.registerTool(
    'cancel_pending_action',
    {
      title: 'Cancel Pending Action',
      description: 'Cancel a pending action'
    },
    async () => await cancelPendingAction()
  )

}