import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

afterEach(() => vi.unstubAllGlobals());

describe("App", () => {
  it("affiche le titre et les quatre fournisseurs", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));
    render(<App />);
    expect(screen.getByRole("heading", { name: "THE AI COUNCIL" })).toBeInTheDocument();
    expect(screen.getByText(/openai, anthropic, xai, deepseek/)).toBeInTheDocument();
  });

  it("affiche le statut de l'API une fois reçu", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ json: async () => ({ status: "ok", services: { postgres: true, redis: true }, version: "2.0.0" }) })),
    );
    render(<App />);
    expect(await screen.findByText("API : ok")).toBeInTheDocument();
  });
});
