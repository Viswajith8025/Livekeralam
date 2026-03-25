const { z } = require('zod');

const createPlaceSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    location: z.string().min(2, 'Location is required'),
    district: z.string().min(2, 'District is required'),
    category: z.string().optional(),
    image: z.string().url('Invalid image URL').optional(),
  }),
});

module.exports = {
  createPlaceSchema,
};
