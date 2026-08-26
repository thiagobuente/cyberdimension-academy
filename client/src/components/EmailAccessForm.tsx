import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useLocation } from "wouter";

type EmailAccessFormProps = {
  mode?: "login" | "register";
};

export function EmailAccessForm({ mode: _mode }: EmailAccessFormProps) {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const accessWithEmail = trpc.auth.accessWithEmail.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    try {
      await accessWithEmail.mutateAsync({ email });
      await utils.auth.me.invalidate();
      setLocation("/dashboard");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível entrar agora.");
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      <label className="block text-sm font-bold text-foreground">
        E-mail
        <input
          required
          type="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-neon-cyan/60 focus:ring-2 focus:ring-neon-cyan/15"
          placeholder="voce@exemplo.com"
        />
      </label>
      {message && <p className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200">{message}</p>}
      <button
        disabled={accessWithEmail.isPending}
        className="orbit-button flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-neon-cyan to-[oklch(0.68_0.2_245)] px-5 py-3.5 font-bold text-[oklch(0.1_0.02_260)] shadow-[0_0_30px_oklch(0.85_0.2_195/0.18)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {accessWithEmail.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {accessWithEmail.isPending ? "Entrando..." : "Entrar na plataforma"}
      </button>
    </form>
  );
}
