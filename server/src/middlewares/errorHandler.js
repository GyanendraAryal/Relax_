import * as Sentry from '@sentry/node';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import env from '../config/env.js';
import logger from '../utils/logger.js';

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: `Route ${req.method} ${req.path} not found` },
  });
}

export function errorHandler(err, req, res, _next) {
  if (env.SENTRY_DSN && !err.isOperational) {
    Sentry.captureException(err);
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.flatten().fieldErrors,
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  logger.error({ err, path: req.path }, 'Unhandled error');

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    },
  });
}
