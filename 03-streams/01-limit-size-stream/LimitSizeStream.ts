import stream, { TransformOptions, TransformCallback } from 'stream';
import LimitExceededError from './LimitExceededError';

interface ILimitSizeStreamOptions extends TransformOptions {
  limit: number;
}

const getEatableForBuffer = (data: any): Buffer | string => {
  switch (data) {
    case data instanceof Buffer:
    case typeof data === 'string':
      return data;
    case typeof data === 'object':
      return JSON.stringify(data);
    default:
      return String(data);
  }
};

class LimitSizeStream extends stream.Transform {
  limit: number;
  currentSize = 0;
  error: null | LimitExceededError = null;

  constructor(options: ILimitSizeStreamOptions) {
    super(options);

    this.limit = options.limit;
  }

  _transform(
    chunk: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    this.currentSize += Buffer.from(getEatableForBuffer(chunk)).byteLength;
    if (this.currentSize > this.limit)
      this.error = new LimitExceededError(this.limit);

    callback(this.error, chunk);
  }
}

export default LimitSizeStream;
