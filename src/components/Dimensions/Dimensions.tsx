import * as React from 'react';
import { ListGroup } from 'react-bootstrap';
import { FilesContext } from '../../providers/FilesProvider';
import './Dimensions.css';

const Dimensions: React.FC = () => {
  const {
    state: { activeRun, activeDimensions: stateActiveDimensions },
    setSelectedDimensions,
  } = React.useContext(FilesContext);
  const [activeDimensionsInner, setActiveDimensionsInner] = React.useState<
    [number, number, number]
  >([0, 1, 2]);
  const [inactiveDimensions, setInactiveDimensions] = React.useState<number[]>(
    []
  );

  React.useMemo(() => { setActiveDimensionsInner(stateActiveDimensions) }, [stateActiveDimensions])
  const activeDimensions = React.useMemo(() => stateActiveDimensions || activeDimensionsInner, [stateActiveDimensions, activeDimensionsInner]);

  const onSetDimension = React.useCallback(
    (e, dimension) => {
      e.preventDefault();

      const isActive = activeDimensions.includes(dimension);

      const handleActive = () => {
        if (inactiveDimensions.length === 0) {
          const closest = activeDimensions.reduce((prev, curr) => {
            return Math.abs(curr - dimension) < Math.abs(prev - dimension)
              ? curr
              : prev;
          });
          const closestIndex = activeDimensions.findIndex((d) => d === closest);

          setActiveDimensionsInner(
            (prevState) =>
              [
                ...prevState.slice(0, closestIndex),
                dimension,
                ...prevState.slice(closestIndex + 1),
              ] as [number, number, number]
          );
        } else {
          const [inactiveIndex] = inactiveDimensions;

          const activeIndex = activeDimensions.findIndex(
            (d) => d === inactiveIndex
          );
          setActiveDimensionsInner(
            (prevState) =>
              [
                ...prevState.slice(0, activeIndex),
                dimension,
                ...prevState.slice(activeIndex + 1),
              ] as [number, number, number]
          );

          setInactiveDimensions((prevState) => [
            ...prevState.filter((d) => d !== inactiveIndex),
          ]);
        }
      };

      const handleInactive = () => {
        const isInactive = inactiveDimensions.includes(dimension);

        setInactiveDimensions((prevState) => [
          ...prevState.filter((d) => d !== dimension),
          ...(isInactive ? [] : [dimension]),
        ]);
      };

      if (!isActive) {
        handleActive();
      } else if (isActive) {
        handleInactive();
      }
    },
    [
      activeDimensions,
      setActiveDimensionsInner,
      inactiveDimensions,
      setInactiveDimensions,
    ]
  );

  React.useEffect(() => {
    if (inactiveDimensions.length === 0) {
      setSelectedDimensions(activeDimensionsInner.sort((a, b) => a - b));
    }
  }, [activeDimensionsInner, inactiveDimensions]);

  if (!activeRun) {
    return <></>;
  }

  const dimensions = Array.from(
    { length: activeRun.numOfDimensions },
    (_, i) => i
  );

  return (
    <ListGroup className="dimensions-list-group">
      {dimensions.length &&
        dimensions.map((dimension) => {
          const activeDimension = activeDimensions.includes(dimension);
          const inactiveDimension = inactiveDimensions.includes(dimension);

          const additionalProps = activeDimension
            ? {
                className: inactiveDimension ? 'text-line-through' : '',
                variant: 'success',
              }
            : {};

          return (
            <ListGroup.Item
              key={dimension}
              action
              onClick={(e: MouseEvent) => onSetDimension(e, dimension)}
              {...additionalProps}
            >
              DIM {dimension}
            </ListGroup.Item>
          );
        })}
    </ListGroup>
  );
};

export default Dimensions;
