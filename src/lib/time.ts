export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getTimeColor(seconds: number): string {
  if (seconds <= 60) return 'text-red-600';
  if (seconds <= 180) return 'text-orange-600';
  return 'text-green-600';
}
