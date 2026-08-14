/**
 * Turn a caught error into a short, human-friendly message safe to show inline.
 *
 * Backend validation messages ("Email already registered") are usually fine to
 * show as-is. This exists to catch the other case: network failures, raw HTTP
 * status text, and JSON-parsing leftovers that would otherwise reach the user
 * verbatim (e.g. "Failed to fetch", "Unexpected token < in JSON",
 * "Registration failed: Internal Server Error").
 */
export function toFriendlyErrorMessage(err: unknown, fallback: string): string {
    if (err instanceof TypeError && /fetch|network/i.test(err.message)) {
        return "We couldn't connect to the server. Please check your internet connection and try again.";
    }

    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : '';
    if (!message) return fallback;

    const technicalPatterns = [
        /failed to fetch/i,
        /networkerror/i,
        /load failed/i,
        /unexpected token/i,
        /<!doctype/i,
        /internal server error/i,
        /bad gateway/i,
        /gateway timeout/i,
        /service unavailable/i,
        /^\d{3}\s/, // "500 Internal Server Error" style strings
        /statustext/i,
    ];
    if (technicalPatterns.some((pattern) => pattern.test(message))) return fallback;

    const knownStatusMessages: Record<string, string> = {
        unauthorized: 'Invalid email or password. Please check your credentials and try again.',
        forbidden: "You don't have permission to do that.",
        'not found': "We couldn't find what you're looking for.",
    };
    const knownMessage = knownStatusMessages[message.trim().toLowerCase()];
    if (knownMessage) return knownMessage;

    // Overly long or stack-trace-like text isn't something a user should read.
    if (message.length > 160 || /\n\s*at\s/.test(message)) return fallback;

    return message;
}
