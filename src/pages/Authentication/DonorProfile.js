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
import { updateDonorProfile, getDonorProfile } from "store/auth/donorprofile/actions";

class DonorProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      type:"",
      cnic:"",
      company_name:"",
      is_income_tax_payable:"",
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
      console.log(this.props.getDonorProfile(this.state.user_id));
    }, 1000);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        phone: this.props.success.phone,
        email: this.props.success.email,
        type: this.props.success.type,
        cnic: this.props.success.cnic,
        company_name: this.props.success.company_name,
        is_income_tax_payable: this.props.success.is_income_tax_payable,
        is_blocked: this.props.success.is_blocked,
      });
    }, 2000);
  }

  render() {
    console.log(" name: ", this.props.success.name);

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Donor" breadcrumbItem="Profile" />

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            {/* <h4 className="card-title mb-4">Update B2BClient Profile</h4> */}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    phone: (this.state && this.state.phone) ||"",
                    email: (this.state && this.state.email) || "",
                    type: (this.state && this.state.type) || "",
                    cnic: (this.state && this.state.cnic) || "",
                    company_name: (this.state && this.state.company_name) || "",
                    is_income_tax_payable: (this.state && this.state.is_income_tax_payable) || "",
                    is_blocked: (this.state && this.state.is_blocked) || "",
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
                        /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                        "Please enter a valid Pakistani phone number"
                      ),
                  })}
                  
                  onSubmit={values => {
                    this.props.updateDonorProfile(
                      values,
                      this.state.user_id
                    );
                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getDonorProfile(this.state.user_id);
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
                          onChange={e =>
                            this.setState({ name: e.target.value })
                          }
                          value={this.state.name}
                          className={
                            "form-control" +
                            (errors.name && touched.name
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="name"
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
                      {/* phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Phone
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          onChange={e =>
                            this.setState({
                              phone: e.target.value,
                            })
                          }
                          value={this.state.phone}
                          className={
                            "form-control" +
                            (errors.phone && touched.phone
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="phone"
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

DonorProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateDonorProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getDonorProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.DonorProfile;
  console.log("B2B Profile: ", state.DonorProfile.success);
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateDonorProfile,
    getDonorProfile,
  })(DonorProfile)
);
