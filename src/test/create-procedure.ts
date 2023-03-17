import { t } from "./trpc";
import z from "zod";

const User = z.object({
  name: z.object({
    first: z.string(),
    last: z.string().optional(),
  }),
  age: z.number(),
});

export const createTestQuery = () =>
  t.procedure
    .input(User)
    .output(
      z.object({
        fullName: z.string(),
      })
    )
    .query(({ input }) => {
      return {
        fullName: `${input.name.first} ${input.name.last ?? ""}`,
      };
    });

export const createTestMutation = () =>
  t.procedure
    .input(User)
    .output(z.number())
    .mutation(({ input }) => {
      return 1;
    });
