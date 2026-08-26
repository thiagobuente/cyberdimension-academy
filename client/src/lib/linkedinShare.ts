export function buildLinkedInShareUrl(contentUrl: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(contentUrl)}`;
}

export function buildCertificateVerificationUrl(origin: string, identifier: string) {
  return `${origin}/verify-certificate?identifier=${encodeURIComponent(identifier)}`;
}

export function buildBadgeVerificationUrl(origin: string, badgeId: number) {
  return `${origin}/badge/${badgeId}`;
}
