import React, { Component } from "react";
import { Container, Card, CardBody, Button, Col } from 'reactstrap';
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import creditCardFailedImage from '../../assets/images/CREDITCARDFAILED.png';


class CardPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      encryptedData: "",
      loading: true,
      decryptedData: null,
      error: null,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const searchParams = new URLSearchParams(location.search);
    let encryptedData = searchParams.get("data");

    console.log("Encrypted Data before processing:", encryptedData);

    // Ensure correct padding at the beginning and end of encryptedData
    if (encryptedData) {
      if (!encryptedData.startsWith("=")) {
        encryptedData = "=" + encryptedData;
        console.log("After adding '=' at the start:", encryptedData);
      }
      if (!encryptedData.endsWith("=")) {
        encryptedData = encryptedData + "=";
        console.log("After adding '=' at the end:", encryptedData);
      }

      // Decode URL-encoded characters in encryptedData and replace spaces with plus signs
      encryptedData = decodeURIComponent(encryptedData).replace(/ /g, '+');
      console.log("After decoding and replacing spaces with '+':", encryptedData);
    } else {
      this.setState({
        loading: false,
        error: "No encrypted data found in URL parameter 'data'.",
      });
      return;
    }

    // Set encryptedData in state
    this.setState({ encryptedData });

    // API endpoint URL
    const apiUrl = "http://127.0.0.1:8000/api/patient/paymentsresponse/";

    // POST request to Django API
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: encryptedData }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("API response", responseData);
        this.setState({
          decryptedData: responseData.decrypted_data,
          loading: false,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({
          error: error.message,
          loading: false,
        });
      });
  }

  render() {
    const { loading, decryptedData, error } = this.state;

    return (
      <React.Fragment>
        <MetaTags>
          <title>Card Payment</title>
        </MetaTags>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : decryptedData ? (
            <div>
              {/* <p>Data decrypted successfully:</p> */}
              <div className="page-background" style={{backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="credit-card-checkout">
          <Card className="p-3">
            <CardBody className="d-flex flex-column justify-content-center align-items-center">
            <Col className="col-12 text-center">
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "2px solid green",
                        margin: "0 auto", // Center the circle
                        marginBottom: "20px",
                      }}
                    >
                      <i
                        className="fas fa-check"
                        style={{ color: "green", fontSize: "36px", borderRadius: "50%" }}
                      ></i>
                    </div>
                    <strong className="font-size-15 font-weight-bold mb-3">
                      We are pleased to inform you that,
                    </strong>
                    <p style={{ fontSize: "14px", color: "gray" }}>
                      the payment transaction has been successfully completed.
                    </p>
                    <strong className="font-size-15 font-weight-bold mb-3 text-danger">
                      Thank you for your payment!
                    </strong>
                  </Col>
            </CardBody>
          </Card>
        </div>
      </Container>
    </div>
            </div>
          ) : (
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
                      Your transaction has failed due to some technical <br />  
                     {/* <pre>{decryptedData}</pre> */}

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
          )}
        </div>
      </React.Fragment>
    );
  }
}

CardPayment.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};

export default withRouter(CardPayment);



// import React from 'react';
// import { Container, Card, CardBody, Button } from 'reactstrap';
// import creditCardFailedImage from '../../assets/images/CREDITCARDFAILED.png';

// const CreditCardCheckout = () => {
//   return (
//     <div className="page-background" style={{ backgroundImage: "url('https://media.istockphoto.com/id/1406927873/vector/subtle-gradient-blend-background.jpg?s=612x612&w=0&k=20&c=QobMWoFJTszTReSo6am7A-vlEygNVM9S0C4zQAzyPUE=')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
//       <Container className="d-flex justify-content-center align-items-center min-vh-100">
//         <div className="credit-card-checkout">
//           <Card className="p-3">
//             <CardBody className="d-flex flex-column justify-content-center align-items-center">
//               <img
//                 src={creditCardFailedImage}
//                 alt="Card"
//                 className="mb-3"
//                 style={{
//                   height: 'auto', // Make height auto to maintain aspect ratio
//                   width: '100%', // Take full width of container
//                   maxWidth: '250px', // Limit maximum width to maintain image quality
//                 }}
//               />
//               <h6 className="fw-bold">Payment Failed</h6>
//               <p className="card-text text-center">
//                 Your transaction has failed due to some technical <br />error.
//                 Please try again.
//               </p>
//               <br />
//               <Button className="w-50" color="primary">
//                 Make Payment
//               </Button>
//             </CardBody>
//           </Card>
//         </div>
//       </Container>
//     </div>
//   );
// };

// export default CreditCardCheckout;