import type {
  UseQueryOptions,
  UseQueryResult,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import type { TRPCError, AnyQueryProcedure } from "@trpc/server";
import { TRPCProcedureFetcherFn } from "../procedure-common/preocedure-common.types";

export type UseTRPCProcedureQuery<TInput, TOutput> = (
  input: TInput,
  options?: UseQueryOptions<TInput, TRPCError, TOutput>
) => UseQueryResult<TOutput, TRPCError>;

export type UseTRPCProcedureInfiniteQuery<TInput, TOutput> = (
  input: TInput,
  getInput: (
    ctx: QueryFunctionContext<QueryKey>,
    originalInput: TInput
  ) => TInput,
  options?: Omit<
    UseInfiniteQueryOptions<TOutput, TRPCError>,
    "queryKey" | "queryFn"
  >
) => UseInfiniteQueryResult<TOutput, TRPCError>;

export type UseTRPCProcedureLazyQuery<TInput, TOutput> = (
  options?: UseQueryOptions<TInput, TRPCError, TOutput>
) => [
  TRPCProcedureFetcherFn<AnyQueryProcedure, TInput, TOutput>,
  UseQueryResult<TOutput, TRPCError>
];

export type UseTRPCProcedureQueryHelpers<TInput, TOutput> = {
  useQuery: UseTRPCProcedureQuery<TInput, TOutput>;
  useInfiniteQuery: UseTRPCProcedureInfiniteQuery<TInput, TOutput>;
  useLazyQuery: UseTRPCProcedureLazyQuery<TInput, TOutput>;

  /**
   * Fetches and returns the data, without affecting the React Query cache.
   */
  $query: TRPCProcedureFetcherFn<AnyQueryProcedure, TInput, TOutput>;
  $infiniteKey: (input: TInput) => QueryKey;
};
