import express from 'express';

export interface IMiddleware {
  add: () => (req: express.Request, res: express.Response, next: express.NextFunction) => void;
}
