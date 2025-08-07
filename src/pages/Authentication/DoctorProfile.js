import PropTypes from "prop-types";
import Select from "react-select";
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
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateDoctorProfile, getDoctorProfile } from "store/auth/doctorprofile/actions";

class DoctorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctor_name: "",
      contact: "",
      email: "",
      cnic:"",
      is_blocked:"",
      isProfileUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    console.log("user id: ", this.state.user_id);
    setTimeout(() => {
      console.log(this.props.getDoctorProfile(this.state.user_id));
    }, 1000);

    setTimeout(() => {
      this.setState({
        doctor_name: this.props.success.doctor_name,
        contact: this.props.success.contact,
        email: this.props.success.email,
        cnic: this.props.success.cnic,
        is_blocked: this.props.success.is_blocked,
      });
    }, 2000);
  }

  render() {

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Doctor" breadcrumbItem="Profile" />

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            {/* <h4 className="card-title mb-4">Update B2BClient Profile</h4> */}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    doctor_name: (this.state && this.state.doctor_name) || "",
                    contact: (this.state && this.state.contact) ||"",
                    email: (this.state && this.state.email) || "",
                    cnic: (this.state && this.state.cnic) || "",
                    is_blocked: (this.state && this.state.is_blocked) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    doctor_name: Yup.string()
                      .trim()
                      .required("Please enter your doctor_name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters"),
                    email: Yup.string()
                      .required("Please enter your email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    contact: Yup.string()
                      .required("Please enter your contact no.")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                        "Please enter a valid Pakistani contact number"
                      ),
                  })}
                  
                  onSubmit={values => {
                    this.props.updateDoctorProfile(
                      values,
                      this.state.user_id
                    );
                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getDoctorProfile(this.state.user_id);
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
                        <Label for="doctor_name" className="form-label">
                          Name
                        </Label>
                        <Field
                          id="doctor_name"
                          name="doctor_name"
                          type="text"
                          onChange={e =>
                            this.setState({ doctor_name: e.target.value })
                          }
                          value={this.state.doctor_name}
                          className={
                            "form-control" +
                            (errors.name && touched.doctor_name
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="doctor_name"
                          component="div"
                          className="invalid-feedback"
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
                          onChange={e =>
                            this.setState({ email: e.target.value })
                          }
                          value={this.state.email}
                          className={
                            "form-control" +
                            (errors.email && touched.email ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* contact field */}
                      <div className="mb-3">
                        <Label for="contact" className="form-label">
                          Phone
                        </Label>
                        <Field
                          id="contact"
                          name="contact"
                          type="text"
                          onChange={e =>
                            this.setState({
                              contact: e.target.value,
                            })
                          }
                          value={this.state.contact}
                          className={
                            "form-control" +
                            (errors.contact && touched.contact
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="contact"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      

                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Update Profile
                        </Button>
                      </div>
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

DoctorProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateDoctorProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getDoctorProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.DoctorProfile;
  console.log("B2B Profile: ", state.DoctorProfile.success);
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateDoctorProfile,
    getDoctorProfile,
  })(DoctorProfile)
);
