import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Input, Container, Row, Label } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

// action
import {
  getTerritoriesList,
  addDoctorInformation,
  addDoctorInformationFailed,
} from "../../store/auth/doctorinformation/actions";

// Redux
import { connect } from "react-redux";

class DoctorInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      cnic: "",
      contact: "",
      doctor_image: "",
      city_id: "",
      PMDC_number: "",
      bank_name: "",
      account_no: "",
    };
  }

  componentDidMount() {
    this.props.addDoctorInformationFailed("");
    this.props.getTerritoriesList();
  }

  render() {
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }
    //Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Doctor Information | Lab Hazir</title>
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
                          <h5 className="text-primary">
                            Doctor Information
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.doctor && this.props.doctor ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              The verification link is sent to your email,
                              please verify your account first in order to
                              login.{" "}
                            </Alert>
                          ) : null}

                          {this.props.doctor&& this.props.doctor? (
                             setTimeout(() => {
                              if (this.props.doctor) {
                                this.props.history.push("/login");
                              }
                            }, 2000)
                          ) : null}
                          

                          {this.props.addDoctorError &&
                          this.props.addDoctorError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addDoctorError}
                            </Alert>
                          ) : null}

                         <Formik
                          enableReinitialize={true}
                          initialValues={{
                            name: this.state.name || "",
                            PMDC_number: this.state.PMDC_number || "",
                            bank_name: this.state.bank_name || "",
                            account_no: this.state.account_no || "",
                            email: this.state.email || "",
                            cnic : this.state.cnic || "",
                            doctor_image: this.state.doctor_image || null,
                            contact: this.state.contact || "",
                            city_id: this.state.city_id || "",
                          }}
                          validationSchema={Yup.object().shape({
                            name: Yup.string()
                              .trim()
                              .required("Please enter your name")
                              .min(3, "Please enter at least 3 characters")
                              .max(255, "Please enter maximum 255 characters"),
                            email: Yup.string()
                              .required("Please enter your email")
                              .email("Please enter valid email"),
                            cnic: Yup.string()
                              .required("Please enter your CNIC Number"),
                            PMDC_number: Yup.string()
                              .required("Please enter your PMDC Number"),
                            bank_name: Yup.string()
                              .required("Please enter your Account Bank Name"),
                            account_no: Yup.string()
                              .required("Please enter your Account Number"),
                            contact: Yup.string()
                              .required("Please enter your phone no.")
                              .max(255, "Please enter maximum 255 characters")
                              .matches(
                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                "Please enter a valid Pakistani phone number e.g. 03123456789"
                              ),
                          })}
                          onSubmit={(values) => {
                            console.log("Submitting...");
                            console.log("Form Values:", values);
                            this.props.addDoctorInformation(values, this.props.match.params.id);
                            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
                          }}
                        >
                          {({ errors, touched, setFieldValue }) => (
                            <Form className="form-horizontal">
                              {/* Name */}
                              <div className="mb-3">
                                <Label for="name" className="form-label">Name</Label>
                                <Field
                                  id="name"
                                  name="name"
                                  placeholder="Enter Name"
                                  type="text"
                                  className={"form-control" + (errors.name && touched.name ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                              </div>

                              {/* Email */}
                              <div className="mb-3">
                                <Label for="email" className="form-label">Email</Label>
                                <Field
                                  name="email"
                                  placeholder="Enter email"
                                  type="text"
                                  className={"form-control" + (errors.email && touched.email ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                              </div>

                              {/* CNIC */}
                              <div className="mb-3">
                                <Label for="cnic" className="form-label">CNIC</Label>
                                <Field
                                  name="cnic"
                                  placeholder="Enter CNIC No."
                                  type="text"
                                  className={"form-control" + (errors.cnic && touched.cnic ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="cnic" component="div" className="invalid-feedback" />
                              </div>

                              {/* Doctor Image */}
                              <div className="mb-3">
                                <Label for="doctor_image" className="form-label">Doctor Image</Label>
                                <input
                                  id="doctor_image"
                                  name="doctor_image"
                                  type="file"
                                  accept=".jpg,.jpeg,.png"
                                  className={"form-control" + (errors.doctor_image && touched.doctor_image ? " is-invalid" : "")}
                                  onChange={(event) => {
                                    setFieldValue("doctor_image", event.currentTarget.files[0]);
                                  }}
                                />
                                <ErrorMessage name="doctor_image" component="div" className="invalid-feedback" />
                              </div>

                              {/* Phone */}
                              <div className="mb-3">
                                <Label for="contact" className="form-label">Phone</Label>
                                <Field
                                  id="contact"
                                  name="contact"
                                  placeholder="Enter contact No"
                                  type="text"
                                  className={"form-control" + (errors.contact && touched.contact ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="contact" component="div" className="invalid-feedback" />
                              </div>

                              {/* PMDC Number */}
                              <div className="mb-3">
                                <Label for="PMDC_number" className="form-label">PMDC No.</Label>
                                <Field
                                  id="PMDC_number"
                                  name="PMDC_number"
                                  placeholder="Enter PMDC No"
                                  type="text"
                                  className={"form-control" + (errors.PMDC_number && touched.PMDC_number ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="PMDC_number" component="div" className="invalid-feedback" />
                              </div>

                              {/* Bank Name */}
                              <div className="mb-3">
                                <Label for="bank_name" className="form-label">Bank Name</Label>
                                <Field
                                  id="bank_name"
                                  name="bank_name"
                                  placeholder="Enter Bank Name"
                                  type="text"
                                  className={"form-control" + (errors.bank_name && touched.bank_name ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="bank_name" component="div" className="invalid-feedback" />
                              </div>

                              {/* Account No */}
                              <div className="mb-3">
                                <Label for="account_no" className="form-label">Account No.</Label>
                                <Field
                                  id="account_no"
                                  name="account_no"
                                  placeholder="Enter Account No"
                                  type="text"
                                  className={"form-control" + (errors.account_no && touched.account_no ? " is-invalid" : "")}
                                />
                                <ErrorMessage name="account_no" component="div" className="invalid-feedback" />
                              </div>

                              {/* City Select */}
                              <div className="mb-3">
                                <Label for="city_id" className="form-label">City</Label>
                                <Select
                                  name="city_id"
                                  options={cityList}
                                  onChange={(selectedOption) =>
                                    setFieldValue("city_id", selectedOption.value)
                                  }
                                  className={"defautSelectParent" + (errors.city_id && touched.city_id ? " is-invalid" : "")}
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderColor: errors.city_id && touched.city_id ? "#f46a6a" : "#ced4da",
                                    }),
                                  }}
                                  defaultValue={
                                    cityList.find(option => option.value === this.state.city_id) || null
                                  }
                                />
                                <ErrorMessage name="city_id" component="div" className="invalid-feedback" />
                              </div>

                              {/* Submit Button */}
                              <div className="mt-3 d-grid">
                                <button className="btn btn-primary btn-block" type="submit">
                                  Complete Registration
                                </button>
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

DoctorInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addDoctorInformation: PropTypes.func,
  addDoctorInformationFailed: PropTypes.any,
  addDoctorError: PropTypes.any,
  doctor: PropTypes.any,
  getTerritoriesList:PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => {
  const { doctor, addDoctorError, loading, territoriesList } = state.doctorInformation;
  
  return { doctor, addDoctorError, loading, territoriesList };
};

export default connect(mapStateToProps, {
  getTerritoriesList,
  addDoctorInformation,
  addDoctorInformationFailed,

})(DoctorInformation);