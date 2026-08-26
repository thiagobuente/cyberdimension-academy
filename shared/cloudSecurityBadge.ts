export const cloudSecurityTrackSlug = "cloud-security-specialization";
export const cloudSecurityBadgeCode = "cloud-security-specialist";
export const cloudSecurityCourseSlugs = ["aws-security-fundamentals", "azure-security-fundamentals"] as const;

export function hasCompletedCloudSecurityTrack(completedCourseSlugs: readonly string[]) {
  const completed = new Set(completedCourseSlugs);
  return cloudSecurityCourseSlugs.every((courseSlug) => completed.has(courseSlug));
}
