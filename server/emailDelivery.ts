import { ENV } from "./_core/env";

export function isEmailDeliveryConfigured() {
  return Boolean(ENV.resendApiKey && ENV.resendFromEmail && ENV.appBaseUrl);
}

export const isPasswordResetEmailConfigured = isEmailDeliveryConfigured;

export async function sendPasswordResetEmail(input: { to: string; resetUrl: string }) {
  if (!isEmailDeliveryConfigured()) return { delivered: false as const };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.resendFromEmail,
      to: [input.to],
      subject: "Redefina sua senha | CyberDimension Academy",
      html: `<p>Recebemos uma solicitação para redefinir sua senha.</p><p><a href="${input.resetUrl}">Redefinir minha senha</a></p><p>Este link expira em 30 minutos. Se você não solicitou essa alteração, ignore este e-mail.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Password reset email delivery failed (${response.status})`);
  }

  return { delivered: true as const };
}

export async function sendMagicLinkEmail(input: { to: string; magicUrl: string }) {
  if (!isEmailDeliveryConfigured()) return { delivered: false as const };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.resendFromEmail,
      to: [input.to],
      subject: "Seu acesso à CyberDimension Academy",
      html: `<p>Use o link abaixo para acessar a CyberDimension Academy.</p><p><a href="${input.magicUrl}">Acessar minha conta</a></p><p>Por segurança, este link expira em 15 minutos e pode ser usado uma única vez.</p><p>Se você não solicitou este acesso, ignore este e-mail.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Magic link email delivery failed (${response.status})`);
  }

  return { delivered: true as const };
}
