import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getDoctorProfile } from "store/auth/doctorprofile/actions";

class DoctorProfile extends Component { 


  constructor(props) {
    super(props);
    this.state = {
      doctor_name: "",
      email: "",
      contact: "",
      referal_code: "",
      doctor_image:"",
      completedAppointments: "",
      inProcessAppointments: "",
      inProcessAppointments: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getDoctorProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        doctor_name: this.props.success.doctor_name,
        doctor_image: process.env.REACT_APP_BACKENDURL + this.props.success.doctor_image,
        referal_code: this.props.success.referal_code,
        email: this.props.success.email,
        contact: this.props.success.contact,
        completedAppointments: this.props.success.completed_appointments,
        inProcessAppointments: this.props.success.inprocess_appointments,
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
                          {this.state.doctor_name}
                        </h5>
                        <p className="text-muted mb-0 text-truncate">
                          {this.state.email}
                        </p>
                      </Col>
                      <Col xs="6">
                        <div className="mt-2">
                        <Link
                            to={"/doctor-profile"}
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
        <Row>
           <Col xs="7">
                  <div className="text-primary p-3">
                    <p>Your Referal Code <b>{this.state.referal_code}</b></p>
                  </div>
                </Col>
        </Row>
          
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

          </Row>
        </Col>
      </React.Fragment>
    );
  }
}

DoctorProfile.propTypes = {
  t: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
  getDoctorProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.DoctorProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getDoctorProfile })(withTranslation()(DoctorProfile))
);
