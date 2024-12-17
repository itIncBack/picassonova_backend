import 'express';

declare global {
  namespace Express {
    interface Request {
      currentUserId?: string;
    }
  }
}
