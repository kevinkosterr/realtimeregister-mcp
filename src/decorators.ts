import { createPendingAction, hasPendingActions } from './utils/actions.js'
import type { ToolRunnerFn, TextualResponse } from './models/tools.js'
import { replyText } from './utils/generic.js'

/**
 * Mark an action as sensitive and require confirmation before executing the callback.
 * Pending actions are stored in the PENDING_ACTIONS store and can be confirmed or canceled.
 * @param actionName - Name of the action.
 * @param callback - Callback function to execute when the action is confirmed.
 */
export function asSensitive <TArgs extends Record<string, any>> (actionName: string, callback: ToolRunnerFn<TArgs>): (args: TArgs, extra: any) => Promise<TextualResponse> {

  return async (args: TArgs, extra: any): Promise<TextualResponse> => {

    // Allow opt-in of skipping the confirmation step.
    if (process.env.SKIP_CONFIRM) {
      return callback(args, extra)
    }

    if (hasPendingActions()) {
      return replyText('An action is still pending. Please confirm or cancel them before executing this action.')
    }

    const executor = () => callback(args, extra)
    createPendingAction(actionName, executor)

    return replyText(
      'This action performs sensitive operations, please confirm your action by typing "confirm action" in the chat window. Type "cancel action" to cancel.')
  }

}