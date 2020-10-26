import express from 'express';
import {IMiddleware} from "./IMiddleware";
import {IError} from '../errors/IError';

const success = function(msg: string, data = {}) {
  this.status(200).json({success: true, msg, data});
};

const error = function(error: IError, data = {}) {
  this.status(error.statusCode || 400).json({success: false, msg: error.message, data});
}

class ResponseHandlersMiddleware implements IMiddleware {
  public add = () => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
      (res as any).success = success.bind(res);
      (res as any).error = error.bind(res);
      next();
    }
  };
}

export default new ResponseHandlersMiddleware();
