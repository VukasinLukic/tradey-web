import { Response } from 'express';

/**
 * Utility functions for consistent API responses
 */

export const successResponse = (res: Response, data: any, statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const errorResponse = (res: Response, message: string, statusCode: number = 500, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(errors && { errors }),
  });
};

export const paginatedResponse = (
  res: Response,
  data: any[],
  page: number,
  limit: number,
  total: number
) => {
  return res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  });
};
