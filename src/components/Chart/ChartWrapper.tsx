import * as React from 'react';
import {
  useSelectedDimensions,
  useSelectedFileRun,
  useSelectedRuns,
} from '../../providers/FilesProvider';
import Chart from './Chart';

const ChartWrapper: React.FC = () => {
  const fileRun = useSelectedFileRun();
  const runs = useSelectedRuns();
  const selectedDimensions = useSelectedDimensions();

  return React.useMemo(
    () =>
      fileRun && runs && selectedDimensions ? (
        <React.Fragment
          key={
            JSON.stringify(fileRun.header) + JSON.stringify(selectedDimensions)
          }
        >
          <Chart runs={runs} dimensions={selectedDimensions} />
          <div id="graph" />
        </React.Fragment>
      ) : (
        <></>
      ),
    [runs, selectedDimensions]
  );
};

export default ChartWrapper;
