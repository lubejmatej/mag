interface InfoFileHeader {
  suite: string;
  funcId: number;
  funcName: string;
  maximization: boolean;
  algId: string;
  algInfo: string;
  lowerbound: number[];
  upperbound: number[];
}

export interface InfoFileRun {
  fileName: string;
  numOfDimensions: number;
}

export interface InfoFile {
  header: InfoFileHeader;
  runs: InfoFileRun[];
}

const parseStringValue = (value: string) => {
  const matches = value.match(/(?<=").*?(?=")/gs);
  return matches && matches.length ? matches[0] : '';
};

const parseIntValue = (value: string) => {
  const numberString = value.replace(/ /g, '');
  let parsedNumber = -1;
  try {
    parsedNumber = parseInt(numberString, 10);
  } catch (e) {
    console.error(e);
  }
  return parsedNumber;
};

const parseInfoFileHeader = (line: string): [InfoFileHeader, number] => {
  const header: Partial<InfoFileHeader> = {};
  let dimension = -1;
  const lines = line.split(', ');
  for (let data of lines) {
    try {
      const splitData = data.split('=');
      if (splitData.length < 2) {
        continue;
      }
      const name = splitData[0].replace(/ /g, '');
      const value = splitData[1];

      switch (name) {
        case 'DIM': {
          dimension = parseIntValue(value);
          break;
        }
        case 'algId':
        case 'algInfo':
        case 'funcName':
        case 'suite': {
          header[name] = parseStringValue(value);
          break;
        }
        case 'funcId': {
          header[name] = parseIntValue(value);
          break;
        }
        case 'maximization': {
          header.maximization = parseStringValue(value) === 'T';
          break;
        }
        case 'upperbound':
        case 'lowerbound': {
          header[name] = parseStringValue(value)
            .split(' ')
            .map((n) => parseFloat(n));
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return [header as InfoFileHeader, dimension];
};

const parseInfoFileSubheader = (line: string): number => {
  let dimension = -1;
  const lines = line.split(', ');
  for (let data of lines) {
    try {
      const splitData = data.split('=');
      if (splitData.length < 2) {
        continue;
      }
      const name = splitData[0].replace(/ /g, '');
      const value = splitData[1];

      switch (name) {
        case 'DIM': {
          dimension = parseIntValue(value);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  return dimension;
};

const parseInfoFileData = (line: string) => {
  const splitData = line.split(', ');
  return splitData.length ? splitData[0] : '';
};

export abstract class InfoFileParser {
  static toInfoFile(contents: string): InfoFile {
    const infoFile: Partial<InfoFile> = { runs: [] };
    const lines = contents.split('\n');

    for (let i = 0; i < lines.length; i += 3) {
      if (i === 0) {
        const [header, numOfDimensions] = parseInfoFileHeader(lines[i]);
        infoFile.header = header;

        const fileName = parseInfoFileData(lines[i + 2]);

        infoFile.runs?.push({
          fileName,
          numOfDimensions,
        });
      } else {
        const numOfDimensions = parseInfoFileSubheader(lines[i]);
        const fileName = parseInfoFileData(lines[i + 2]);

        infoFile.runs?.push({
          fileName,
          numOfDimensions,
        });
      }
    }

    return infoFile as InfoFile;
  }
}
