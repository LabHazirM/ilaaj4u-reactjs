import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// action
import { userChangePassword } from "store/auth/changepwd/actions";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      old_password: "",
      new_password: "",
      new_password2: "",
      passwordFieldError: "",
      changeSuccessMsg: "",
    };
  }

  
  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="new_password"]');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon.className = 'mdi mdi-eye-outline';
    }
  };
  togglePassword2Visibility = () => {
    const passwordInput = document.querySelector('input[name="new_password2"]');
    const eyeIcon2 = document.getElementById('eye-icon2');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon2.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon2.className = 'mdi mdi-eye-outline';
    }
  };

  togglePassword3Visibility = () => {
    const passwordInput = document.querySelector('input[name="old_password"]');
    const eyeIcon3 = document.getElementById('eye-icon3');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon3.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon3.className = 'mdi mdi-eye-outline';
    }
  };
  render() {

    // Define a custom validation function
const checkOldPassword = (value) => {
  // Replace this with your actual logic to check if the old password is correct
  const isOldPasswordCorrect = checkOldPasswordFunction(value);

  return isOldPasswordCorrect;
};

// Define your validation schema
const validationSchema = Yup.object().shape({
  old_password: Yup.string()
    .required("Please enter your old password")
    .test("old-password-match", "Old password is incorrect", checkOldPassword),
  new_password: Yup.string().required("Please enter your new password"),
  new_password2: Yup.string()
    .required("Please re-enter your new password")
    .when("new_password", {
      is: (val) => val && val.length > 0,
      then: Yup.string().oneOf(
        [Yup.ref("new_password")],
        "Passwords must match"
      ),
    }),
});
    // const { onAddNewComplaint } = this.props;

    return (
      
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title> Lab Hazir | Change Password</title>
          </MetaTags>
          <Container fluid={true}>
            <Breadcrumbs title="Account" breadcrumbItem="Change Password" />
            {this.state.changeSuccessMsg && (
              <Alert color="success" className="col-md-9">
                {this.state.changeSuccessMsg}
              </Alert>
            )}

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        old_password:
                          (this.state && this.state.old_password) || "",
                        new_password:
                          (this.state && this.state.new_password) || "",
                        new_password2:
                          (this.state && this.state.new_password2) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        old_password: Yup.string().required(
                          "Please enter your old password"
                        ),
                        new_password: Yup.string().required(
                          "Please enter your new password"
                        ),
                        new_password2: Yup.string()
                          .required("Please re-enter your new password")
                          .when("new_password", {
                            is: val => (val && val.length > 0 ? true : false),
                            then: Yup.string().oneOf(
                              [Yup.ref("new_password")],
                              "Both password need to be the same"
                            ),
                          }),
                      })}
                  
                      onSubmit={values => {
                        this.props.userChangePassword(values);
                        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                        setTimeout(() => {
                          this.setState({
                            passwordFieldError: this.props.changeError,
                            changeSuccessMsg: this.props.changeSuccessMsg,
                          });
                        }, 1000);

                        setTimeout(() => {
                          this.setState({
                            changeSuccessMsg: "",
                          });

                          values.old_password = "";
                          values.new_password = "";
                          values.new_password2 = "";
                          this.props.history.push("/change-password");
                        }, 5000);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form className="form-horizontal">
                        <div className="mb-3">
                        <Label className="form-label">Old Password</Label>
                        <div className="input-group">
                          <Field
                            name="old_password"
                            type={this.state.passwordVisibility ? "text" : "password"} // Toggle between text and password
                            placeholder="Enter your old password"
                            autoComplete="on"
                            onFocus={() => {
                              this.setState({
                                passwordFieldError: null,
                              });
                            }}
                            className={
                              "form-control" +
                              ((errors.old_password &&
                                touched.old_password) ||
                              this.state.passwordFieldError
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-light"
                              type="button"
                              id="password-addon"
                              onClick={this.togglePassword3Visibility}
                            >
                              <i id="eye-icon3" className="mdi mdi-eye-outline"></i>
                            </button>
                          </div>
                        </div>
                        <ErrorMessage
                          name="old_password"
                          component="div"
                          className="invalid-feedback"
                        />
                        <div className="invalid-feedback">
                          {this.state.passwordFieldError}
                        </div>
                      </div>

                          <div className="mb-3">
                            <Label className="form-label">New Password</Label>
                         
                            <div className="input-group">
                              <Field
                                name="new_password"
                                type={this.state.showPassword ? "text" : "password"}
                                placeholder="Enter your new password"
                                autoComplete="on"
                                onFocus={() => {
                                  this.setState({
                                    passwordFieldError: null,
                                  });
                                }}
                                className={
                                  "form-control" +
                                  (errors.new_password && touched.new_password
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <div className="input-group-append">
                                <button
                                  className="btn btn-light"
                                  type="button"
                                  id="password-addon"
                                  onClick={this.togglePasswordVisibility}
                                >
                                  <i id="eye-icon" className="mdi mdi-eye-outline"></i>
                                </button>
                              </div>
                            <ErrorMessage
                              name="new_password"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                            <div className="mt-2">
                              <div className="input-group">
                                <Field
                                  name="new_password2"
                                  type={this.state.showPassword ? "text" : "password"}
                                  placeholder="Re-enter your new password"
                                  autoComplete="on"
                                  className={
                                    "form-control" +
                                    (errors.new_password2 && touched.new_password2
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <div className="input-group-append">
                                  <button
                                    className="btn btn-light"
                                    type="button"
                                    id="password-addon"
                                    onClick={this.togglePassword2Visibility}
                                  >
                                    <i id="eye-icon2" className="mdi mdi-eye-outline"></i>
                                  </button>
                                </div>
                              </div>
                              <ErrorMessage
                                name="new_password2"
                                component="div"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          <div className="text-end">
                            <button
                              className="btn btn-primary w-md"
                              type="submit"
                              disabled={this.state.changeSuccessMsg}
                            >
                              Done
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ChangePassword.propTypes = {
  match: PropTypes.object,
  changeError: PropTypes.any,
  changeSuccessMsg: PropTypes.string,
  history: PropTypes.object,
  userChangePassword: PropTypes.any,
};

const mapStateToProps = state => {
  const { changeError, changeSuccessMsg } = state.ChangePassword;
  return { changeError, changeSuccessMsg };
};

export default withRouter(
  connect(mapStateToProps, { userChangePassword })(ChangePassword)
);
