import { trpc } from "@/lib/trpc";
import { UNAUTHED_ERR_MSG } from '@shared/const';
import type { AppRouter } from "../../server/routers";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink, TRPCClientError, type TRPCLink } from "@trpc/client";
import { observable } from "@trpc/server/observable";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import App from "./App";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  if (!["/login", "/register"].includes(window.location.pathname)) {
    window.location.href = "/login";
  }
};

queryClient.getQueryCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe(event => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

/**
 * Link que protege contra respostas não-JSON do proxy da sandbox (ex.: HTML de erro
 * 502 SESSION_DNS_FAILED durante hibernação). Converte HTML em erro legível e
 * registra um toast de "reconexão" em vez de deixar o tRPC falhar com
 * "Unexpected token '<'".
 */
const nonJsonResponseLink: TRPCLink<AppRouter> = () => ({ next, op }) =>
  observable((observer) => {
    const unsubscribe = next(op).subscribe({
      next: (result) => observer.next(result),
      error: (err) => {
        // tRPC já traduziu erros HTTP válidos; o problema é resposta HTML
        if (err?.cause && err.cause instanceof Error && err.cause.message.includes("<!doctype")) {
          observer.error(
            TRPCClientError.from(new Error("A conexão com a plataforma foi interrompida. Recarregando…"), { meta: { cause: err.cause } })
          );
          return;
        }
        observer.error(err);
      },
      complete: () => observer.complete(),
    });
    return unsubscribe;
  });

const trpcClient = trpc.createClient({
  links: [
    loggerLink({ enabled: () => false }),
    nonJsonResponseLink,
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        }).then(async (res) => {
          const contentType = res.headers.get("content-type") ?? "";
          if (!res.ok && !contentType.includes("json") && contentType.includes("html")) {
            const text = await res.text().catch(() => "");
            const msg = text.slice(0, 200).replace(/<[^>]+>/g, "").trim();
            const error = new Error(`Resposta inesperada do servidor (${res.status}): ${msg || "HTML em vez de JSON"}`);
            throw Object.assign(error, { res });
          }
          return res;
        });
      },
    }),
  ],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </trpc.Provider>
);
