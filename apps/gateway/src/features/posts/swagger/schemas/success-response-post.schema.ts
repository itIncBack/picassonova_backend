export const SuccessResponsePostSchema = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'string', example: crypto.randomUUID() },
        userId: { type: 'string', example: crypto.randomUUID() },
        description: { type: 'string', example: 'Post description' },
        createdAt: { type: 'string', example: '2023-01-01T00:00:00Z' },
        updatedAt: { type: 'string', example: '2023-01-02T00:00:00Z' },
        postImages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: '6765629e99d91956c97b460a' },
              imageUrl: {
                type: 'string',
                example:
                  'https://storage.yandexcloud.net/picassonova/uploads/edfcbf07-6cab-403f-8726-c9930daae5ee.jpg',
              },
              createdAt: { type: 'string', example: '2023-01-01T00:00:00Z' },
            },
          },
        },
      },
    },
    code: { type: 'number', example: 200 },
    extensions: { type: 'array', items: { type: 'string' }, example: [] },
  },
};
