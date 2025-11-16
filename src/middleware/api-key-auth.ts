import type { NextFunction, Request, Response } from 'express';

const headerName = 'x-api-key';
const expectedKey = process.env.ANALYZE_API_KEY;

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  if (!expectedKey) {
    return next();
  }

  const providedKey = req.header(headerName);

  if (providedKey !== expectedKey) {
    res.status(401).json({
      error: {
        status: 401,
        message: 'Unauthorized request',
        code: 'API_KEY_INVALID',
      },
    });
    return;
  }

  next();
}

