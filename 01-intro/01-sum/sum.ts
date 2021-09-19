function sum(...args: number[]): number {
  let result = 0;

  args.forEach((arg) => {
    if (typeof arg !== 'number') {
      throw new TypeError('Argumets should be numbers');
    }
    result += arg;
  });

  return result;
}

export default sum;
