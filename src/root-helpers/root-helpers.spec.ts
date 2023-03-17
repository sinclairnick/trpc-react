import { getRootHelpers } from "./root-helpers";
import { describe, expect, it, vi } from "vitest";
import { QueryClient } from "@tanstack/react-query";

describe("Root helpers", () => {
  it("Should serialize using provided serializer", () => {
    const deserialize = vi.fn();
    const serialize = vi.fn();

    const helpers = getRootHelpers({
      client: {
        runtime: {
          transformer: { deserialize, serialize },
        },
      } as any,
    });

    const queryClient = new QueryClient();
    helpers.$dehydrate(queryClient);

    expect(serialize).toHaveBeenCalledTimes(1);
  });

  it("Should de-serialize using provided serializer", () => {
    const deserialize = vi.fn();
    const serialize = vi.fn();

    const helpers = getRootHelpers({
      client: {
        runtime: {
          transformer: { deserialize, serialize },
        },
      } as any,
    });

    helpers.$prehydrate({
      __TRPC__: true,
      mutations: [],
      queries: [],
    } as any);

    expect(deserialize).toHaveBeenCalledTimes(1);
  });

  it("Does not serialize if TRPC key missing", () => {
    const deserialize = vi.fn();
    const serialize = vi.fn();

    const helpers = getRootHelpers({
      client: {
        runtime: {
          transformer: { deserialize, serialize },
        },
      } as any,
    });

    helpers.$prehydrate({
      mutations: [],
      queries: [],
    } as any);

    expect(deserialize).not.toHaveBeenCalled();
  });
});
