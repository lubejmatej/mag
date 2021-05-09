export interface Run {
  fx: number;
  x: number[];
}

const parseFloatValue = (value: string) => {
  const numberString = value.replace(/ /g, '');
  let parsedNumber = -1;
  try {
    parsedNumber = parseFloat(numberString);
  } catch (e) {
    console.error(e);
  }
  return parsedNumber;
};

const parseLine = (line: string, dimensions: number) => {
  const values = line.split(' ');
  if (values.length !== 5 + dimensions) {
    return null;
  }

  const fx = parseFloatValue(values[1]);

  const x: number[] = [];

  for (let i = 5; i < values.length; i++) {
    x.push(parseFloatValue(values[i]));
  }

  return {
    x,
    fx,
  };
};

export abstract class RunFileParser {
  static toRun(contents: string, dimensions = 0): Run[] {
    const runs: Run[] = [];
    const lines = contents.split('\n');

    for (let i = 1; i < lines.length; i++) {
      const parsed = parseLine(lines[i], dimensions);

      if (parsed) {
        const { x, fx } = parsed;

        runs.push({
          x,
          fx,
        });
      }
    }

    return runs;
  }
}
