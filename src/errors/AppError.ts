export default class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, ...rest) {
    super(...rest);
    this.statusCode = statusCode;
  }
}
