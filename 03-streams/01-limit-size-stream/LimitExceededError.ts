class LimitExceededError extends Error {
  code = 'LIMIT_EXCEEDED';

  constructor(limit: number) {
    super(`Limit ${limit} bytes has been exceeded.`);

    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default LimitExceededError;
