import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { createCampaign, getCampaigns, getCampaignById, updateCampaign } from '../db-helpers';
import { nanoid } from 'nanoid';

const campaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  platforms: z.array(z.string()),
  targetAudience: z.record(z.string(), z.any()),
  budget: z.number().positive(),
  content: z.record(z.string(), z.any()),
});

export const campaignsRouter = router({
  create: protectedProcedure.input(campaignSchema).mutation(async ({ input, ctx }) => {
    return createCampaign({
      id: nanoid(),
      userId: ctx.user.id,
      name: input.name,
      description: input.description || undefined,
      platforms: input.platforms,
      targetAudience: input.targetAudience,
      budget: input.budget.toString(),
      content: input.content,
      status: 'draft',
    });
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return getCampaigns(ctx.user.id);
  }),

  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return getCampaignById(input.id);
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: campaignSchema.partial(),
      })
    )
    .mutation(async ({ input }) => {
      const updateData = { ...input.data };
      if (updateData.budget !== undefined) {
        updateData.budget = updateData.budget.toString() as any;
      }
      return updateCampaign(input.id, updateData as any);
    }),

  launch: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return updateCampaign(input.id, {
      status: 'active',
      launchedAt: new Date(),
    });
  }),

  pause: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return updateCampaign(input.id, {
      status: 'paused',
    });
  }),

  complete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return updateCampaign(input.id, {
      status: 'completed',
      completedAt: new Date(),
    });
  }),
});
