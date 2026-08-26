import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Shield, ArrowLeft, Users } from "lucide-react";

export default function AdminUsers() {
  const { user } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/admin/acesso" });

  const usersQuery = trpc.admin.users.useQuery();

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Acesso negado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <header className="relative z-10 border-b border-border/50 backdrop-blur-md bg-background/80">
        <div className="container flex items-center gap-4 py-4">
          <Link href="/admin">
            <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Admin
            </span>
          </Link>
          <Shield className="w-5 h-5 text-[oklch(0.85_0.2_195)]" />
          <span className="font-bold font-[Orbitron] text-sm">Gerenciar Usuários</span>
        </div>
      </header>

      <main className="relative z-10 container py-8">
        <h1 className="text-2xl font-bold font-[Orbitron] mb-6">Todos os Usuários</h1>

        <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">ID</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Nome</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Email</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Role</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Cadastro</th>
                <th className="text-left p-4 text-xs text-muted-foreground font-medium">Último Login</th>
              </tr>
            </thead>
            <tbody>
              {usersQuery.data?.map((u) => (
                <tr key={u.id} className="border-b border-border/30 hover:bg-[oklch(0.85_0.2_195/0.05)]">
                  <td className="p-4 text-sm font-mono text-muted-foreground">{u.id}</td>
                  <td className="p-4 text-sm">{u.name || "—"}</td>
                  <td className="p-4 text-sm text-muted-foreground">{u.email || "—"}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${u.role === "admin" ? "bg-[oklch(0.65_0.25_280/0.2)] text-[oklch(0.65_0.25_280)]" : "bg-[oklch(0.85_0.2_195/0.1)] text-[oklch(0.85_0.2_195)]"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">
                    {new Date(u.lastSignedIn).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!usersQuery.data || usersQuery.data.length === 0) && (
            <div className="p-8 text-center text-muted-foreground">
              Nenhum usuário encontrado
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
