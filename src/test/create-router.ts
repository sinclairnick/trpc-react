import { createTestMutation, createTestQuery } from "./create-procedure";
import { t } from "./trpc";

export const createTestRouter = () => {
  return t.router({
    foo: t.router({
      someMutation: createTestMutation(),
      someQuery: createTestQuery(),
    }),
    bar: t.router({
      someMutation: createTestMutation(),
      someQuery: createTestQuery(),
    }),
  });
};
