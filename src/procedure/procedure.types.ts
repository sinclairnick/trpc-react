import {
  AnyQueryProcedure,
  AnyMutationProcedure,
  AnyProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { UseTRPCProcedureCommonHelpers } from "./procedure-common/preocedure-common.types";
import { UseTRPCProcedureMutationHelpers } from "./procedure-mutation/procedure-mutation.types";
import { QueryClientProcedureMethods } from "./procedure-query-client/procedure-query-client.types";
import { UseTRPCProcedureQueryHelpers } from "./procedure-query/procedure-query.types";
import { UseTRPCProcedureSubscriptionHelpers } from "./procedure-subscription/procedure-subscription.types";

export type UseTRPCProcedureHook<TProc, TInput, TOutput> =
  TProc extends AnyQueryProcedure
    ? UseTRPCProcedureQueryHelpers<TInput, TOutput> &
        QueryClientProcedureMethods<TInput, TOutput>
    : TProc extends AnyMutationProcedure
    ? UseTRPCProcedureMutationHelpers<TInput, TOutput>
    : never;

export type UseTRPCProcedureReturn<TProc, TInput, TOutput> =
  UseTRPCProcedureHook<TProc, TInput, TOutput> &
    UseTRPCProcedureCommonHelpers<TProc, TInput, TOutput>;

export type TRPCProcedureReactHelpers<TProc extends AnyProcedure> =
  inferProcedureInput<TProc> extends infer TInput
    ? inferProcedureOutput<TProc> extends infer TOutput
      ? UseTRPCProcedureReturn<TProc, TInput, TOutput>
      : never
    : never;

export type UseTRPCProcedureQueryKeys = keyof UseTRPCProcedureQueryHelpers<
  any,
  any
>;
export type UseTRPCProcedureMutationKeys =
  keyof UseTRPCProcedureMutationHelpers<any, any>;
export type UseTRPCProcedureSubscriptionKeys =
  keyof UseTRPCProcedureSubscriptionHelpers<any, any>;
export type UseTRPCProcedureCommonKeys = keyof UseTRPCProcedureCommonHelpers<
  any,
  any,
  any
>;

export type UseTRPCProcedureKey =
  | UseTRPCProcedureQueryKeys
  | UseTRPCProcedureMutationKeys
  | UseTRPCProcedureSubscriptionKeys
  | UseTRPCProcedureCommonKeys;
