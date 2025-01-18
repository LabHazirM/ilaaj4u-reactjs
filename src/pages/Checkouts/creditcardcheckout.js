import React from 'react';
import { Container, Card, CardBody, Button } from 'reactstrap';
import creditCardFailedImage from '../../assets/images/CREDITCARDFAILED.png';

const CreditCardCheckout = () => {
  return (
    <div className="page-background" style={{ backgroundImage: "url('https://media.istockphoto.com/id/1406927873/vector/subtle-gradient-blend-background.jpg?s=612x612&w=0&k=20&c=QobMWoFJTszTReSo6am7A-vlEygNVM9S0C4zQAzyPUE=')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="credit-card-checkout">
          <Card className="p-3">
            <CardBody className="d-flex flex-column justify-content-center align-items-center">
              <img
                src={creditCardFailedImage}
                alt="Card"
                className="mb-3"
                style={{
                  height: 'auto', // Make height auto to maintain aspect ratio
                  width: '100%', // Take full width of container
                  maxWidth: '250px', // Limit maximum width to maintain image quality
                }}
              />
              <h6 className="fw-bold">Payment Failed</h6>
              <p className="card-text text-center">
                Your transaction has failed due to some technical <br />error.
                Please try again.
              </p>
              <br />
              <Button className="w-50" color="primary">
                Make Payment
              </Button>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default CreditCardCheckout;