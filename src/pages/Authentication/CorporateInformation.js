import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label, Input } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";

// action
import {
  getTerritoriesList,
  addCorporateInformation,
  addCorporateInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

class CorporateInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      national_taxation_no: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city_id: "",
      website_url: "",
      payment_terms: "",
    };
  }

  componentDidMount() {
    this.props.addCorporateInformationFailed("");
    this.props.getTerritoriesList();
  }

  render() {
    // Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Corporate Information | Lab Hazir</title>
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
                            Corporate information account
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {/* {this.props.corporate && this.props.corporate ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              You have registered successfully and you can now{" "}
                              <Link>
                                {" "}
                                <Link
                                  to="/login"
                                  className="fw-medium text-primary"
                                >
                                  {" "}
                                  login
                                </Link>{" "}
                              </Link>{" "}
                              to your account.
                            </Alert>
                          ) : null} */}

                          {this.props.corporate && this.props.corporate ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              The verification link is sent to your email,
                              please verify your account first in order to
                              login.{" "}
                            </Alert>
                          ) : null}
                          {this.props.corporate && this.props.corporate ? (
                            // Redirecting back to the login page
                            setTimeout(() => {
                              if (this.props.corporate) {
                                this.props.history.push("/login");
                              }
                            }, 2000)
                          ) : null}

                          {this.props.addCorporateError &&
                            this.props.addCorporateError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addCorporateError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              logo: (this.state && this.state.logo) || "",
                              national_taxation_no:
                                (this.state && this.state.national_taxation_no) || "",
                              email: (this.state && this.state.email) || "",
                              phone: (this.state && this.state.phone) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              address: (this.state && this.state.address) || "",
                              city_id: (this.state && this.state.city_id) || "",
                              website_url: (this.state && this.state.website_url) || "",
                              payment_terms: (this.state && this.state.payment_terms) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .trim()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(255, "Please enter maximum 255 characters"),

                              logo: Yup.mixed().required(
                                "Please upload your corporate logo"
                              ),
                              // owner_name: Yup.string()
                              //   .trim()
                              //   .required("Please enter corporate owner name")
                              //   .min(3, "Please enter at least 3 characters")
                              //   .max(255, "Please enter maximum 255 characters")
                              //   .matches(
                              //     /^[a-zA-Z][a-zA-Z ]+$/,
                              //     "Please enter only alphabets and spaces"
                              //   ),
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                              landline: Yup.string()
                                .required("Please enter your landline no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                                  "Please enter a valid Pakistani landline number"
                                ),
                              address: Yup.string()
                                .trim()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              website_url: Yup.string()
                                .required("Please enter website url")
                                .url("Please enter a valid url"),

                            })}
                            onSubmit={(values, { setSubmitting }) => {
                              const cityIdArray = Array.isArray(values.city_id) ? values.city_id : [values.city_id];
                              this.props.addCorporateInformation(
                                values,
                                this.props.match.params.id,
                                cityIdArray
                              );
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                              setSubmitting(false); // This line is important to manually set submitting to false after form submission
                            }}
                          >
                          {({ errors, status, touched }) => (
                            <Form className="form-horizontal">
                              {/* Name field */}
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  Corporation Name
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

                              {/* Logo field */}
                              <div className="mb-3">
                                <Label for="name" className="form-label">
                                  Logo
                                </Label>
                                <Input
                                  id="formFile"
                                  name="logo"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png"
                                  onChange={e =>
                                    this.setState({ logo: e.target.files[0] })
                                  }
                                  className={
                                    "form-control" +
                                    (errors.logo && touched.logo
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <ErrorMessage
                                  name="logo"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              {/* Owner name field */}
                              {/* <div className="mb-3">
                                <Label
                                  for="owner_name"
                                  className="form-label"
                                >
                                  Owner name
                                </Label>
                                <Field
                                  id="owner_name"
                                  name="owner_name"
                                  type="text"
                                  onChange={e =>
                                    this.setState({
                                      owner_name: e.target.value,
                                    })
                                  }
                                  value={this.state.owner_name}
                                  className={
                                    "form-control" +
                                    (errors.owner_name && touched.owner_name
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="owner_name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div> */}
                              <div className="mb-3">
                                      <Label
                                        for="national_taxation_no"
                                        className="form-label"
                                      >
                                        Corporate NTN # (National Taxation Number)
                                      </Label>
                                      <Field
                                        id="national_taxation_no"
                                        name="national_taxation_no"
                                        placeholder="Please enter your national taxation no."
                                        type="text"
                                        onChange={e =>
                                          this.setState({
                                            national_taxation_no:
                                              e.target.value,
                                          })
                                        }
                                        value={this.state.national_taxation_no}
                                        className={
                                          "form-control" +
                                          (errors.national_taxation_no &&
                                            touched.national_taxation_no
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="national_taxation_no"
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

                              {/* Phone field */}
                              <div className="mb-3">
                                <Label for="phone" className="form-label">
                                  Phone
                                </Label>
                                <Field
                                  id="phone"
                                  name="phone"
                                  type="text"
                                  onChange={e =>
                                    this.setState({ phone: e.target.value })
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

                              {/* Landline field */}
                              <div className="mb-3">
                                <Label for="landline" className="form-label">
                                  Landline
                                </Label>
                                <Field
                                  id="landline"
                                  name="landline"
                                  type="text"
                                  onChange={e =>
                                    this.setState({
                                      landline: e.target.value,
                                    })
                                  }
                                  value={this.state.landline}
                                  className={
                                    "form-control" +
                                    (errors.landline && touched.landline
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="landline"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              {/* Address field */}
                              <div className="mb-3">
                                <Label for="address" className="form-label">
                                  Complete address
                                </Label>
                                <Field
                                  id="address"
                                  name="address"
                                  type="text"
                                  onChange={e =>
                                    this.setState({ address: e.target.value })
                                  }
                                  value={this.state.address}
                                  className={
                                    "form-control" +
                                    (errors.address && touched.address
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="address"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              {/* City field */}
                              {/* <div className="mb-3">


                                  <Label for="city_id" className="form-label">
                                    City
                                  </Label>
                                  <Select
                                    name="city_id"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        city_id: selectedGroup.value,
                                      })
                                    }
                                    className={
                                      "defautSelectParent" +
                                      (errors.city_id && touched.city_id
                                        ? " is-invalid"
                                        : "")
                                    }
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        borderColor:
                                          errors.city_id && touched.city_id
                                            ? "#f46a6a"
                                            : "#ced4da",
                                      }),
                                    }}
                                    options={
                                      cityList
                                    }
                                    defaultValue={{
                                      label:
                                        this.state.city,
                                      value:
                                        this.state.id,
                                    }}

                                  />

                                  <ErrorMessage
                                    name="city_id"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div> */}
                              <div>

                                <Label for="city_id" className="form-label">
                                  City
                                </Label>
                                <Select
                                  name="city_id"
                                  component="Select"
                                  isMulti={true}
                                  onChange={selectedGroups =>
                                    this.setState({
                                      city_id: selectedGroups.map(group => group.value),
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (errors.city_id && touched.city_id
                                      ? " is-invalid"
                                      : "")
                                  }
                                  styles={{
                                    control: (base, state) => ({
                                      ...base,
                                      borderColor:
                                        errors.city_id && touched.city_id
                                          ? "#f46a6a"
                                          : "#ced4da",
                                    }),
                                  }}
                                  options={
                                    cityList
                                  }
                                  // defaultValue={{
                                  //   label:
                                  //   this.state.city,
                                  //   value:
                                  //   this.state.id,                                       
                                  // }}
                                  placeholder="Select City..."
                                />

                                <ErrorMessage
                                  name="city_id"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                                <div>
                                  <Label
                                    for="payment_terms"
                                    className="form-label"
                                  >
                                    Payment Terms
                                  </Label>
                                  <Field
                                    name="payment_terms"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        payment_terms:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.payment_terms
                                    }
                                    className="form-select"
                                  >
                                    <option value="Payment by Patient to Lab">Payment by Patient to Lab</option>
                                    <option value="Payment by Coorporate to LH">Payment by Corporate to Lab</option>
                                  </Field>
                                </div>

                               {/* {URL Field} */}
                               <div className="mb-3">
                                  <Label
                                    for="website_url"
                                    className="form-label"
                                  >
                                    Website URL
                                  </Label>
                                  <Field
                                    id="website_url"
                                    name="website_url"
                                    placeholder="Enter Website URL (https://)"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        website_url: e.target.value,
                                      })
                                    }
                                    value={this.state.website_url}
                                    className={
                                      "form-control" +
                                      (errors.website_url && touched.website_url
                                        ? " is-invalid"
                                        : "")
                                    }
                                  />
                                  <ErrorMessage
                                    name="website_url"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div>


                              <div className="mt-3 d-grid">
                                <button
                                  className="btn btn-primary btn-block"
                                  type="submit"
                                >
                                  {" "}
                                  Complete Registration{" "}
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
      </React.Fragment >
    );
  }
}

CorporateInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addCorporateInformation: PropTypes.func,
  addCorporateInformationFailed: PropTypes.any,
  addCorporateError: PropTypes.any,
  corporate: PropTypes.any,
  getTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,

};

const mapStateToProps = state => {
  return {
    territoriesList: state.CorporateInformation.territoriesList,
    corporate: state.CorporateInformation.corporate,
    addCorporateError: state.CorporateInformation.addCorporateError,
    loading: state.CorporateInformation.loading
  };
};


export default connect(mapStateToProps, {
  getTerritoriesList,
  addCorporateInformation,
  addCorporateInformationFailed,
})(CorporateInformation);
