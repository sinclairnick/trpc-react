import {
  InfiniteData,
  QueryClient,
  UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";

export type TRPCProcedurePrefetchFn<TInput> = (
  queryClient: QueryClient,
  input: TInput
) => Promise<void>;

export type TRPCProcedureFetchFn<TInput, TOutput> = (
  queryClient: QueryClient,
  input: TInput
) => Promise<TOutput>;

export type TRPCProcedureFetchInfiniteQuery<TInput, TOutput> = (
  queryClient: QueryClient,
  initialInput: TInput,
  options?: Omit<
    UseInfiniteQueryOptions<TInput, TRPCError, TOutput, any, any>,
    "queryKey" | "queryFn"
  >
) => Promise<InfiniteData<TOutput>>;

export type TRPCProcedurePrefetchInfiniteQuery<TInput, TOutput> = (
  queryClient: QueryClient,
  initialInput: TInput,
  options?: Omit<
    UseInfiniteQueryOptions<TInput, TRPCError, TOutput, any, any>,
    "queryKey" | "queryFn"
  >
) => Promise<void>;

export type QueryClientProcedureMethods<TInput, TOutput> = {
  /**
   * Fetches and returns the data, saving the result in the React Query cache.
   */
  $fetch: TRPCProcedureFetchFn<TInput, TOutput>;
  /**
   * Fetches the data, saving the result in the React Query cache.
   * Does not return the data, or throw errors.
   */
  $prefetch: TRPCProcedurePrefetchFn<TInput>;
  /**
   * Fetches and returns the data, saving the result in the React Query cache.
   */
  $fetchInfinite: TRPCProcedureFetchInfiniteQuery<TInput, TOutput>;
  /**
   * Fetches the data, saving the result in the React Query cache.
   * Does not return the data, or throw errors.
   */
  $prefetchInfinite: TRPCProcedurePrefetchInfiniteQuery<TInput, TOutput>;
};
