import { Container, Row, Col } from 'react-bootstrap';

function HomePage() {
  return (
    <Container className="text-center py-5">
      <Row>
        <Col>
          <h1>Welcome to HelloKitty Cafe</h1>
          <p>Enjoy a cute and comfy shopping experience!</p>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
