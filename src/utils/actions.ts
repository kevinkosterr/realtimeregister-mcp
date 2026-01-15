import type { TextualResponse } from '../models/tools.js'
import { replyText } from './generic.js'

export interface PendingAction {
  executor: () => Promise<TextualResponse>
  timestamp: number
}

export type PendingActionEntry = [string, PendingAction] | undefined

/**
 * An in-memory store to keep track of pending actions. Pending actions are actions that require user confirmation before
 * execution. Cancelling the actions will remove them from the store.
 */
const PENDING_ACTIONS = new Map<string, PendingAction>()

/**
 * Get the next pending action in the PENDING_ACTIONS map.
 */
export function getNextPendingAction (): PendingActionEntry {
  return PENDING_ACTIONS.entries().next().value
}

export function createPendingAction (actionName: string, executor: () => Promise<TextualResponse>): void {
  PENDING_ACTIONS.set(actionName, { executor, timestamp: Date.now() })
}

export function hasPendingActions(): boolean {
  return PENDING_ACTIONS.size > 0
}

/**
 * Cancels the next pending action in the store if there is one.
 */
export async function cancelPendingAction(): Promise<any> {
  const action: PendingActionEntry = getNextPendingAction()
  if (!action) return replyText('There is no pending action to cancel.')
  PENDING_ACTIONS.delete(action[0])
  return replyText('Action cancelled.')
}

/**
 * Executes the next pending action in the store if there is one.
 */
export async function executePendingAction (): Promise<any> {
  const action: PendingActionEntry = getNextPendingAction()
  if (!action) return replyText('There is no pending action to execute.')
  return await action[1].executor().then(() => PENDING_ACTIONS.delete(action[0]))
}