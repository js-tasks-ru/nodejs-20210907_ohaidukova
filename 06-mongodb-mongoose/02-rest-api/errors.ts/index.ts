export class ValidationError extends Error {
  code: number;

  constructor({ message, code }) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
  }
}

export class NotFoundError extends Error {
  code: number;

  constructor({ message, code }) {
    super(message);
    this.name = 'NotFoundError';
    this.code = code;
  }
}
