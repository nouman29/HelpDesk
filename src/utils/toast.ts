import toast from 'react-hot-toast';
import { ApiError } from '@/services/apiClient';
import { toUserMessage, type ErrorContext } from '@/utils/errorMessages';

function resolveMessage(err: unknown, context: ErrorContext): string {
  if (err instanceof ApiError) {
    return toUserMessage(err.message, context, err.status);
  }
  if (err instanceof Error) {
    return toUserMessage(err.message, context);
  }
  return toUserMessage('', context);
}

/** Show a short error toast (deduped by message text). */
export function showErrorToast(err: unknown, context: ErrorContext = 'general'): void {
  const message = resolveMessage(err, context);
  toast.error(message, { id: `err:${context}:${message}` });
}

/** Client-side validation messages (auth forms). */
export function showValidationToast(message: string): void {
  toast.error(message, { id: `validation:${message}` });
}
