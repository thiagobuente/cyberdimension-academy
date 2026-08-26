export const CERTIFICATE_NAME_MIN_LENGTH = 2;
export const CERTIFICATE_NAME_MAX_LENGTH = 120;

export function normalizeCertificateDisplayName(value: string) {
  return value.trim();
}

export function isValidCertificateDisplayName(value: string) {
  const normalized = normalizeCertificateDisplayName(value);
  return normalized.length >= CERTIFICATE_NAME_MIN_LENGTH && normalized.length <= CERTIFICATE_NAME_MAX_LENGTH;
}
