/* eslint-disable no-console */
export function logDebug(message: string): void {
  console.log(message);
}

export function logWarning(message: string): void {
  console.warn(message);
}

export function logException(message: string): void {
  console.error(message);
}
