import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react-hooks";
import React, { FC, PropsWithChildren } from "react";
import { getProcedureQueryHelpers } from "./procedure-query";

describe("Procedure Query", () => {
  let wrapper: FC<PropsWithChildren>;

  beforeEach(() => {
    const queryClient = new QueryClient();

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it("Creates a query hook", async () => {
    const queryMock = vi.fn().mockResolvedValue({ foo: "bar" });

    const helpers = getProcedureQueryHelpers({
      path: "some.path",
      client: { query: queryMock } as any,
    });

    const { result, waitFor } = renderHook(
      () => helpers.useQuery({ input: true }),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.foo).toEqual("bar");
    const lastCall = queryMock.mock.lastCall;
    const [path, input] = lastCall;
    expect(path).toEqual("some.path");
    expect(input).toEqual({ input: true });
  });

  it("Returns mutation fetcher", async () => {
    const queryMock = vi.fn().mockResolvedValue({ foo: "bar" });

    const helpers = getProcedureQueryHelpers({
      path: "some.path",
      client: { query: queryMock } as any,
    });

    const fetcher = helpers.$query;

    expect(fetcher).toBeInstanceOf(Function);
    expect(fetcher({ input: true })).resolves.toEqual({ foo: "bar" });
  });
});
