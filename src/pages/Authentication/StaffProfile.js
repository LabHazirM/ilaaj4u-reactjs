import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateStaffProfile, getStaffProfile } from "../../store/actions";

class StaffProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    this.props.getStaffProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        email: this.props.success.email,
        phone: this.props.success.phone,
      });
    }, 1500);
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Account" breadcrumbItem="Profile" />

            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <div className="d-flex">
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.name}</h5>
                          {/* <p className="mb-0">{this.state.phone}</p> */}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success" className="col-md-5">
                Your profile has been updated successfully.
              </Alert>
            ) : null}

            <h4 className="card-title mb-4">Your Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    email: (this.state && this.state.email) || "",
                    phone: (this.state && this.state.phone) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters"),
                     
                    email: Yup.string()
                      .required("Please enter your email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    phone: Yup.string()
                      .required("Please enter your phone no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                        "Please enter a valid Pakistani phone number e.g. 03123456789"
                      ),
                  })}
                  onSubmit={values => {
                    this.props.updateStaffProfile(values, this.state.user_id);
                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getStaffProfile(this.state.user_id);
                    }, 1000);

                    // To make success message disappear after sometime
                    setTimeout(() => {
                      this.setState({
                        isProfileUpdated: false,
                      });
                    }, 5000);
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      {/* Name field */}
                      <div className="mb-3">
                        <Label for="name" className="form-label">
                          Name
                        </Label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          readOnly={true}
                          value={this.state.name}
                          className="form-control"
                        />
                      </div>

                      {/* Email field */}
                      <div className="mb-3">
                        <Label for="email" className="form-label">
                          Email
                        </Label>
                        <Field
                          name="email"
                          type="text"
                          readOnly={true}
                          value={this.state.email}
                          className="form-control"
                        />
                      </div>

                      {/* Phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Phone
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          readOnly={true}
                          value={this.state.phone}
                          className={
                            "form-control" +
                            (errors.phone && touched.phone ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Update Profile
                        </Button>
                      </div> */}
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

StaffProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateStaffProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getStaffProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.StaffProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateStaffProfile,
    getStaffProfile,
  })(StaffProfile)
);
