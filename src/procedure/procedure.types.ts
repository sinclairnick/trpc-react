import {
  AnyQueryProcedure,
  AnyMutationProcedure,
  AnyProcedure,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { UseTRPCProcedureCommonHelpers } from "./procedure-common/preocedure-common.types";
import { UseTRPCProcedureMutationHelpers } from "./procedure-mutation/procedure-mutation.types";
import { UseTRPCProcedureQueryHelpers } from "./procedure-query/procedure-query.types";
import { UseTRPCProcedureSubscriptionHelpers } from "./procedure-subscription/procedure-subscription.types";

export type UseTRPCProcedureHook<TProc, TInput, TOutput> =
  TProc extends AnyQueryProcedure
    ? UseTRPCProcedureQueryHelpers<TInput, TOutput>
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
  keyof UseTRPCProcedureSubscriptionHelpers<any, any, any>;
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

export const ProcedureQueryKeys: Set<UseTRPCProcedureQueryKeys> = new Set([
  "useInfiniteQuery",
  "useLazyQuery",
  "useQuery",
  "$query",
]);

export const ProcedureMutationKeys: Set<UseTRPCProcedureMutationKeys> = new Set(
  ["useMutation", "$mutate"]
);

export const ProcedureSubscriptionKeys: Set<UseTRPCProcedureSubscriptionKeys> =
  new Set(["useSubscription", "$subscribe"]);

export const ProcedureCommonKeys: Set<UseTRPCProcedureCommonKeys> = new Set([
  "$key",
]);

export const ProcedureKeys: UseTRPCProcedureKey[] = [
  ...ProcedureQueryKeys,
  ...ProcedureMutationKeys,
  ...ProcedureSubscriptionKeys,
  ...ProcedureCommonKeys,
];
