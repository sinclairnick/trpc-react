import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";
import type { AnyMutationProcedure, TRPCError } from "@trpc/server";
import { TRPCProcedureFetcherFn } from "../procedure-common/preocedure-common.types";

export type UseTRPCProcedureMutation<TInput, TOutput> = (
  options?: UseMutationOptions<TOutput, TRPCError, TInput>
) => UseMutationResult<TOutput, TRPCError, TInput>;

export type UseTRPCProcedureMutationHelpers<TInput, TOutput> = {
  useMutation: UseTRPCProcedureMutation<TInput, TOutput>;
  $mutate: TRPCProcedureFetcherFn<AnyMutationProcedure, TInput, TOutput>;
};
