import { logger } from '../lib/logger.js';

// Known application error type — throw this in services for clean HTTP responses
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ValidationError extends AppError {
  constructor(message, details = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

// Central Express error handler — mount last in index.js
export function errorHandler(err, req, res, _next) {
  if (err instanceof AppError) {
    logger.warn({ err, path: req.path }, err.message);
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Zod validation errors from routes
  if (err.name === 'ZodError') {
    logger.warn({ err, path: req.path }, 'Validation failed');
    return res.status(400).json({
      error: 'Invalid request body',
      code: 'VALIDATION_ERROR',
      details: err.errors,
    });
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'A record with this value already exists.', code: 'CONFLICT' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found.', code: 'NOT_FOUND' });
  }

  // Unknown errors — log full stack, return generic message
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled server error');
  res.status(500).json({ error: 'Internal server error', code: 'INTERNAL_ERROR' });
}
