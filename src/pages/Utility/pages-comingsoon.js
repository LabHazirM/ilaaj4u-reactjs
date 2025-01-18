import React, { Component } from "react";
import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { Container, Row, Col } from "reactstrap";
import Countdown from "react-countdown";
import logo from "../../assets/images/logo-dark.png";
import maintanence from "../../assets/images/coming-soon.svg";

class PagesComingsoon extends Component {
  constructor() {
    super();
    this.renderer.bind(this);
  }

  // Function to generate a random future date
  getRandomFutureDate() {
    const currentDate = new Date();
    const randomFutureDate = new Date(
      currentDate.getTime() + Math.floor(Math.random() * 300) * 24 * 60 * 60 * 1000
    );
    return randomFutureDate;
  }

  renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // return <span>You are good to go!</span>;
      <>
          <div className="coming-box">
            {days} <span>Days</span>
          </div>{" "}
          <div className="coming-box">
            {hours} <span>Hours</span>
          </div>{" "}
          <div className="coming-box">
            {minutes} <span>Minutes</span>
          </div>{" "}
          <div className="coming-box">
            {seconds} <span>Seconds</span>
          </div>
        </>
    } else {
      return (
        <>
          <div className="coming-box">
            {days} <span>Days</span>
          </div>{" "}
          <div className="coming-box">
            {hours} <span>Hours</span>
          </div>{" "}
          <div className="coming-box">
            {minutes} <span>Minutes</span>
          </div>{" "}
          <div className="coming-box">
            {seconds} <span>Seconds</span>
          </div>
        </>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MetaTags>
          <title>Coming Soon | Labhazir - Dashboard</title>
        </MetaTags>
        <div className="home-btn d-none d-sm-block">
          <Link to="/" className="text-white">
            <i className="fas fa-home h2" />
          </Link>
        </div>

        <div className="my-5 pt-sm-5">
          <Container>
            <Row>
              <Col lg="12">
                <div className="text-center">
                  <Link to="/">
                    <img src={logo} alt="" height="20" />
                  </Link>
                  <Row className="justify-content-center mt-5">
                    <Col sm="4">
                      <div className="maintenance-img">
                        <img
                          src={maintanence}
                          alt=""
                          className="img-fluid mx-auto d-block"
                        />
                      </div>
                    </Col>
                  </Row>
                  <h4 className="mt-5">Let&apos;s get started with Labhazir</h4>
                  <p className="text-muted">
                    It will be as simple as Occidental; in fact, it will be Occidental.
                  </p>

                  <Row className="justify-content-center mt-5">
                    <Col md="8">
                      <div className="counter-number">
                        <Countdown
                          date={this.getRandomFutureDate()}
                          className="counter-number"
                          renderer={this.renderer}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default PagesComingsoon;
