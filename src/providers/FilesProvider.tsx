import * as React from 'react';
import { BlobItem } from '@azure/storage-blob';
import { AzureBlobStorage } from '../services/azure-blob-storage';
import {
  InfoFile,
  InfoFileParser,
  InfoFileRun,
} from '../services/info-file-parser';
import { Run, RunFileParser } from '../services/run-file-parser';

const FROM_CACHE = false;

interface FilesProviderState {
  infoFiles: BlobItem[];
  activeInfoFile: BlobItem | null;
  infoFilesResolved: { [name: string]: InfoFile };
  activeRun: InfoFileRun | null;
  runsResolved: { [name: string]: Run[] };
  activeDimensions: [number, number, number];
}

interface FilesProviderContext {
  readonly state: FilesProviderState;
  setActiveInfoFile: (activeInfoFile: BlobItem) => void;
  setActiveRun: (run: InfoFileRun) => void;
  setSelectedDimensions: (activeDimensions: [number, number, number]) => void;
}

const FilesProviderInitialState: FilesProviderState = {
  infoFiles: [],
  activeInfoFile: null,
  infoFilesResolved: {},
  activeRun: null,
  runsResolved: {},
  activeDimensions: [0, 1, 2],
};

export const FilesContext = React.createContext<FilesProviderContext>(
  {} as FilesProviderContext
);

export const useSelectedFileRun = () => {
  const {
    state: { activeInfoFile, infoFilesResolved },
  } = React.useContext(FilesContext);

  const infoFile: InfoFile | null = React.useMemo(() => {
    const { name } = activeInfoFile || { name: null };

    if (!name || !infoFilesResolved.hasOwnProperty(name)) {
      return null;
    }

    return infoFilesResolved[name];
  }, [activeInfoFile, infoFilesResolved]);

  return infoFile;
};

export const useSelectedRuns = () => {
  const {
    state: { activeRun, runsResolved },
  } = React.useContext(FilesContext);

  const runs: Run[] | null = React.useMemo(() => {
    const { fileName } = activeRun || { fileName: null };

    if (!fileName || !runsResolved.hasOwnProperty(fileName)) {
      return null;
    }

    return runsResolved[fileName];
  }, [activeRun, runsResolved]);

  return runs;
};

export const useSelectedDimensions = () => {
  const {
    state: { activeDimensions },
  } = React.useContext(FilesContext);

  return React.useMemo(() => {
    return activeDimensions;
  }, [activeDimensions]);
};

const FilesContextProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<FilesProviderState>({
    ...FilesProviderInitialState,
  });

  React.useEffect(() => {
    (async () => {
      const infoFiles = await AzureBlobStorage.getInfoFiles(FROM_CACHE);
      setState((prevState) => ({
        ...prevState,
        infoFiles: infoFiles.sort(({ name }, { name: nameB }) =>
          name.localeCompare(nameB)
        ),
      }));
    })();
  }, [setState]);

  React.useEffect(() => {
    const { activeInfoFile, infoFilesResolved } = state;
    const { name } = activeInfoFile || { name: '' };

    if (activeInfoFile !== null && !infoFilesResolved.hasOwnProperty(name)) {
      (async () => {
        const contents = await AzureBlobStorage.downloadFile(name, FROM_CACHE);
        const fileInfo = InfoFileParser.toInfoFile(contents);
        setState((prevState) => ({
          ...prevState,
          infoFilesResolved: {
            ...prevState.infoFilesResolved,
            [name]: fileInfo,
          },
        }));
      })();
    }
  }, [state.activeInfoFile, state.infoFilesResolved, setState]);

  React.useEffect(() => {
    const { activeRun, runsResolved } = state;
    const { fileName } = activeRun || { fileName: '' };

    if (activeRun !== null && !runsResolved.hasOwnProperty(fileName)) {
      (async () => {
        const contents = await AzureBlobStorage.downloadRunFile(
          fileName,
          FROM_CACHE
        );
        const { activeRun } = state;
        const { numOfDimensions } = activeRun || { numOfDimensions: 0 };
        const run = RunFileParser.toRun(contents, numOfDimensions);
        setState((prevState) => ({
          ...prevState,
          runsResolved: {
            ...prevState.runsResolved,
            [fileName]: run,
          },
        }));
      })();
    }
  }, [state.activeRun, state.runsResolved, setState]);

  const setActiveInfoFile = React.useCallback(
    (activeInfoFile) => {
      setState((prevState) => ({
        ...prevState,
        activeInfoFile,
      }));
    },
    [setState]
  );

  const setActiveRun = React.useCallback(
    (activeRun) => {
      setState((prevState) => ({
        ...prevState,
        activeRun,
        activeDimensions: [0, 1, 2],
      }));
    },
    [setState]
  );

  const setSelectedDimensions = React.useCallback(
    (activeDimensions: [number, number, number]) => {
      setState((prevState) => ({
        ...prevState,
        activeDimensions,
      }));
    },
    [setState]
  );

  const providerState: FilesProviderContext = React.useMemo(
    () => ({
      state,
      setActiveInfoFile,
      setActiveRun,
      setSelectedDimensions,
    }),
    [state, setActiveInfoFile, setActiveRun, setSelectedDimensions]
  );

  return (
    <FilesContext.Provider value={providerState}>
      {children}
    </FilesContext.Provider>
  );
};

export default FilesContextProvider;
