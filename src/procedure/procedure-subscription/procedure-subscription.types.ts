import { UseQueryResult } from "@tanstack/react-query";
import { TRPCError } from "@trpc/server";

export type UseTRPCProcedureSubscription<TProc, TInput, TOutput> = (
  input: TInput,
  opts: any // TODO: Fix Options type
) => UseQueryResult<TOutput, TRPCError>;

export type UseTRPCProcedureSubscriptionHelpers<TProc, TInput, TOutput> = {
  useSubscription: UseTRPCProcedureSubscription<TProc, TInput, TOutput>;
  $subscribe: (input: TInput, opts: any) => unknown;
};
