import LimitSizeStream from './LimitSizeStream';
import stream from 'stream';
import fs from 'fs';

const arr = [
  {
    name: 'Robert',
    age: 20,
  },
  {
    name: 'Monika',
    age: 25,
  },
  () => {},
];

// const limitedStream = new LimitSizeStream({ limit: 8, objectMode: true }); // 8 байт
// const outStream = stream.Readable.from(arr).pipe(limitedStream);

const limitedStream = new LimitSizeStream({ limit: 8, encoding: 'utf-8' }); // 8 байт
const outStream = fs.createWriteStream('out.txt');

limitedStream.pipe(outStream);

limitedStream.write('hello'); // 'hello' - это 5 байт, поэтому эта строчка целиком записана в файл

setTimeout(() => {
  limitedStream.write('world'); // ошибка LimitExceeded! в файле осталось только hello
}, 10);
