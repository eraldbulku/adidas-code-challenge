import AppError from './AppError';

export default class BadFormatRequest extends AppError {
  constructor(...rest) {
    super(400, ...rest);
  }
}
