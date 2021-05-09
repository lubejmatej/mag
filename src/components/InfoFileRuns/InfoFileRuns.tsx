import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { BlobItem } from '@azure/storage-blob';
import DownloadIcon from '../../icons/DownloadIcon';
import {
  FilesContext,
  useSelectedFileRun,
} from '../../providers/FilesProvider';
import { AzureBlobStorage } from '../../services/azure-blob-storage';
import { InfoFileRun } from '../../services/info-file-parser';
import './InfoFileRuns.css';

const InfoFileRuns = () => {
  const {
    state: { activeRun },
    setActiveRun,
  } = React.useContext(FilesContext);
  const infoFile = useSelectedFileRun();

  const onSetActiveInfoFileRunClick = React.useCallback(
    (e, run: InfoFileRun) => {
      e.preventDefault();
      setActiveRun(run);
    },
    []
  );

  const onDownloadRunInfoFile = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, run: InfoFileRun) => {
      e.preventDefault();
      e.stopPropagation();

      const { fileName } = run;
      const downloadUrl = AzureBlobStorage.getDownloadUrl(fileName);
      window.open(downloadUrl, '_blank');
    },
    []
  );

  if (!infoFile) {
    return <></>;
  }

  const { runs } = infoFile;

  return (
    <ListGroup className="info-file-runs-list-group">
      {runs.length &&
        runs.map((run) => {
          const { fileName, numOfDimensions } = run;
          const { fileName: selectedFileName } = activeRun || {
            fileName: null,
          };
          const additionalProps =
            fileName === selectedFileName
              ? {
                  variant: 'primary',
                }
              : {};

          return (
            <ListGroup.Item
              key={fileName}
              action
              onClick={(e: MouseEvent) => onSetActiveInfoFileRunClick(e, run)}
              {...additionalProps}
            >
              {fileName}
              <span className="text-black-50">&nbsp;|&nbsp;</span>
              DIM: {numOfDimensions}
              <span className="text-black-50">&nbsp;|&nbsp;</span>
              <a
                href={void 0}
                className="btn-download btn btn-sm btn-outline-primary p-0 px-1"
                onClick={(e) => onDownloadRunInfoFile(e, run)}
              >
                <DownloadIcon />
              </a>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
};

export default InfoFileRuns;
