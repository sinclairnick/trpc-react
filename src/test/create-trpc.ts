import { AnyRouter } from "@trpc/server";
import { vi } from "vitest";
import { createTRPCReactInner } from "../create-trpc-react/create-trpc-react-inner";

export const createTRPCTest = <AppRouter extends AnyRouter>() => {
  const query = vi.fn().mockResolvedValue({ query: true });
  const mutation = vi.fn().mockResolvedValue({ mutation: true });

  const trpc = createTRPCReactInner<AppRouter>({
    client: { query, mutation } as any,
  });

  return { trpc, queryMock: query, mutationMock: mutation };
};
