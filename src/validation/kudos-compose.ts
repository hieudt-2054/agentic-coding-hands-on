import { z } from 'zod';

export const ComposeKudoSchema = z.object({
  receiverId: z.string().regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/),
  danhHieu: z.string().min(1).max(60),
  contentHtml: z.string(),
  hashtags: z
    .array(z.string().regex(/^[a-z0-9][a-z0-9-]{0,29}$/))
    .min(1)
    .max(5),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        path: z.string(),
        position: z.number().int().min(0).max(4),
      })
    )
    .max(5)
    .optional()
    .default([]),
  isAnonymous: z.boolean().optional().default(false),
});

export type ComposeKudoInput = z.infer<typeof ComposeKudoSchema>;
