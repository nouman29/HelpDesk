export type ErrorContext = 'auth' | 'chat' | 'general';

const QUOTA_PATTERNS = [
  'quota',
  'rate limit',
  'rate_limit',
  'resource_exhausted',
  'resource exhausted',
  'too many requests',
  '429',
  'billing',
  'exceeded your',
];

export function isQuotaError(message: string, status?: number): boolean {
  if (status === 429) return true;
  const lower = message.toLowerCase();
  return QUOTA_PATTERNS.some((p) => lower.includes(p));
}

export function toUserMessage(
  raw: string,
  context: ErrorContext = 'general',
  status?: number,
): string {
  const msg = raw.trim();
  const lower = msg.toLowerCase();

  if (isQuotaError(msg, status)) {
    return 'AI usage limit reached. Try again in a few minutes.';
  }

  if (lower.includes('cannot reach server') || lower.includes('network')) {
    return 'Cannot reach the server. Check your connection.';
  }

  if (context === 'auth' || context === 'general') {
    if (lower.includes('invalid email or password')) {
      return 'Wrong email or password.';
    }
    if (lower.includes('email already registered')) {
      return 'This email is already in use.';
    }
    if (lower.includes('password and confirm password do not match')) {
      return "Passwords don't match.";
    }
    if (lower.includes('password must be at least')) {
      return 'Password must be at least 6 characters.';
    }
    if (lower.includes('name should only contain')) {
      return 'Name can only contain letters and spaces.';
    }
    if (lower.includes('email:') && lower.includes('valid')) {
      return 'Enter a valid email address.';
    }
  }

  if (context === 'chat') {
    if (lower.includes('invalid token') || lower.includes('not logged in')) {
      return 'Session expired. Please sign in again.';
    }
    if (lower.includes('chat not found') || lower.includes('access denied')) {
      return 'Chat not found or access denied.';
    }
    if (lower.includes('missing chat id')) {
      return 'Chat session lost. Start a new journey.';
    }
    if (lower.includes('no initial questions')) {
      return 'Could not load starter questions.';
    }
    if (lower.includes('gemini_api_key')) {
      return 'AI service is temporarily unavailable.';
    }
    if (lower.includes('invalid json from ai') || lower.includes('invalid format')) {
      return 'AI response was invalid. Please try again.';
    }
    if (lower.includes('no questions exist')) {
      return 'This chat has no questions to answer.';
    }
    if (lower.includes('missing answer')) {
      return 'Please answer the current question first.';
    }
  }

  if (msg.length > 120) {
    return 'Something went wrong. Please try again.';
  }

  return msg || 'Something went wrong. Please try again.';
}
