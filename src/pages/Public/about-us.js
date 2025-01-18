import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import { Container, Row, Card, CardBody } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>About Us | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <h4  className="mb-3">About Us</h4>
            <Card>
              <CardBody>
                <Row className="g-0">
                  <div className="p-3">
                    <div className="w-100">
                      <div>
                        <p  className="text-muted font-size-14"><span className="text-primary"><strong>Lab Hazir</strong></span>, founded in <span className="text-primary">2022</span>, is a privately held business that is comprised of advanced degreed business professionals who wanted to offer direct to consumer access to pathology lab testing in a fast, discrete, and affordable way.</p>
                        
                        <p className="text-muted font-size-14">Our clients are comprised of people who are in need of laboratory testing, they like the convenience of our service and open market place to choose the lab. Lab Hazir ensures that our clients get as much information as they need to make the best testing choice. </p>
                        
                        <p className="text-muted font-size-14">Through our website and help section defining the basic info about each test, we strive to offer the most complete information. From pricing, to incubation periods, general disease information and testing requirements. </p>

                        <p className="text-muted font-size-14">Early detection of any disease is important so that treatment may begin as soon as possible and to assist with delaying the onset of serious complications.  Whether you want to take a preventive approach or need to monitor an existing condition, take this time explore the best lab on Lab Hazir that suits your needs.</p>
                      </div>
                    </div>
                  </div>
                </Row>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

AboutUs.propTypes = {};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(AboutUs));
