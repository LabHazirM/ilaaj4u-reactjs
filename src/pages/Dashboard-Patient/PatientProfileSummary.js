import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getPatientProfile } from "store/auth/patientprofile/actions";

class PatientProfileSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      completedAppointments: "",
      inProcessAppointments: "",
      monthlyCost: "",
      annualCost: "",
    };
  }

  componentDidMount() {
    this.props.getPatientProfile(this.props.match.params.id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        email: this.props.success.email,
        address: this.props.success.address,
        completedAppointments: this.props.success.completed_appointments,
        inProcessAppointments: this.props.success.inprocess_appointments,
        monthlyCost: this.props.success.monthly_cost,
        annualCost: this.props.success.annual_cost,
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
                  </div>
                </Col>
                <Col xs="5" className="align-self-end">
                  <img src={profileImg} alt="" className="img-fluid" />
                </Col>
              </Row>
            </div>
            <CardBody className="pt-4">
              <Row>
                <Col sm="12">
                  <div className="pt-1">
                    <Row>
                      <Col xs="6">
                        <h5 className="font-size-15 text-truncate">
                          {this.state.name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.email}
                        </p>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.address}
                        </p>
                      </Col>
                      <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={
                              "/dashboard-patient/" +
                              this.props.match.params.id +
                              "/profile"
                            }
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </div>
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
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-list-check font-size-24"} />
                      </span>
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
                      <p className="text-muted fw-medium">
                        Appointments Inprocess
                      </p>
                      <h4 className="mb-0">
                        {this.state.inProcessAppointments}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-copy-alt font-size-24"} />
                      </span>
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
                      <p className="text-muted fw-medium">Monthly Cost</p>
                      <h4 className="mb-0">
                        {/* Converting number to thousands separator string for readability */}
                        $
                        {this.state.monthlyCost
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-archive-out font-size-24"} />
                      </span>
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
                      <p className="text-muted fw-medium">Annual Cost</p>
                      {/* Converting number to thousands separator string for readability */}
                      <h4 className="mb-0">
                        $
                        {this.state.annualCost
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-archive-out font-size-24"} />
                      </span>
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

PatientProfileSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getPatientProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.PatientProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getPatientProfile })(
    withTranslation()(PatientProfileSummary)
  )
);
