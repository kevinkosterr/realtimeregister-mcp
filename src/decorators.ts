import { PENDING_ACTIONS } from './store/index.js'
import type { ToolRunnerFn, ToolCallBack } from './models/tools.js'
import { textResponse } from './helpers.js'

/**
 * Mark an action as sensitive and require confirmation before executing the callback.
 * Pending actions are stored in the PENDING_ACTIONS store and can be confirmed or canceled.
 * @param actionName - Name of the action.
 * @param callback - Callback function to execute when the action is confirmed.
 */
export function asSensitive <TArgs extends Record<string, any>> (actionName: string, callback: ToolRunnerFn<TArgs>): (args: TArgs, extra: any) => Promise<{
  content: { type: 'text', text: string }[],
  structuredContent?: Record<string, any>
}> {

  return async (args: TArgs, extra: any): Promise<ToolCallBack> => {

    // Allow opt-in of skipping the confirmation step.
    if (process.env.SKIP_CONFIRM) {
      return callback(args, extra)
    }

    if (PENDING_ACTIONS.size > 0) {
      return textResponse('An action is still pending. Please confirm or cancel them before executing this action.')
    }

    const executor = () => callback(args, extra)

    // Store the pending action to be confirmed.
    PENDING_ACTIONS.set(actionName, { executor, timestamp: Date.now() })

    return textResponse('This action performs sensitive operations, please confirm your action by typing "confirm action" in the chat window. Type "cancel action" to cancel.')
  }

}