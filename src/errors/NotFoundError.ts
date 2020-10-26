import AppError from './AppError';

export default class NotFoundError extends AppError {
  constructor(...rest) {
    super(404, ...rest);
  }
}
