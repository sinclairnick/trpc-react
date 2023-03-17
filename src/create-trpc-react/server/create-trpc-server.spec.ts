import { describe, expect, it } from "vitest";
import { createTRPCServerTest } from "../../test/create-server-trpc";

describe("Create TRPC React", () => {
  const { trpc } = createTRPCServerTest();

  it("Calls appRouter directly", async () => {
    const result = await trpc.bar.someQuery.$query({
      age: 2,
      name: {
        first: "a",
        last: "b",
      },
    });
		
    expect(result.fullName).toBe("a b");
  });
});
