import { getQueryKey } from "../../util/key.util";
import { UseTRPCProcedureCommonHelpers } from "./preocedure-common.types";

export const getProcedureCommonHelpers = (args: {
  path: string;
}): UseTRPCProcedureCommonHelpers<any, any, any> => {
  const { path } = args;

  const key = (input: any) => {
    return getQueryKey(path, input);
  };

  return { $key: key };
};
