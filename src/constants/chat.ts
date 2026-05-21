/**
 * Chat-flow tuning knobs.
 *
 * CONCLUSION_THRESHOLD — percentage at which the frontend stops calling
 * `/send-answer` and instead calls `/conclude-chat` to wrap up the
 * decision journey. Spec: "front end will wait for percentage to be more
 * than 90%."
 *
 * Keep this here so it can be changed in one place if the threshold
 * is ever re-tuned.
 */
export const CONCLUSION_THRESHOLD = 90;
