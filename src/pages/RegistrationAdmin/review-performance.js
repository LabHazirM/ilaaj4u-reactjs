import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  FormGroup,
  Label,
} from "reactstrap";

import { isEmpty, map } from "lodash";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getReviewPerformance,
  getReviewPerformanceTest
} from "store/review-performance/actions";
import Flatpickr from 'react-flatpickr';


class ReviewPerformance extends Component {
  constructor(props) {
    super(props);
    const today = new Date();
    const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    this.state = {
      ReviewPerformance: [],
      ReviewPerformanceTest: [],
      start_date: startOfDay,
      end_date: endOfDay,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.fetchPerformanceData();
  }

  fetchPerformanceData = () => {
    const { onGetReviewPerformance, onGetReviewPerformanceTest } = this.props;
    const { start_date, end_date } = this.state;
    onGetReviewPerformance({ start_date, end_date });
    onGetReviewPerformanceTest({ start_date, end_date });
  };

  handleDateChange = (date, field) => {
    if (date) {
      const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0, 0, 0
      ));
  
      this.setState({ [field]: utcDate }, () => {
        const { start_date, end_date } = this.state;
        if (start_date && end_date && start_date <= end_date) {
          this.fetchPerformanceData();
        }
      });
    }
  };
  
  
  render() {
    const { ReviewPerformance,ReviewPerformanceTest } = this.props;
    const { start_date, end_date } = this.state;
    console.log("RENDER CONSOLE",ReviewPerformance)
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Review Performance | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Review Count of Tests and labs Added" breadcrumbItem="Review Performance" />
            <Card>
              <CardBody>
            <Row className="mb-2">
                              <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>Start Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.start_date,
                              utc: false, // Make sure UTC mode is off
                            }}
                            onChange={date => this.handleDateChange(date[0], 'start_date')}
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>End Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.end_date,
                            }}
                            onChange={date => this.handleDateChange(date[0], 'end_date')}
                          />
                        </FormGroup>
                      </Col>
            </Row></CardBody>
            </Card>
            {start_date > end_date && (
              <div className="alert alert-danger">Start date should not be after end date. It may result in incorrect count.</div>
            )}
            {(this.props.ReviewPerformance) && (this.props.ReviewPerformanceTest) && (
              <><Row>
                <Col md="6">
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">
                            Total Labs Registered
                          </p>
                          <h4 className="mb-0">
                            {ReviewPerformance?.total_labs || 0}
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
              </Row><Row>

                  <Col md="6">
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <div className="d-flex">
                          <div className="flex-grow-1">
                            <p className="text-muted fw-medium">
                              Total Tests Added
                            </p>
                            <h4 className="mb-0">
                            {ReviewPerformanceTest?.total_offered_tests || 0}
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
                </Row></>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ReviewPerformance.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,
  onGetReviewPerformance: PropTypes.func,
  ReviewPerformance: PropTypes.object,
  ReviewPerformanceTest: PropTypes.object,
  onGetReviewPerformanceTest: PropTypes.func,
};

const mapStateToProps = (state) => {
  console.log("Mapped state to props - ReviewPerformance:", state.ReviewPerformance);
  return {
    ReviewPerformance: state.ReviewPerformance.ReviewPerformance || {}, 
    ReviewPerformanceTest: state.ReviewPerformance.ReviewPerformanceTest || {}, 
  };
};


const mapDispatchToProps = (dispatch) => ({
  onGetReviewPerformance: ({ start_date, end_date }) => 
    dispatch(getReviewPerformance(start_date, end_date)),
  
  onGetReviewPerformanceTest: ({ start_date, end_date }) => 
    dispatch(getReviewPerformanceTest(start_date, end_date)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReviewPerformance));
