import PropTypes from "prop-types";
import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Alert, Card, CardBody, Col, Container, Label, Row } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// action
import { userForgetPassword } from "../../store/actions";

import CarouselPage from "../AuthenticationInner/CarouselPage";

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleLoginClick = () => {
    window.location.href = "/login";
  };

  render() {
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Forget Password | Lab Hazir</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <CarouselPage />

              <Col md={6} lg={6} xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">Forget password</h5>
                          <p className="text-muted">
                            Do not worry, we will get back you to your account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.forgetError && (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.forgetError}
                            </Alert>
                          )}

                          {this.props.forgetSuccessMsg && (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              {this.props.forgetSuccessMsg}
                            </Alert>
                          )}
                          <div className="p-2">
                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                email: (this.state && this.state.email) || "",
                              }}
                              validationSchema={Yup.object().shape({
                                email: Yup.string().required(
                                  "Please enter your email"
                                ),
                              })}
                              onSubmit={values => {
                                this.props.userForgetPassword(
                                  values,
                                  this.props.history
                                );
                                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                              }}
                            >
                              {({ errors, status, touched }) => (
                                <Form className="form-horizontal">
                                  <div className="mb-3">
                                    <Label for="email" className="form-label">
                                      Email
                                    </Label>
                                    <Field
                                      name="email"
                                      type="text"
                                      className={
                                        "form-control" +
                                        (errors.email && touched.email
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="email"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                  <div className="text-end">
                                    <button
                                      className="btn btn-primary w-md"
                                      type="submit"
                                      disabled={this.props.forgetSuccessMsg}
                                    >
                                      Reset
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                          <div className="mt-5 text-center">
        <p>
          Go back to{" "}
          <span
            className="fw-medium text-primary"
            onClick={this.handleLoginClick}
            style={{ cursor: "pointer" }}
          >
            Login
          </span>{" "}
        </p>
        <p>© {new Date().getFullYear()} Lab Hazir</p>
      </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ForgetPasswordPage.propTypes = {
  forgetError: PropTypes.func,
  forgetSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userForgetPassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { forgetError, forgetSuccessMsg } = state.ForgetPassword;
  return { forgetError, forgetSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userForgetPassword })(ForgetPasswordPage)
);
