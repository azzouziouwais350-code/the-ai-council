import { describe, expect, it } from "vitest";
import { PROVIDERS } from "./index.js";

describe("PROVIDERS", () => {
  it("contient exactement les quatre fournisseurs autorisés", () => {
    expect([...PROVIDERS]).toEqual(["openai", "anthropic", "xai", "deepseek"]);
  });
});
