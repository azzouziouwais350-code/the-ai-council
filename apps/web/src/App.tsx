import { useEffect, useState } from "react";
import { PROVIDERS, type HealthStatus } from "@council/shared";

type State = { kind: "loading" } | { kind: "error" } | { kind: "ready"; health: HealthStatus };

export function App() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((r) => r.json() as Promise<HealthStatus>)
      .then((health) => setState({ kind: "ready", health }))
      .catch(() => {
        if (!controller.signal.aborted) setState({ kind: "error" });
      });
    return () => controller.abort();
  }, []);

  return (
    <main>
      <h1>THE AI COUNCIL</h1>
      <p>Fournisseurs : {PROVIDERS.join(", ")}</p>
      <p data-testid="api-status">
        {state.kind === "loading" && "API : vérification…"}
        {state.kind === "error" && "API : injoignable"}
        {state.kind === "ready" && `API : ${state.health.status}`}
      </p>
    </main>
  );
}
