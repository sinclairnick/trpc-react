import { UseQueryResult } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { TRPCSubscriptionObserver } from "@trpc/client/dist/internals/TRPCUntypedClient";
import { AnyRouter, TRPCError } from "@trpc/server";
import { Unsubscribable } from "@trpc/server/observable";

export type TRPCSubscriptionOptions = {
  enabled?: boolean;
} & Partial<TRPCSubscriptionObserver<any, TRPCClientError<AnyRouter>>>;

export type UseTRPCProcedureSubscription<TInput> = (
  input: TInput,
  opts?: TRPCSubscriptionOptions
) => void;
export type UseTRPCProcedureSubscriptionQuery<TInput, TOutput> = (
  input: TInput,
  opts?: TRPCSubscriptionOptions
) => UseQueryResult<TOutput, TRPCError>;

export type TRPCSubscribeFn<TInput> = (
  input: TInput,
  opts?: TRPCSubscriptionOptions
) => Unsubscribable;

export type UseTRPCProcedureSubscriptionHelpers<TInput, TOutput> = {
  useSubscription: UseTRPCProcedureSubscription<TInput>;
  useSubscriptionQuery: UseTRPCProcedureSubscriptionQuery<TInput, TOutput>;
  $subscription: (
    input: TInput,
    opts?: TRPCSubscriptionOptions
  ) => Unsubscribable;
};
