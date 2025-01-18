import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const Footer = () => {
  const isLargeScreen = window.innerWidth > 768;
  const isSmallScreen = window.innerWidth >= 576 && window.innerWidth <= 768;
  const isextraSmallScreen = window.innerWidth < 576;
  const largfixfooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "12px",
    display: "flex",
    justifyContent: "center",
  };
  const islargfixfooter = {
    position: "fixed",
    bottom: 0,
    width: "100%",
    backgroundColor: "#f8f9fa",
    fontSize: "6.5px",
    display: "flex",
    justifyContent: "center",
  };

  console.log("isLargeScreen:", isLargeScreen);
  console.log("isSmallScreen:", isSmallScreen);

  return (
    <footer className="footer">
      <Container fluid={true}>
        {isLargeScreen && (
          <Row>
            <Col md={4}>{new Date().getFullYear()} © Lab Hazir (Private) Limited</Col>
            <Col md={3}>
              <div className="text-sm-end d-none d-sm-block">
                <Link to="/disclaimer">
                  <span>Disclaimer</span>
                </Link>
              </div>
            </Col>
            <Col md={1}>
              <div className="text-sm-end d-none d-sm-block">
                <Link to="/about-us">
                  <span>About Us</span>
                </Link>
              </div>
            </Col>
            <Col md={2}>
              <div className="text-sm-end d-none d-sm-block">
                <Link to="/terms-conditions">
                  <span>Terms</span>
                </Link>
              </div>
            </Col>
            <Col md={1}>
              <div className="text-sm-end d-none d-sm-block">
                <a
                  href="https://www.linkedin.com/company/labhazir/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-linkedin bx-tada align-middle me-2 font-size-40" />{" "}
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100084984286550"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="bx bxl-facebook bx-tada align-middle me-2 font-size-40" />{" "}
                </a>
              </div>
            </Col>
          </Row>
        )}
{isSmallScreen && (
  <Row style={largfixfooter} className="footer">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-start">
              {new Date().getFullYear()} © Lab Hazir (Private) Limited
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <Link to="/disclaimer">
                <span>Disclaimer</span>
              </Link>
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <Link to="/about-us">
                <span>About Us</span>
              </Link>
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
            <p><a href="/LabHazir - Terms & Conditions.pdf" target="_blank" rel="noopener noreferrer">Terms</a></p>

            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <a
                href="https://www.linkedin.com/company/labhazir/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-linkedin bx-tada align-middle me-2 font-size-40" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100084984286550"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-facebook bx-tada align-middle me-2 font-size-40" />
              </a>
            </div>
          </Col>
        </Row>
)}
{isextraSmallScreen && (
  <Row style={islargfixfooter} className="footer">
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-start">
              {new Date().getFullYear()} © Lab Hazir (Private) Limited
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <Link to="/disclaimer">
                <span>Disclaimer</span>
              </Link>
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <Link to="/about-us">
                <span>About Us</span>
              </Link>
            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
            <p><a href="/LabHazir - Terms & Conditions.pdf" target="_blank" rel="noopener noreferrer">Terms</a></p>

            </div>
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="auto">
            <div className="text-sm-end">
              <a
                href="https://www.linkedin.com/company/labhazir/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-linkedin bx-tada align-middle me-2 font-size-40" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100084984286550"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bx bxl-facebook bx-tada align-middle me-2 font-size-40" />
              </a>
            </div>
          </Col>
        </Row>
)}
        
      </Container>
    </footer>
  );
};

export default Footer;
