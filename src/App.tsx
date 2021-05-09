import * as React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import ChartWrapper from './components/Chart/ChartWrapper';
import Dimensions from './components/Dimensions/Dimensions';
import Header from './components/Header/Header';
import InfoFileRuns from './components/InfoFileRuns/InfoFileRuns';
import InfoFiles from './components/InfoFiles/InfoFiles';

const App: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={2} className="p-0">
          <InfoFiles />
        </Col>
        <Col xs={2} className="p-0">
          <InfoFileRuns />
        </Col>
        <Col xs={1} className="p-0">
          <Dimensions />
        </Col>
        <Col xs={7} className="p-0">
          <Row className="m-0">
            <Col xs={12} className="p-0">
              <Header />
            </Col>
          </Row>
          <Row className="m-0">
            <Col xs={12} className="p-0">
              <ChartWrapper />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
