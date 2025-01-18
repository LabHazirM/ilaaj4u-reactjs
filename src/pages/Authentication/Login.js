import React, { Component } from "react";
import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";

import { Alert, Col, Container, Row, Label } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// actions
import { apiError, loginUser } from "../../store/actions";
import { getPatientProfile } from "store/labmarket/actions";
// import images
import CarouselPage from "../AuthenticationInner/CarouselPage";


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      guest_id: "",
      submittedMessage: null,
      patientProfile: [],
    };
    this.togglePermissionModal = this.togglePermissionModal.bind(this);

  }

  togglePermissionModal = () => {
    this.setState(prevState => ({
      PermissionModal: !prevState.PermissionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  componentDidMount() {

    const url = window.location.href;
    const queryString = url.substring(url.indexOf("&"));
    console.log(queryString);
    const params = new URLSearchParams(queryString);
    console.log("print params in app", url, queryString, params)
    const latitudeFromUrl = params.get('lat');
    const longitudeFromUrl = params.get('lon');

    console.log('Latitude:', latitudeFromUrl);
    console.log('Longitude:', longitudeFromUrl);
    if (latitudeFromUrl && longitudeFromUrl) {
      
      // Extract only the query string part from the full URL
      const finalUrl = queryString;
      
      // Setting the final URL in the component's state
      this.setState({ finalUrl: finalUrl }, () => {
          // Logging the final URL after state update
          console.log("Final URL after state update:", this.state.finalUrl);
      });
      const latitudeFromUrl = params.get('lat');
      const longitudeFromUrl = params.get('lon');

      if (latitudeFromUrl && longitudeFromUrl) {
      localStorage.setItem('latitude', latitudeFromUrl);
      localStorage.setItem('longitude', longitudeFromUrl);
      this.setState({ finalUrl: queryString }, () => {
        console.log("Final URL after state update:", this.state.finalUrl);
      });
      }

  }
  
    // Removing attributes from the body
    const elem = document.getElementsByTagName("body")[0];
    while (elem.attributes.length > 0) {
      elem.removeAttribute(elem.attributes[0].name);
    }


    if (localStorage.getItem("authUser")) {
      this.props.history.push("/logout");
    }
    this.props.apiError("");
    // console.log("finalurl in the app", finalUrl, this.state.finalUrl)
    console.log("guest_id", this.props.match.params.guest_id)
    console.log("uuid", this.props.match.params.uuid)

    const { patientProfile, getPatientProfile } = this.props;
    getPatientProfile(this.state.user_id);
    this.setState({
      patientProfile
    });
    console.log("patient state state", this.state.patientProfile, this.props.patientProfile);
  }

  removeAttributes(element, ...attrs) {
    attrs.forEach(attr => element.removeAttribute(attr));
  }

  togglePasswordVisibility = () => {
    const passwordInput = document.querySelector('input[name="password"]');
    const eyeIcon = document.getElementById('eye-icon');

    if (passwordInput && passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.className = 'mdi mdi-eye-off-outline';
    } else if (passwordInput) {
      passwordInput.type = 'password';
      eyeIcon.className = 'mdi mdi-eye-outline';
    }
  };


  render() {
    const isLargeScreen = window.innerWidth > 470;
    const { getPatientProfile } = this.props;
    const { patientProfile } = this.props;
    // const closeModal = () => {
    //   this.setState({ PermissionModal: false });


    // };
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // or any value between 0 and 1
      zIndex: 9999,
      display: this.state.PermissionModal ? 'block' : 'none',
    };

    const modalStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      width: '500px', // Increase width
      height: '400px', // Increase height
      zIndex: 10000,
      display: this.state.PermissionModal ? 'block' : 'none',
    };
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Login | Lab Hazir</title>
          </MetaTags>
          <Container fluid className="p-0">
            <Row className="g-0">
              <div>
                <div style={backdropStyle}></div>
                <div style={modalStyle}>
                  <Col className="col-12 text-center">
                    <div
                      style={{
                        width: "100%",
                        height: "60px",
                        // borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // border: "2px solid green",
                        margin: "0 auto", // Center the circle
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{ color: "green", fontSize: "24px", fontWeight: "bold" }}
                      >
                        Welcome to the Labhazir!
                      </span>
                    </div>
                    <strong className="font-size-15 font-weight-bold mb-3">
                      We would like to inform you that,
                    </strong><br></br>
                    <p style={{ fontSize: "14px", color: "gray", margin: "0 auto", textAlign: "center", width: "90%", }}>
                      since you are affiliated with a corporate entity, you will only be shown the specific tests offered by your corporation. If you wish to view different tests, you will need to create a separate regular account.</p><br></br>
                    <span className="font-size-15 mb-3">
                      Click on <strong>&lsquo;Use Another Account&lsquo;</strong> for that, or click <strong>&lsquo;Continue&lsquo;</strong> to proceed.
                    </span><br></br>
                    <strong className="font-size-15 font-weight-bold mb-3 text-danger">
                      Thank You For Choosing Labhazir!
                    </strong><br></br>
                  </Col>

                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/login"
                      className="btn mt-2 me-1"
                      onClick={() => this.setState({ PermissionModal: false })}
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        // backgroundColor: "white",
                      }}
                    >
                      Use another Account
                    </Link>

                    <Link
                      to="#" // Use a dummy link or remove this prop, as it will be replaced by the onClick event
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                      onClick={() => {
                        this.setState({ PermissionModal: true });
                        setTimeout(() => {
                          this.props.history.push("/test-appointments");
                        }, 1000);
                      }}
                    >
                      Continue
                    </Link>

                  </div>
                </div>
              </div>
              <CarouselPage />
              <Col md={6} lg={6} xl={6}>
                <div className="auth-full-page-content p-md-5 p-4">
                  <div className="w-100">
                    <div className="d-flex flex-column h-100">
                      <div className="my-auto">
                        <div>
                          <h5 className="text-primary">Welcome Back!</h5>
                          <p className="text-muted">
                            Sign in to continue to Lab Hazir
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.error && this.props.error && (
                            <Alert color="danger">{this.props.error}</Alert>
                          )}
                          {/* {this.state.submittedMessage && this.props.error && (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              {this.state.submittedMessage}
                            </Alert>
                          )} */}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              username:
                                (this.state && this.state.username) || "",
                              password:
                                (this.state && this.state.password) || "",
                              guest_id:
                                (this.props && this.props.match.params.guest_id) || "",
                            }
                            }
                            validationSchema={Yup.object().shape({
                              username: Yup.string().required(
                                "Please enter your username or email"
                              ),
                              password: Yup.string().required(
                                "Please enter your password"
                              ),
                            })
                            }
                            onSubmit={async (values) => {
                              // Check if login is already in progress
                              if (this.state.isLoginInProgress) {
                                return;
                              }

                              // Set the flag to indicate login is in progress
                              this.setState({ isLoginInProgress: true });

                              try {
                                // Call loginUser asynchronously
                                await this.props.loginUser(values, this.props.history);

                                // Handle success logic if needed

                                setTimeout(() => {
                                  const success = this.props.success;
                                  const error = this.props.error;
                                  console.log("total array length", success.is_associate_with_any_corporate)

                                  if (error) {
                                    // Handle the error without triggering redirection
                                    console.error("Error:", error);
                                    this.props.apiError(error.message); // Dispatch the error message to state

                                    // Automatically remove the error message after 4 minutes (240,000 milliseconds)
                                    setTimeout(() => {
                                      this.props.apiError(null); // Clear the error message
                                    }, 240000);
                                  } else {
                                    // No error, redirect logic here
                                    const isLargeScreen = window.innerWidth > 470;

                                    if (!isLargeScreen) {
                                      console.log("finalUrl in mobile app else case", this.state.finalUrl);
                                      if (success.account_type === "samplecollector") {
                                        this.props.history.push("/dashboard-samplecollector");
                                      } else if (success.account_type === "patient" && 
                                        (success.is_associate_with_any_corporate == undefined || success.is_associate_with_any_corporate == false) &&
                                        !success.employee_id_card) {
                                        console.log("yaha a raha hai mobile mation")
                                        this.props.history.push(
                                          this.state.finalUrl
                                            ? `/nearby-labs/${this.state.finalUrl}`
                                            : `/nearby-labs`
                                        );
                                        console.log("yaha pr aya nahi",this.state.finalUrl);
                                      } else if (success.account_type === "patient" && 
                                        success.is_associate_with_any_corporate == true &&
                                        success.employee_id_card) {
                                        console.log("yaha a raha hai mobile mation")
                                        this.props.history.push(
                                          this.state.finalUrl
                                            ? `/corporate-modal/${this.state.finalUrl}`
                                            : `/corporate-modal`
                                        );
                                        console.log("yaha pr aya nahi",this.state.finalUrl);

                                      }
                                    } else if (
                                      !isLargeScreen &&
                                      !this.state.finalUrl
                                    ) {
                                      console.log("not finalurl yaha a raha hai mobile mation")
                                      if (success.account_type === "patient") {
                                        this.props.history.push(
                                          this.props.match.params.uuid
                                            ? `/nearby-labs/${this.props.match.params.uuid}`
                                            : `/nearby-labs`
                                        );
                                        console.log(this.props.match.params.uuid);
                                      }
                                    }  
                                    else if (
                                      isLargeScreen &&
                                      success.account_type === "patient" &&
                                      (success.is_associate_with_any_corporate == undefined || success.is_associate_with_any_corporate == false) &&
                                      !success.employee_id_card &&
                                      !this.state.finalUrl
                                    ) {
                                      this.props.history.push(
                                        this.props.match.params.uuid
                                          ? `/nearby-labs/${this.props.match.params.uuid}`
                                          : `/nearby-labs`
                                      );
                                      console.log(this.props.match.params.uuid);
                                    }
                                    else if (
                                      isLargeScreen &&
                                      success.account_type === "patient" &&
                                      success.is_associate_with_any_corporate == true &&
                                      // success.corporate_id != null &&
                                      success.employee_id_card &&
                                      !this.state.finalUrl
                                    ) {
                                      console.log("Patient Profile:", success.is_associate_with_any_corporate);
                                      this.props.history.push("/corporate-modal");
                                    } else if (success.account_type === "labowner") {
                                      this.props.history.push("/dashboard-lab");
                                    } else if (success.account_type === "b2b-admin") {
                                      this.props.history.push("/b2b-clients-list");
                                    } else if (success.account_type === "b2bclient") {
                                      this.props.history.push("/dashboard-b2bclient");
                                    } else if (success.account_type === "CSR") {
                                      this.props.history.push("/dashboard-csr");
                                    } else if (success.account_type === "finance-officer") {
                                      this.props.history.push("/dashboard-finance");
                                    } else if (success.account_type === "finance-admin") {
                                      this.props.history.push("/dashboard-financeadmin");
                                    } else if (success.account_type === "auditor") {
                                      this.props.history.push("/dashboard-auditor");
                                    } else if (success.account_type === "registration-admin") {
                                      this.props.history.push("/pending-labs");
                                    } else if (success.account_type === "marketer-admin") {
                                      this.props.history.push("/dashboard-marketeradmin");
                                    } else if (success.account_type === "samplecollector") {
                                      this.props.history.push("/dashboard-samplecollector");
                                    } else if (success.account_type === "csr-admin") {
                                      this.props.history.push("/pending-complaints-lab");
                                    } else if (success.account_type === "auditor-admin") {
                                      this.props.history.push("/lab-list");
                                    } else if (success.account_type === "hr-admin") {
                                      this.props.history.push("/add-staff");
                                    } else if (success.account_type === "donor") {
                                      this.props.history.push("/dashboard-donor");
                                    } else if (success.account_type === "corporate") {
                                      this.props.history.push("/dashboard-corporate");
                                    }
                                  }
                                }, 1000);
                              } catch (error) {
                                // Handle the error without triggering redirection
                                console.error("Error:", error);
                                this.props.apiError(error.message); // Dispatch the error message to state

                                // Automatically remove the error message after 4 minutes (240,000 milliseconds)
                                setTimeout(() => {
                                  this.props.apiError(null); // Clear the error message
                                }, 240000);
                              } finally {
                                // Reset the flag after login attempt
                                this.setState({ isLoginInProgress: false });
                              }
                            }}

                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">

                                <div className="mb-3">
                                  <Label for="username" className="form-label">
                                    Username or Email
                                  </Label>
                                  <Field
                                    name="username"
                                    type="text"
                                    className={
                                      "form-control" +
                                      (errors.username && touched.username
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                <div className="mb-3">
                                  <Label for="password" className="form-label">
                                    Password
                                  </Label>
                                  <div className="input-group auth-pass-inputgroup">
                                    <Field
                                      name="password"
                                      type="password"
                                      autoComplete="true"
                                      className={
                                        "form-control" +
                                        (errors.password && touched.password ? " is-invalid" : "")
                                      }
                                    />
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
                                    name="password"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>

                                <div className="form-check">
                                  <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="customControlInline"
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor="customControlInline"
                                  >
                                    Remember me
                                  </label>
                                </div>

                                <div className="mt-3 d-grid">
                                  <button
                                    className="btn btn-primary btn-block"
                                    type="submit"
                                  >
                                    Log In
                                  </button>
                                </div>

                                <div className="mt-4 text-center">
                                  <Link
                                    to="/forgot-password"
                                    className="text-muted"
                                  >
                                    <i className="mdi mdi-lock me-1" /> Forgot
                                    your password?
                                  </Link>
                                </div>

                                <div className="mt-3 text-center">
                                  {(!isLargeScreen && this.state.finalUrl) ? (
                                    <p>
                                      Do not have an account?{" "}
                                      <Link
                                        to={this.state.finalUrl ? `/register/${this.state.finalUrl}` : "/register"}
                                        className="fw-medium text-primary"
                                      >
                                        Register
                                      </Link>{" "}
                                    </p>
                                  ) : (
                                    <p>
                                      Do not have an account?{" "}
                                      <Link
                                        to={
                                          this.props.match.params.uuid
                                            ? `/register/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                            : `/register/${this.props.match.params.guest_id}`
                                        }
                                        className="fw-medium text-primary"
                                      >
                                        Register
                                      </Link>{" "}
                                    </p>
                                  )}
                                </div>

                              </Form>
                            )}
                          </Formik>
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

Login.propTypes = {
  match: PropTypes.object,
  apiError: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
  history: PropTypes.object,
  loginUser: PropTypes.func,
  getPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,

};

const mapStateToProps = state => {
  const { error, success } = state.Login;
  const patientProfile = state.LabMarket.patientProfile; // Corrected assignment
  return { error, success, patientProfile };
};

export default withRouter(
  connect(mapStateToProps, { loginUser, getPatientProfile, apiError })(Login)
);