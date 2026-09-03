
export function getAuthErrorCode(error: unknown): string | undefined {
  const data = (error as any)?.response?.data;
  if (!data) return undefined;
  // Nest peut mettre code à la racine ou dans message (objet)
  if (typeof data.code === 'string') return data.code;
  if (typeof data.message === 'object' && data.message?.code) return data.message.code;
  return undefined;
}

export function isAccountDisabled(error: unknown): boolean {
  return getAuthErrorCode(error) === 'ACCOUNT_DISABLED';
}

export function isPhoneNotVerified(error: unknown): boolean {
  return getAuthErrorCode(error) === 'PHONE_NOT_VERIFIED';
}