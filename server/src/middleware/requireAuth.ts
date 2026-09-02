import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../services/auth.js';

// Extend Express's Request type with the fields this middleware attaches.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing Authorization: Bearer <token> header' });

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Like requireAuth, but never rejects — used on routes the marketing website
// (no login) and the app (logged in) both call, e.g. checkout. Attaches
// req.userId when a valid token is present and silently continues otherwise.
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (token) {
    try {
      const payload = verifyToken(token);
      req.userId = payload.sub;
      req.userRole = payload.role;
    } catch {
      // ignore — treat as a guest
    }
  }
  next();
}
