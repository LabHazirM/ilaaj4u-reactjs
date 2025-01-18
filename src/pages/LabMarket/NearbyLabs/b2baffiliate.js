import React from "react";
import affiliate from "../../../assets/images/affiliate.jpg";
import { Link } from "react-router-dom";
import "../../../components/HorizontalLayout/horizontal-navbar.scss";
import {
  Button,
  Col,
  Container,
  Row,
} from "reactstrap";

const Contact = () => {
  const containerStyle = {
    height: "300px",
    backgroundImage: `url(${affiliate})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    marginTop: "80px", // Adjust the top margin as needed
  };

  const contentStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "white",
    textAlign: "center",
  };

  const buttonContainerStyle = {
    textAlign: "center",
    marginTop: "20px",
  };

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "20px",
  };

  return (
    <React.Fragment>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <h1 style={{ fontWeight: "bold" }}>BECOME OUR AFFILIATE PARTNER</h1>
          <h5 style={{ fontWeight: "bold" }}>Promoting Labhazir is rewarding and simple!</h5>
        </div>
      </div>
      <Container fluid style={{ marginBottom: "240px", padding: "0" }}>
        <div style={buttonContainerStyle}>
          <div>
            <Link to="/register-affiliate">
              <Button
                color="primary"
                className="btn-block btn btn-primary"
                style={buttonStyle}
              >
                <span style={{ fontSize: "20px", fontWeight: "bold" }}>Sign Up Now {" "}</span>
              </Button>
            </Link>
          </div>
          <div className="mt-3">
            <strong className="text-danger" style={{ fontSize: "20px", fontWeight: "bold" }}>Why you should join<br />the Labhazir Affiliate Marketing Partnership Program?</strong>
          </div>
          <hr style={{ borderTop: "2px solid red", width: "80%", margin: "0 auto", marginTop: "10px" }} />
          <div className="mt-3" style={{ marginLeft: "5%", marginRight: "5%" }}>
          <div className="d-flex align-items-center">
                <span>
                  <i className="mdi mdi-brightness-percent align-middle me-2" style={{ fontSize: "60px", color: "blue" }} />
                </span>
                <span>
                  <h4>Attractive Commission Rate</h4>
                  <p className="float-start">Up to 10%</p>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span>
                  <i className="mdi mdi-trending-up align-middle me-2" style={{ fontSize: "60px", color: "blue" }} />
                </span>
                <span>
                  <h4 className="float-start">Performance Visibility</h4><br></br>
                  <p className="float-start">Access user-friendly dashboards for you to view and analyse your traffic</p>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span>
                  <i className="mdi mdi-checkbox-multiple-marked-circle align-middle me-2" style={{ fontSize: "60px", color: "blue" }} />
                </span>
                <span>
                  <h4>Seamless & Hassle-free</h4>
                  <p className="float-start">Get started right away!</p>
                </span>
              </div>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <div className="mt-3">
            <strong className="text-danger" style={{ fontSize: "20px", fontWeight: "bold" }}>How does<br />Labhazir Affiliate Marketing Partnership Program work?</strong>
          </div>
          <hr style={{ borderTop: "2px solid red", width: "80%", margin: "0 auto", marginTop: "10px" }} />
          <div className="mt-3" style={{ marginLeft: "5%", marginRight: "5%" }}>
          <div className="d-flex align-items-center">
                <span>
                  <i className="mdi mdi-cursor-pointer align-middle me-2" style={{ fontSize: "60px", color: "blue" }} />
                </span>
                <span>
                  <h4>SIGN UP & retrieve your UNIQUE TRACKING LINK</h4>
                  {/* <p className="float-start">Up to 10%</p> */}
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span>
                  <i className="mdi mdi-laptop-chromebook align-middle me-2" style={{ fontSize: "60px", color: "blue" }} />
                </span>
                <span>
                  <h4 className="float-start">PROMOTE Labhazir with your unique tracking link on your website/ app</h4>
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span>
                  <i className="far fa-money-bill-alt align-middle me-2" style={{ fontSize: "50px", color: "blue" }} />
                </span>
                <span>
                  <h4>EARN up to 10% commission for every successful order</h4>
                </span>
              </div>
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <div>
            <span style={{ fontSize: "14px", }}>If you require further clarifications, You may write in to <span className="text-primary">labhazir@gmail.com</span> and we will get back to you as soon as possible.{" "}</span>
          </div>
        </div>
      </Container>
    </React.Fragment>
  );
};

export default Contact;