import PropTypes from "prop-types";
import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Alert, Col, Container, Label, Row } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// action
import { userConfirmPassword } from "../../store/actions";

import CarouselPage from "../AuthenticationInner/CarouselPage";

class ConfirmPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Confirm Password | Lab Hazir</title>
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
                          <h5 className="text-primary">Confirm password</h5>
                          <p className="text-muted">
                            You are just one step away from your account.
                          </p>
                        </div>

                        <div className="mt-4">
                          <div className="p-2">
                            {this.props.confirmError &&
                            this.props.confirmError ? (
                              <Alert
                                color="danger"
                                style={{ marginTop: "13px" }}
                              >
                                {this.props.confirmError}
                              </Alert>
                            ) : null}
                            {this.props.confirmSuccessMsg ? (
                              <Alert
                                color="success"
                                style={{ marginTop: "13px" }}
                              >
                                {this.props.confirmSuccessMsg}
                              </Alert>
                            ) : null}

                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                password:
                                  (this.state && this.state.password) || "",
                                password2:
                                  (this.state && this.state.password2) || "",
                              }}
                              validationSchema={Yup.object().shape({
                                password: Yup.string().required(
                                  "Please enter your password"
                                ),
                                password2: Yup.string()
                                  .required("Please re-enter your password")
                                  .when("password", {
                                    is: val =>
                                      val && val.length > 0 ? true : false,
                                    then: Yup.string().oneOf(
                                      [Yup.ref("password")],
                                      "Both password need to be the same"
                                    ),
                                  }),
                              })}
                              onSubmit={values => {
                                this.props.userConfirmPassword(
                                  values,
                                  this.props.match.params.token
                                );
                                window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                              }
                            }
                            >
                              {({ errors, status, touched }) => (
                                <Form className="form-horizontal">
                                  <div className="mb-3">
                                    <Label className="form-label">
                                      Password
                                    </Label>
                                    <div>
                                      <Field
                                        name="password"
                                        type="password"
                                        placeholder="Enter password"
                                        autoComplete="on"
                                        onFocus={() => {
                                          this.setState({
                                            passwordFieldError: null,
                                          });
                                        }}
                                        className={
                                          "form-control" +
                                          ((errors.password &&
                                            touched.password) ||
                                          this.state.passwordFieldError
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="invalid-feedback"
                                      />

                                      <div className="invalid-feedback">
                                        {this.state.passwordFieldError}
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <Field
                                        name="password2"
                                        type="password"
                                        placeholder="Re-enter password"
                                        autoComplete="on"
                                        className={
                                          "form-control" +
                                          (errors.password2 && touched.password2
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="password2"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <button
                                      className="btn btn-primary w-md"
                                      type="submit"
                                    >
                                      Done
                                    </button>
                                  </div>
                                </Form>
                              )}
                            </Formik>
                          </div>
                          <div className="mt-5 text-center">
                            <p>
                              Go back to{" "}
                              <Link
                                to="/login"
                                className="fw-medium text-primary"
                              >
                                Login
                              </Link>{" "}
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

ConfirmPasswordPage.propTypes = {
  match: PropTypes.object,
  confirmError: PropTypes.any,
  confirmSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userConfirmPassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { confirmError, confirmSuccessMsg } = state.ConfirmPassword;
  return { confirmError, confirmSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userConfirmPassword })(ConfirmPasswordPage)
);
