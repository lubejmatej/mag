import * as React from 'react';
import { Run } from '../../services/run-file-parser';

declare global {
  interface Window {
    vis: any;
  }
}

const Chart: React.FC<{
  runs: Run[];
  dimensions: [number, number, number];
}> = ({ runs, dimensions = [0, 1, 2] }) => {
  React.useEffect(() => {
    if (runs) {
      const data = new window.vis.DataSet();

      for (let i = 0; i < runs.length; i++) {
        const tgroup = parseFloat((i / runs.length).toFixed(4));

        const [xIndex, yIndex, zIndex] = dimensions;
        const x = runs[i].x[xIndex];
        const y = runs[i].x[yIndex];
        const z = runs[i].x[zIndex];

        const fx = runs[i].fx;
        data.add({
          x,
          y,
          z,
          filter: tgroup,
          style: fx,
        });
      }

      const options = {
        width: '100%',
        height: 'calc(100vh - 50px)',
        style: 'dot-color',
        showPerspective: true,
        showGrid: true,
        keepAspectRatio: true,
        verticalRatio: 1.0,
        animationInterval: 750, // milliseconds
        animationPreload: false,
        animationAutoStart: true,
        legendLabel: 'color value',
        cameraPosition: {
          horizontal: 2.85,
          vertical: 0.25,
          distance: 2.5,
        },
      };

      const graphEl$ = document.getElementById('graph');
      if (graphEl$) {
        graphEl$.innerHTML = '';
      }
      new window.vis.Graph3d(graphEl$, data, options);
    }
  }, [runs]);

  return <></>;
};

export default Chart;
