import { ZodError } from 'zod';

export function validateBody(schema) {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      next(err instanceof ZodError ? err : err);
    }
  };
}

export function validateQuery(schema) {
  return (req, _res, next) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function validateParams(schema) {
  return (req, _res, next) => {
    try {
      req.params = schema.parse(req.params);
      next();
    } catch (err) {
      next(err);
    }
  };
}
