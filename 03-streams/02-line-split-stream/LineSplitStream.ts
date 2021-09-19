import stream, { TransformCallback, TransformOptions } from 'stream';
import os from 'os';
import { runInThisContext } from 'vm';

const getSplitedData = (
  str: string,
  delim: string
): { lines: string[]; rest: string } => {
  let lines: string[];
  let rest = '';

  let lastPosDelim = str.lastIndexOf(delim);
  rest = ~lastPosDelim ? str.slice(lastPosDelim + 1) : str;
  lines = ~lastPosDelim ? str.slice(0, lastPosDelim).split(delim) : [];

  return { lines, rest };
};

class LineSplitStream extends stream.Transform {
  lines: string[];
  rest = '';

  constructor(options: TransformOptions) {
    super(options);
  }

  _transform(
    chunk: Buffer | string | any,
    encoding: BufferEncoding,
    callback: TransformCallback
  ) {
    let splitedData = getSplitedData(
      this.rest + chunk.toString('utf-8'),
      os.EOL
    );

    this.rest = splitedData.rest;

    if (splitedData.lines.length) {
      splitedData.lines.forEach((line) => {
        this.push(line);
      });
    }
    callback(null);
  }

  _flush(callback: TransformCallback) {
    callback(null, this.rest);
  }
}

export default LineSplitStream;
