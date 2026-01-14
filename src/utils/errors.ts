export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
  }
}

export const errorHandler = (error: any, req: any, res: any, next: any) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
      },
    });
  }

  // Handle GraphQL errors
  if (error.originalError instanceof ApiError) {
    return res.status(error.originalError.statusCode).json({
      error: {
        message: error.originalError.message,
        code: error.originalError.code,
      },
    });
  }

  // Default error
  console.error('Unhandled error:', error);
  return res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    },
  });
};