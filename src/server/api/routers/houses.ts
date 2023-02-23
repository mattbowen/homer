import { createTRPCRouter, publicProcedure } from "../trpc";

export const housesRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.zillowDataView.findMany();
  }),
});
