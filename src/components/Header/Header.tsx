import * as React from 'react';
import { useSelectedFileRun } from '../../providers/FilesProvider';
import './Header.css';

const Header: React.FC = () => {
  const infoFile = useSelectedFileRun();

  if (!infoFile) {
    return <></>;
  }

  const {
    header: { algInfo, funcName, maximization },
  } = infoFile;

  return (
    <div className="header">
      <h2 className="text-primary">
        {funcName}
        <span className="text-black-50">&nbsp;|&nbsp;</span>
        {algInfo}
        <span className="text-black-50">&nbsp;|&nbsp;</span>
        {maximization ? 'MAX' : 'MIN'}
      </h2>
    </div>
  );
};

export default Header;
