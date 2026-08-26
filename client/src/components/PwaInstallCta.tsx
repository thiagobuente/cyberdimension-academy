import { Download, Info, Share2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandaloneDisplayMode() {
  return window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
}

export default function PwaInstallCta() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setIsStandalone(isStandaloneDisplayMode());
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent));

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsStandalone(true);
      setShowHelp(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (isStandalone) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) {
      setShowHelp(true);
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") setIsStandalone(true);
    setDeferredPrompt(null);
  };

  return (
    <aside className="mt-5 rounded-xl border border-neon-cyan/25 bg-neon-cyan/[0.06] p-3.5 text-left sm:max-w-xl" aria-label="Instalar aplicativo CyberDimension">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-neon-cyan/35 bg-neon-cyan/10 text-neon-cyan">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-bold text-foreground">Leve a academia com você</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">Instale o aplicativo para acessar seus estudos direto da tela inicial.</p>
          </div>
        </div>
        <button type="button" onClick={handleInstall} className="orbit-button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-neon-cyan/45 bg-neon-cyan/10 px-3.5 py-2 text-xs font-bold text-neon-cyan hover:bg-neon-cyan/20" aria-label="Instalar Aplicativo">
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          {deferredPrompt ? "Instalar aplicativo" : isIos ? "Instalar no iPhone" : "Instalar aplicativo"}
        </button>
      </div>
      {showHelp && (
        <div className="mt-3 flex items-start gap-2 border-t border-neon-cyan/15 pt-3 text-xs leading-5 text-muted-foreground" role="status">
          {isIos ? <Share2 className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" /> : <Info className="mt-0.5 h-4 w-4 shrink-0 text-neon-cyan" aria-hidden="true" />}
          <p>{isIos ? "No Safari, toque em Compartilhar e depois em Adicionar à Tela de Início." : "Abra o menu do navegador e escolha Instalar aplicativo ou Adicionar à tela inicial."}</p>
        </div>
      )}
    </aside>
  );
}
