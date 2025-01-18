import React, { Component } from "react";
import PropTypes from "prop-types";

import { Row, Col, Card, CardBody } from "reactstrap";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

import profileImg from "../../assets/images/profile-img.png";

// actions
import { getStaffProfile } from "store/auth/staffprofile/actions";

class FinanceAdminSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      // approvedLabs: "",
      // pendingLabs: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getStaffProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        // name: this.props.success.name,
        // email: this.props.success.email,
        // approvedLabs: this.props.success.approved_labs,
        // pendingLabs: this.props.success.pending_labs,
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
                      {/* <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={"/activity-log-finance-admin"}
                            className="btn btn-primary btn-sm"
                          >
                            Activity Log{" "}
                            <i className="mdi mdi-arrow-right ms-1" />
                          </Link>
                        </div>
                      </Col> */}
                      {/* <Col xs="6">
                        <div className="mt-2">
                          <Link
                            to={"/financeadmin-profile"}
                            className="btn btn-primary btn-sm"
                          >
                            View Profile{" "}
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
        {/* <Col xl="8">
          <Row>
            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Assigned Audits</p>
                      <h4 className="mb-0">0</h4>
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

            <Col md="12">
              <Card className="mini-stats-wid">
                <CardBody>
                  <div className="d-flex">
                    <div className="flex-grow-1">
                      <p className="text-muted fw-medium">Completed Audits</p>
                      <h4 className="mb-0">0</h4>
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
          </Row>
        </Col> */}
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
  getStaffProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.StaffProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, { getStaffProfile })(
    withTranslation()(FinanceAdminSummary)
  )
);
