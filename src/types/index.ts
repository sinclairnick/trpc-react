import type { CreateTRPCClientOptions, TRPCUntypedClient } from "@trpc/client";
import type { AnyRouter, AnyProcedure } from "@trpc/server";
import { TRPCProcedureReactHelpers } from "../procedure/procedure.types";
import { TRPCRootHelpers } from "../root-helpers/root-helpers.types";

export type StripInternalKeys<T> = Exclude<
  T,
  "getErrorShape" | "_def" | "createCaller"
>;

export type CreateTRPCReactReturn<TAppRouter extends AnyRouter> = {
  [key in StripInternalKeys<keyof TAppRouter>]: CreateTRPCReactInner<
    TAppRouter[key]
  >;
} & TRPCRootHelpers;

export type CreateTRPCReactInner<T> = T extends AnyRouter
  ? { [key in StripInternalKeys<keyof T>]: CreateTRPCReactInner<T[key]> }
  : T extends AnyProcedure
  ? TRPCProcedureReactHelpers<T>
  : never;

export type CreateTRPCReactOptions<TRouter extends AnyRouter> = {
  config: CreateTRPCClientOptions<TRouter>;
};
export type TRPCClient = TRPCUntypedClient<AnyRouter>;
