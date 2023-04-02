import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi, expectTypeOf } from "vitest";
import { getProcedureMutationHelpers } from "./precedure-mutation";
import { renderHook, act } from "@testing-library/react-hooks";
import React from "react";

describe("Procedure Mutation", () => {
  let wrapper: FC<PropsWithChildren>;

  beforeEach(() => {
    const queryClient = new QueryClient();

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it("Creates a mutation hook", async () => {
    const mutationMock = vi.fn().mockResolvedValue({ foo: "bar" });

    const helpers = getProcedureMutationHelpers({
      path: "some.path",
      client: { mutation: mutationMock } as any,
    });

    const { result, waitFor } = renderHook(() => helpers.useMutation({}), {
      wrapper,
    });

    act(() => {
      result.current.mutate({ input: true });
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data.foo).toEqual("bar");
    const lastCall = mutationMock.mock.lastCall;
    const [path, input] = lastCall;
    expect(path).toEqual("some.path");
    expect(input).toEqual({ input: true });
  });

  it("Returns mutation fetcher", async () => {
    const mutationMock = vi.fn().mockResolvedValue({ foo: "bar" });

    const helpers = getProcedureMutationHelpers({
      path: "some.path",
      client: { mutation: mutationMock } as any,
    });

    const fetcher = helpers.$mutate;

    expect(fetcher).toBeInstanceOf(Function);
    expect(fetcher({ input: true })).resolves.toEqual({ foo: "bar" });
  });
});
