import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getStaffProfile } from "store/auth/staffprofile/actions";

class StaffSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      // address: "",
      // logo: "",
      // completedAppointments: "",
      // inProcessAppointments: "",
      // monthlyRevenue: "",
      // annualRevenue: "",
      // inProcessAppointments: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getStaffProfile(this.state.user_id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.success !== prevProps.success) {
      this.setState({
        name: this.props.success?.name || "",
        email: this.props.success?.email || "",
        // other properties
      });
    }
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
                  <div className="pt-4">
                    <Row>
                      <Col xs="6">
                        <h5 className="font-size-15 text-truncate">
                          {this.state.name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.email}
                        </p>
                      </Col>
                      <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={"/staff-profile"}
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                        </div>
                      </Col>
                      {/* <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={"/csr-checkout"}
                            className="btn btn-primary btn-sm"
                          >
                            Online Booking{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                        </div>
                      </Col> */}

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
            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium font-size-18">
                        Book an Appointment for:
                      </p>
                      <h4 className="mb-0 text-danger font-size-14">Existing Patients <i className={"mdi mdi-arrow-right-bold font-size-14"} /></h4>
                    </div>
                    <div className="text-center py-2 pl-3 pr-4">
                      <button
                        className="btn btn-primary font-size-14"
                        onClick={() => {
                          const url = this.props.match.params.guest_id
                            ? `/patients-list/${this.props.match.params.guest_id}`
                            : `/patients-list`

                          // Perform any additional actions or navigation logic here

                          // For navigation, you can use react-router-dom's history or other navigation methods
                          this.props.history.push(url);
                        }}
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium font-size-18">Book an Appointment for:</p>
                      <h4 className="mb-0 text-danger font-size-14">New Patients  <i className={"mdi mdi-arrow-right-bold font-size-14"} /></h4>
                    </div>
                    <div className="text-center py-2 pl-3 pr-4">
                      <button
                        className="btn btn-primary font-size-14"
                        onClick={() => {
                          const url = this.props.match.params.guest_id
                            ? `/register/${this.props.match.params.guest_id}`
                            : `/register`

                          // Perform any additional actions or navigation logic here

                          // For navigation, you can use react-router-dom's history or other navigation methods
                          this.props.history.push(url);
                        }}
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Monthly Revenue</p>
                      <h4 className="mb-0"> */}
            {/* Converting number to thousands separator string for readability */}
            {/* $
                        {this.state.monthlyRevenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-archive-in font-size-24"} />
                      </span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col> */}

            {/* <Col md="6">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Annual Revenue</p> */}
            {/* Converting number to thousands separator string for readability */}
            {/* <h4 className="mb-0">
                        $
                        {this.state.annualRevenue
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </h4>
                    </div>
                    <div className="mini-stat-icon avatar-sm rounded-circle bg-primary align-self-center">
                      <span className="avatar-title">
                        <i className={"bx bx-archive-in font-size-24"} />
                      </span>
                    </div>
                  </div> */}
            {/* </CardBody>
              </Card> */}
            {/* </Col> */}
          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

StaffSummary.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getStaffProfile: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = state => {
  const { error, success } = state.StaffProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getStaffProfile })(withTranslation()(StaffSummary))
);
