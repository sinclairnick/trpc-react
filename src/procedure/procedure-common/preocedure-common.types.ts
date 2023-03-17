import { QueryKey } from "@tanstack/react-query";
import {
  AnyMutationProcedure,
  AnyQueryProcedure,
  AnySubscriptionProcedure,
} from "@trpc/server";

export type TRPCProcedureFetcherFn<TProc, TInput, TOutput> = TProc extends
  | AnyMutationProcedure
  | AnyQueryProcedure
  ? (input: TInput) => Promise<TOutput>
  : TProc extends AnySubscriptionProcedure
  ? (input: TInput, opts?: any) => {}
  : never;

export type TRPCProcedureQueryKeyFn<TInput> = (input: TInput) => QueryKey;

export type UseTRPCProcedureCommonHelpers<TProc, TInput, TOutput> = {
  $key: TRPCProcedureQueryKeyFn<TInput>;
};
