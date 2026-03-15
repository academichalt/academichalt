import { defineCollection, z } from 'astro:content';

const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    publisher: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    language: z.string(),
    pages: z.number(),
    fileSize: z.string(),
    format: z.string(),
    downloadLink: z.string(),
    mirrorLinks: z.array(z.string()).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

export const collections = { books };
