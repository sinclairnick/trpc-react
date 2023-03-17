import { describe, it, expect } from "vitest";
import { getProcedureCommonHelpers } from "./procedure-common";

describe("Procedure Common", () => {
  describe("$Key", () => {
    it("Gets key", () => {
      const helpers = getProcedureCommonHelpers({
        path: "some.path",
      });

      const key = helpers.$key({ id: 1 });

      const [path, input] = key;
      expect(path).toBe("trpc.some.path");
      expect(input).toEqual({ id: 1 });
    });
  });
});
