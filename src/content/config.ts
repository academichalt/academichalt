import { defineCollection, z } from 'astro:content';

const resources = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    source: z.string(),
    category: z.string(),
    exam: z.string(),
    resourceType: z.string(),
    tags: z.array(z.string()),
    language: z.string().default('English'),
    fileSize: z.string().optional(),
    format: z.string().default('PDF'),
    year: z.number().optional(),
    downloadLink: z.string(),
    mirrorLink: z.string().optional(),
    faqs: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).optional(),
  }),
});

export const collections = { resources };
