import { Col, Row, Spinner } from "react-bootstrap";

const PageSpinner = () => {
  return (
    <Row className="m-2">
      <Col lg={{ offset: 5 }}>
        <Spinner animation="border" role="status" className="center">
          <span className="visually-hidden">.. Loading ..</span>
        </Spinner>
      </Col>
    </Row>
  );
};

export default PageSpinner;
