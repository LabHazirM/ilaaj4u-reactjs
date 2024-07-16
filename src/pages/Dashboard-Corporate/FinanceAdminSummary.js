import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import {
  // updateCorporateProfile,
  getCorporateProfile,
  // getCorporateProfileSuccess,
} from "../../store/actions";

class FinanceAdminSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      approvedLabs: "",
      pendingLabs: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getCorporateProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        logo: process.env.REACT_APP_BACKENDURL + this.props.success.logo,
        completedAppointments: this.props.success.completed_appointments,
        inProcessAppointments: this.props.success.inprocess_appointments,
        // national_taxation_no: this.props.success.national_taxation_no,
        // email: this.props.success.email,
        // phone: this.props.success.phone,
        // landline: this.props.success.landline,
        address: this.props.success.address,
        city: this.props.success.city,
        payment_terms: this.props.success.payment_terms,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        {/* Welcome profile */}
        <Col xl="4">
          <Card className="overflow-hidden">
            <div className="bg-primary bg-soft">
              <Row>
                <Col xs="7">
                  <div className="text-primary p-3">
                    <h5 className="text-primary">Welcome Back !</h5>
                    <p>Lab Hazir Dashboard</p>
                    <Link
                            to={"/corporate-profile"}
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img src={profileImg} alt="" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody>

<Row className="pt-2">
  <Col xs="4">
  <div className="avatar-md profile-user-wid">
<img
src={this.state.logo}
alt="Corporate Logo"
className="text-end"
style={{ maxWidth: '100%', maxHeight: '100%', float: 'end' }}                  />
</div>
    
  </Col>
  <Col xs="8">
  <h5 className="font-size-15 text-truncate">
      {this.state.name}
    </h5>
    <p className="text-muted mb-0 text-truncate">
      {this.state.address}
    </p>
  </Col>
</Row>

</CardBody>
          </Card>
        </Col>
   {/* Revenue and Appointment Details */}
   <Col xl="8">
          <Row>
            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Appointments Completed
                      </p>
                      <h4 className="mb-0">
                        {this.state.completedAppointments}
                      </h4>
                    </div>
                    <Link to="/corporate-lab-appointments">
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-list-check font-size-24"} />
                      </span>
                    </div>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">
                        Appointments Inprocess
                      </p>
                      <h4 className="mb-0">
                        {this.state.inProcessAppointments}
                      </h4>
                    </div>
                    <Link to="/corporate-lab-appointments">
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-copy-alt font-size-24"} />
                      </span>
                    </div>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                <div className="d-flex">
                    <div className="flex-grow-1">
                      {/* <p className="text-muted fw-medium">
                      Labs Review
                      </p> */}
                      <h5 className="text-center mt-3">
                      Lab List
                      </h5>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                    <Link to="/corporate-labs-list">
                        <span className="avatar-title">
                        <i className={"mdi mdi-note-search font-size-24"} />
                      </span>                       
                       </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                <div className="d-flex">
                    <div className="flex-grow-1">
                      {/* <p className="text-muted fw-medium">
                      Appointments History
                      </p> */}
                      <h5 className="text-center mt-3">
                      Payment Form
                      </h5>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                    <Link to="/corporate-payment-form">
                        <span className="avatar-title">
                        <i className={"bx bx-history font-size-24"} />
                      </span>                      
                         </Link> 
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

FinanceAdminSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getCorporateProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.CorporateProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getCorporateProfile })(
    withTranslation()(FinanceAdminSummary)
  )
);
