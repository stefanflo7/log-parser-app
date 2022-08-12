export function formatISODateToUnixTimestamp(isoDate: string): number {
  return new Date(isoDate).getTime();
}
