export function getDecimalSeparator(): string {
  return '.';
}

export function getGroupSeparator(): string {
  return ',';
}

export function formatAmount(amount: any): string {
  return String(amount ?? '0');
}
