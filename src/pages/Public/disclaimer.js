import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import { Container, Row, Card, CardBody } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

class Disclaimer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Disclaimer | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <h4  className="mb-3">Disclaimer</h4>
            <Card>
              <CardBody>
                <Row className="g-0">
                  <div className="p-3">
                    <div className="w-100">
                      <div>
                        <p  className="text-muted font-size-14"><span className="text-primary"><strong>Lab Hazir</strong></span> is an online market place that connects patients with different laboratories for testing for wellness monitoring 
                        and does not guarantee a state of health. Results provided to you are for informational purposes only and not intended to replace the care of a medical practitioner. 
                        We do not diagnose, treat or cure medical conditions. <br/><br/>
                        <span className="text-primary"><strong>Lab Hazir</strong></span> does not replace the care of a medical practitioner or counselor and does not recommend self-diagnosis or self-medication. 
                        Depending on the nature of your testing, if you receive a <strong>&quot;positive&quot;</strong> or <strong>&quot;indeterminate result&quot;</strong>, confirmatory testing may be recommended and 
                        may involve additional charges. You will be encouraged to seek medical attention for additional follow up.</p>
                        
                        <p className="text-muted font-size-14">There is always a small possibility of an error or failure in laboratory testing. This is inherent to complex testing in any laboratory. Extensive measures are taken to avoid these <strong>errors**</strong> by the Laboratories. 
                            As a client of Lab Hazir, you have access to our extensive list of Laboratories and Diagnostic Centers. </p>
                        
                        <p className="text-muted font-size-14"><strong>**False negative</strong> results can have two possible meanings; a person can be infected, but their body has not yet produced the appropriate indicators or your body is producing the appropriate indicators but for some reason the test failed to detect it. <strong>**False positive</strong> result can indicate that you tested positive for the appropriate indicators, when in fact, you are negative. Errors could also be broken test tubes, lost specimens, etc.</p>

                        <p className="text-muted font-size-14"><span className="text-primary"><strong>Lab Hazir</strong></span> shall not be liable to you or anyone else for loss or injury caused in whole or part by procuring, compiling, interpreting, delivering, or reporting information through this website. Also, in no event shall Lab Hazir be held liable to you or anyone else for any decisions made or action taken or not taken by you in reliance on such information.</p>
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

Disclaimer.propTypes = {};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(Disclaimer));
