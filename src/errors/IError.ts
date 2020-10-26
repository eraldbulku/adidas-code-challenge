import AppError from './AppError';
import NotFoundError from './NotFoundError';

export type IError = AppError | NotFoundError;
