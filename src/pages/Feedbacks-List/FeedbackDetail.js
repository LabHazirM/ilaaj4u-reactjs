import React, { Component } from "react";
import PropTypes from "prop-types";
//Import Star Ratings
import StarRatings from "react-star-ratings";

import { connect } from "react-redux";
import { Media } from "reactstrap";
import { map } from "lodash";

import { withRouter } from "react-router-dom";
import { withTranslation } from "react-i18next";

import { Row, Col, Card, CardBody } from "reactstrap";

import { getFeedbacks } from "store/feedbacks/actions";
import moment from 'moment';


class FeedbackDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      patient_name: "",
      rating: "",
      review: "",
    };
  }
  componentDidMount() {
    this.props.getFeedbacks(this.props.match.params.lab_account_id);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.feedbacks.length > 0 && (
          <Card>
            <CardBody>
              <div className="mt-2">
                <h5>Reviews :</h5>
                {map(this.props.feedbacks, (feedback, k) => (
                  <Media
                    className={
                      feedback.id === 1
                        ? "border-bottom py-3"
                        : "border-bottom py-3"
                    }
                    key={"__media__" + k}
                  >
                    <div className="avatar-xs me-3">
                      <span className="avatar-title bg-primary bg-soft text-primary rounded-circle font-size-16">
                        {feedback.patient_name.slice(0, 1)}
                      </span>
                    </div>

                    <Media body>
                      {this.state.user_id == feedback.patient_account_id ? (
                        <h5 className="mt-0 mb-1 font-size-15">Your Comment</h5>
                      ) : (
                        <h5 className="mt-0 mb-1 font-size-15">
                          {feedback.patient_name}
                        </h5>
                      )}

                      <Row>
                        <Col lg={2} md={2} sm={4}>
                          <div className="my-0">
                            <StarRatings
                              rating={feedback.rating_values}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="14px"
                              starSpacing="3px"
                            />
                          </div>
                        </Col>
                        <Col lg={4} md={4} sm={6}>
                          <div className="text-muted font-size-12">
                            <i className="far fa-calendar-alt text-primary me-1" />
                            {/* {feedback.date} */}
                            {/* {new Date(feedback.rated_at).toLocaleString(
                              "en-US"
                            )} */}
                            {moment(feedback.rated_at).format("DD MMM YYYY, h:mm A")}
                          </div>
                        </Col>
                      </Row>

                      <p className="text-muted mt-3">{feedback.review}</p>

                      {/* {comment.childComment
                  ? comment.childComment.map((child, key) => (
                      <Media className="mt-4" key={"_media_" + key}>
                        <img
                          src={images[child.img]}
                          className="avatar-xs me-3 rounded-circle"
                          alt="img"
                        />
                        <Media body>
                          <h5 className="mt-0 mb-1 font-size-15">
                            {child.name}
                          </h5>
                          <p className="text-muted">{child.description}</p>
                          <ul className="list-inline float-sm-end mb-sm-0">
                            <li className="list-inline-item">
                              <Link to="#">
                                <i className="far fa-thumbs-up me-1" /> Like
                              </Link>
                            </li>
                            <li className="list-inline-item">
                              <Link to="#">
                                <i className="far fa-comment-dots me-1" />{" "}
                                Comment
                              </Link>
                            </li>
                          </ul>
                          <div className="text-muted font-size-12">
                            <i className="far fa-calendar-alt text-primary me-1" />{" "}
                            {child.date}
                          </div>
                        </Media>
                      </Media>
                    ))
                  : null} */}
                    </Media>
                  </Media>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </React.Fragment>
    );
  }
}

FeedbackDetail.propTypes = {
  product: PropTypes.object,
  match: PropTypes.object,
  className: PropTypes.any,
  error: PropTypes.any,
  feedbacks: PropTypes.any,
  getFeedbacks: PropTypes.func,
  feedbacks: PropTypes.array,
};

const mapStateToProps = state => {
  const { error, feedbacks } = state.feedbacks;
  return { error, feedbacks };
};

export default withRouter(
  connect(mapStateToProps, { getFeedbacks })(withTranslation()(FeedbackDetail))
);
