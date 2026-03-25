const { z } = require('zod');

const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    date: z.string(),
    location: z.string().min(2, 'Location is required'),
    district: z.string().min(2, 'District is required'),
    category: z.string().optional(),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

module.exports = {
  createEventSchema,
};
