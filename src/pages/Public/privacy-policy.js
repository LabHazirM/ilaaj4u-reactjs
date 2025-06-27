import React, { Component } from "react";
import MetaTags from "react-meta-tags";

import { Container, Row, Card, CardBody } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

class PrivacyPolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>PrivacyPolicy | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <h4  className="mb-3">PrivacyPolicy</h4>
            <Card>
              <CardBody>
                <Row className="g-0">
                  <div className="p-3">
                    <div className="w-100">
                      <div>
                        <p  className="text-muted font-size-14"><span className="text-primary"><strong>Lab Hazir</strong></span> values your privacy. This Privacy Policy explains how we collect, use, and protect your personal and health-related information when you use our platform for booking lab tests or registering as a lab partner. <br/><hr></hr><br/>
                        <strong>1.	What Information We Collect</strong><br></br>
                        We may collect various types of information including, from users (patients): their name, phone number, email, test booking details, location, gender, other optional personal information, and test results received from labs. From labs, we may collect the lab name, contact information, relevant documents, bank account details for payment settlements, as well as information about tests offered, pricing, and availability. Additionally, certain data is collected automatically such as IP addresses, browser or device information, and site usage behavior through cookies or analytics tools.
                        <br/><br/>
                        <strong>2.	How We Use This Information</strong><br></br>
                        We use your data to process test bookings and deliver reports, connect patients with registered labs, share relevant details with labs or OHSPs, send booking confirmations and result alerts, improve our services and support, and comply with legal or government requirements such as COVID reporting.
                         <br/><br/>
                        <strong>3.	Sharing of Information</strong><br></br>
                        We only share your data when necessary, such as with partner labs for test fulfillment, with government bodies if legally required (e.g., for positive reportable diseases), with OHSPs (Online Healthcare Solution Providers) for clinical oversight, and with third-party payment processors to facilitate transactions. We never sell your personal information.
                        <br/><br/>
                        <strong>4.	Your Consent</strong><br></br>
                        By using <span className="text-primary"><strong>Lab Hazir</strong></span> and submitting your information, you agree to:
                        <ul><li>Our access and use of your personal and health data to provide services</li>	
                        <li>Sharing your lab results with healthcare partners or authorities (where required)</li></ul>	
                        <strong>5.	Data Security</strong><br></br>
                        We take steps to protect your data through encrypted connections (SSL), secure databases with access control, and staff confidentiality agreements. However, despite our best efforts, no system is entirely foolproof, so we advise using <span className="text-primary"><strong>Lab Hazir</strong></span> at your own discretion.
                        <br/><br/>
                        <strong>6.	Your Rights</strong><br></br>
                        You can view or update your personal information, request the deletion of your account (unless it is required for legal purposes), withdraw your consent by writing to us, and opt out of promotional messages. For any such requests, please contact us at: <span className="text-primary"><strong> info@labhazir.com </strong></span>
                        <br/><br/>
                        <strong>7.	Cookies and Tracking</strong><br></br>
                        We use cookies and tools like Google Analytics to improve your experience. You can control cookies via your browser settings.
                        <br/><br/>
                        <strong>8.	Payment Information</strong><br></br>
                        When you make a payment through <span className="text-primary"><strong>Lab Hazir</strong></span>, your payment details (such as credit/debit card, Easypaisa account, or bank info) are processed securely through third-party payment providers, including Easypaisa and HBL Payment Gateway.
                        We do not store your full payment information on our servers. These third-party services may collect additional data for fraud prevention and transaction logging, according to their own privacy policies.
                        We recommend reviewing the respective privacy policies of Easypaisa and HBL Payment Gateway for more details on how your financial data is handled.
                        <br/><br/>
                        <strong>9.  External Links</strong><br></br>
                        Our platform may link to third-party websites. <span className="text-primary"><strong>Lab Hazir</strong></span> is not responsible for their content or data practices. Please review their privacy policies separately.
                        <br/><br/>
                        <strong>10. Policy Updates</strong><br></br>
                        We may change this policy from time to time. Updates will be posted here with a new effective date. Continued use of the platform means you accept the updated policy.
                        <br/><br/>
                        <strong>11. Contact Us</strong><br></br>
                        For any questions or privacy-related concerns, contact us at:
                        Email: 
                        <span><strong> info@labhazir.com </strong></span>
                        <br/><br/>
</p>                                                                             
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

PrivacyPolicy.propTypes = {};

const mapStateToProps = state => {
  const { error } = state;
  return { error };
};

export default withRouter(connect(mapStateToProps)(PrivacyPolicy));
