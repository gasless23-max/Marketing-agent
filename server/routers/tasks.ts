import { router, protectedProcedure } from '../_core/trpc';
import { z } from 'zod';
import { createTask, getTasks, getTaskById, updateTask } from '../db-helpers';
import { nanoid } from 'nanoid';

const taskSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['campaign_launch', 'content_generation', 'optimization', 'monitoring', 'analysis']),
  config: z.record(z.string(), z.any()),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
});

export const tasksRouter = router({
  create: protectedProcedure.input(taskSchema).mutation(async ({ input, ctx }) => {
    return createTask({
      id: nanoid(),
      userId: ctx.user.id,
      name: input.name,
      type: input.type,
      config: input.config,
      priority: input.priority || 'medium',
      status: 'pending',
    });
  }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return getTasks(ctx.user.id);
  }),

  get: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return getTaskById(input.id);
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: z.object({
          status: z.enum(['pending', 'running', 'completed', 'failed']).optional(),
          progress: z.number().min(0).max(100).optional(),
          result: z.record(z.string(), z.any()).optional(),
          error: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      return updateTask(input.id, input.data);
    }),

  cancel: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return updateTask(input.id, {
      status: 'failed',
      error: 'Task cancelled by user',
    });
  }),

  retry: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return updateTask(input.id, {
      status: 'pending',
      progress: 0,
      error: undefined,
    });
  }),
});
