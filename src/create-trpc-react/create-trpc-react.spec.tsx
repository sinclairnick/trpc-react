import { beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";
import { createTestRouter } from "../test/create-router";
import {
  QueryClient,
  QueryClientProvider,
  UseMutationResult,
} from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";
import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createTRPCTest } from "../test/create-trpc";
import { TRPCError } from "@trpc/server";

type DataType<T> = T extends UseMutationResult<infer TData> ? TData : never;

describe("Create TRPC React", () => {
  const appRouter = createTestRouter();
  type AppRouter = typeof appRouter;
  let wrapper: FC<PropsWithChildren>;

  // createTRPCReactServer<AppRouter>({}).bar.someMutation.

  beforeEach(() => {
    const queryClient = new QueryClient();

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  });

  it("Creates a proxy", () => {
    const { trpc } = createTRPCTest<AppRouter>();

    expect(trpc.bar).toBeDefined();
    expect(trpc.foo).toBeDefined();
    expect(trpc.foo.someMutation).toBeDefined();
    expect(trpc.foo.someQuery).toBeDefined();
    expect(trpc.bar.someMutation).toBeDefined();
    expect(trpc.bar.someQuery).toBeDefined();
  });

  it("useQuery", async () => {
    const { mutationMock, queryMock, trpc } = createTRPCTest<AppRouter>();

    const { result, waitFor } = renderHook(
      () =>
        trpc.foo.someQuery.useQuery({
          age: 2,
          name: { first: "A", last: "B" },
        }),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ query: true });
  });

  it("useMutation", async () => {
    const { mutationMock, queryMock, trpc } = createTRPCTest<AppRouter>();

    const { result, waitFor } = renderHook(
      () => trpc.foo.someMutation.useMutation(),
      { wrapper }
    );
    act(() => {
      result.current.mutate({ age: 1, name: { first: "A", last: "B" } });
    });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual({ mutation: true });
  });

  it("Returns correct mutation type", () => {
    const { trpc } = createTRPCTest<AppRouter>();

    const mutation = trpc.foo.someMutation.useMutation;
    type Mut = ReturnType<typeof mutation>;
    type MutArgs = NonNullable<Parameters<typeof mutation>[0]>;

    expectTypeOf<Mut["data"]>().toEqualTypeOf<number | undefined>();
    expectTypeOf<Mut["error"]>().toEqualTypeOf<TRPCError | null>();
    expectTypeOf<
      Parameters<NonNullable<MutArgs["onSuccess"]>>["0"]
    >().toEqualTypeOf<number>();
    expectTypeOf<
      Parameters<NonNullable<MutArgs["onSuccess"]>>["1"]
    >().toEqualTypeOf<{
      name: {
        first: string;
        last?: string | undefined;
      };
      age: number;
    }>();
  });
});
