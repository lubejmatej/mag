import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { BlobItem } from '@azure/storage-blob';
import DownloadIcon from '../../icons/DownloadIcon';
import { FilesContext } from '../../providers/FilesProvider';
import { AzureBlobStorage } from '../../services/azure-blob-storage';
import './InfoFiles.css';

const InfoFiles: React.FC = () => {
  const {
    state: { infoFiles, activeInfoFile },
    setActiveInfoFile,
  } = React.useContext(FilesContext);

  const onSetActiveInfoFileClick = React.useCallback(
    (e: MouseEvent, blobItem: BlobItem) => {
      e.preventDefault();

      setActiveInfoFile(blobItem);
    },
    [setActiveInfoFile]
  );

  const onDownloadInfoFile = React.useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
      blobItem: BlobItem
    ) => {
      e.preventDefault();
      e.stopPropagation();

      const { name } = blobItem;
      const downloadUrl = AzureBlobStorage.getDownloadUrl(name);
      window.open(downloadUrl, '_blank');
    },
    []
  );

  return (
    <ListGroup className="info-files-list-group">
      {infoFiles.length &&
        infoFiles.map((blobItem) => {
          const { name } = blobItem;
          const { name: selectedName } = activeInfoFile || { name: null };
          const additionalProps =
            selectedName === name
              ? {
                  variant: 'primary',
                }
              : {};

          return (
            <ListGroup.Item
              key={name}
              action
              onClick={(e: MouseEvent) => onSetActiveInfoFileClick(e, blobItem)}
              {...additionalProps}
            >
              <span>{name}</span>
              <span className="text-black-50">&nbsp;|&nbsp;</span>
              <a
                href={void 0}
                className="btn-download btn btn-sm btn-outline-primary p-0 px-1"
                onClick={(e) => onDownloadInfoFile(e, blobItem)}
              >
                <DownloadIcon />
              </a>
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
};

export default InfoFiles;
