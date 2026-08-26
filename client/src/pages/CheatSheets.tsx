import { useState } from "react";
import { Link } from "wouter";
import { cheatSheets, type CheatSheet, type CheatSheetSection } from "@shared/cheatSheets";
import {
  Terminal,
  Cpu,
  Network,
  Shield,
  Award,
  Search,
  BookOpen,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  terminal: <Terminal className="w-5 h-5" />,
  cpu: <Cpu className="w-5 h-5" />,
  network: <Network className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  award: <Award className="w-5 h-5" />,
};

const accentColors: Record<string, { bg: string; border: string; text: string; hover: string; badge: string }> = {
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    hover: "hover:border-emerald-500/60",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    hover: "hover:border-cyan-500/60",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    hover: "hover:border-blue-500/60",
    badge: "bg-blue-500/20 text-blue-300",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    hover: "hover:border-purple-500/60",
    badge: "bg-purple-500/20 text-purple-300",
  },
  yellow: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    hover: "hover:border-yellow-500/60",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-400",
    hover: "hover:border-red-500/60",
    badge: "bg-red-500/20 text-red-300",
  },
};

function CommandItem({ command, description }: { command: string; description: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group flex items-start gap-3 py-2 border-b border-white/5 last:border-b-0">
      <div className="flex-1 min-w-0">
        <code className="block text-sm font-mono text-cyan-300 bg-black/30 px-2 py-1 rounded border border-white/5 truncate">
          {command}
        </code>
        <p className="text-sm text-slate-400 mt-1 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={handleCopy}
        className="mt-1 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-slate-500 hover:text-white"
        title="Copiar"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function SectionBlock({ section, accent }: { section: CheatSheetSection; accent: string }) {
  const colors = accentColors[accent] || accentColors.cyan;
  return (
    <div className="mb-6">
      <h3 className={`text-lg font-semibold mb-3 ${colors.text} flex items-center gap-2`}>
        <span className={`w-1.5 h-5 rounded-full ${colors.bg.replace("/10", "")}`} />
        {section.title}
      </h3>
      <div className="space-y-1">
        {section.items.map((item, i) => (
          <CommandItem key={i} command={item.command} description={item.description} />
        ))}
      </div>
    </div>
  );
}

function CheatSheetDetail({ sheet }: { sheet: CheatSheet }) {
  const colors = accentColors[sheet.accent] || accentColors.cyan;

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/materiais" className={`p-2 rounded-lg border ${colors.border} ${colors.text} hover:bg-white/5 transition-colors`}>
          <ChevronRight className="w-4 h-4 rotate-180" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            {iconMap[sheet.icon] || <BookOpen className="w-6 h-6" />}
            {sheet.title}
          </h2>
          <p className="text-slate-400 mt-1">{sheet.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sheet.sections.map((section, i) => (
          <div key={i} className={`p-4 rounded-lg border ${colors.border} ${colors.bg}`}>
            <SectionBlock section={section} accent={sheet.accent} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CheatSheets() {
  const [selected, setSelected] = useState<CheatSheet | null>(null);
  const [search, setSearch] = useState("");

  const filteredSheets = cheatSheets.filter(
    (cs) =>
      cs.title.toLowerCase().includes(search.toLowerCase()) ||
      cs.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      cs.sections.some((s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.items.some(
          (item) =>
            item.command.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase())
        )
      )
  );

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#E6EAF0]">
      {/* Header */}
      <div className="border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                Material de Referência
              </h1>
              <p className="text-slate-400 mt-2 text-lg">
                Cheat sheets essenciais para estudo rápido e consulta em campo
              </p>
            </div>
            <Link
              href="/catalogo"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Voltar ao Catálogo
            </Link>
          </div>

          {/* Search */}
          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar comando, conceito ou cheat sheet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {selected ? (
          <CheatSheetDetail sheet={selected} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSheets.map((sheet) => {
              const colors = accentColors[sheet.accent] || accentColors.cyan;
              const totalItems = sheet.sections.reduce((acc, s) => acc + s.items.length, 0);
              return (
                <button
                  key={sheet.id}
                  onClick={() => setSelected(sheet)}
                  className={`text-left p-5 rounded-lg border ${colors.border} bg-white/[0.02] ${colors.hover} transition-all duration-200 hover:bg-white/[0.04] group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`p-2 rounded-lg ${colors.bg} ${colors.text}`}>
                      {iconMap[sheet.icon] || <BookOpen className="w-5 h-5" />}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors.badge}`}>
                      {totalItems} itens
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{sheet.subtitle}</p>
                  <div className="mt-3 flex items-center gap-1 text-xs text-slate-500">
                    <ChevronRight className="w-3 h-3" />
                    {sheet.sections.length} seções
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {filteredSheets.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Nenhum resultado encontrado para "{search}"</p>
            <p className="text-slate-500 mt-2">Tente buscar por comando, conceito ou nome do cheat sheet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
