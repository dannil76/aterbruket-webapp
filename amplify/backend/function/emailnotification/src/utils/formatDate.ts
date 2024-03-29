export function formatDateTime(date: Date | undefined): string {
  if (!date) {
    return '';
  }

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Stockholm',
  } as Intl.DateTimeFormatOptions;

  const dateString = date.toLocaleTimeString('sv-SE', dateOptions);
  return dateString;
}

export function formatDate(date: Date | undefined): string {
  if (!date) {
    return '';
  }

  const dateOptions = {
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Stockholm',
  } as Intl.DateTimeFormatOptions;

  const dateString = date.toLocaleDateString('sv-SE', dateOptions);
  return dateString;
}
