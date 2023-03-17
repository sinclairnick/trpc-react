import { AnyRouter } from "@trpc/server";
import {
  UseTRPCProcedureMutationHelpers,
  UseTRPCProcedureQueryHelpers,
  UseTRPCProcedureReturn,
  UseTRPCProcedureSubscriptionHelpers,
} from "../../procedure";
import { CreateTRPCReactReturn } from "../../types";

export type ClientSideKeys = Exclude<
  | keyof UseTRPCProcedureQueryHelpers<any, any>
  | keyof UseTRPCProcedureMutationHelpers<any, any>
  | keyof UseTRPCProcedureSubscriptionHelpers<any, any>,
  "$mutate" | "$query" | "$subscription"
>;

export type StripClientProperties<T> = Omit<T, ClientSideKeys>;

type BaseOptions<TAppRouter extends AnyRouter> = {
  appRouter: TAppRouter;
  createContext: () => TAppRouter["_def"]["_config"]["$types"]["ctx"];
};

export type CreateTRPCReactServerOptions<TAppRouter extends AnyRouter> =
  TAppRouter["_def"]["_config"]["transformer"] extends infer TTransformer extends
    | { _default: false }
    | { _default: undefined }
    ? BaseOptions<TAppRouter> & { transformer: TTransformer }
    : BaseOptions<TAppRouter>;

export type CreateTRPCReactServerInner<T> = T extends UseTRPCProcedureReturn<
  any,
  any,
  any
>
  ? StripClientProperties<T>
  : { [key in keyof T]: CreateTRPCReactServerInner<T[key]> };

export type CreateTRPCReactServerReturn<TAppRouter extends AnyRouter> =
  CreateTRPCReactServerInner<CreateTRPCReactReturn<TAppRouter>>;
