import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { Alert, Col, Container, Row, Label, Input } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

// action
import {
  getTerritoriesList,
  getMainLabs,
  getMainLabsSuccess,
  addLabInformation,
  addLabInformationFailed,
} from "../../store/actions";

// Redux
import { connect } from "react-redux";

let mainLabOptionGroup = [
  {
    options: [],
  },
];
let territoriesOptionGroup = [
  {
    options: [],
  },
];

// To give error border effect on single value select
const errorStyle = {
  control: base => ({
    ...base,
    borderColor: "#f46a6a",
  }),
};

// To remove thick blue border effect
const style = {
  control: (base, state) => ({
    ...base,
    // This line disable the blue border
    boxShadow: state.isFocused ? 0 : 1,
    "&:hover": {
      border: state.isFocused ? 0 : 1,
    },
  }),
};

class LabInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      type: "Main Lab",
      branch_name: "",
      main_lab_account_id: "",
      logo: "",
      national_taxation_no: "",
      lab_experience: "",
      is_homesampling_offered: "No",
      home_sampling_charges: "",
      state_sampling_charges: "",
      state_sampling_time: "",
      landline: "",
      address: "",
      city_id: "",
      email: "",
      // province: "Punjab",
      is_digital_payment_accepted: "Yes",
      registered_by: "Lab",
      is_registering_for_first_time: "No",
      marketer_name: "",
      marketer_cnic: "",
      marketer_email: "",
      marketer_phone: "",
      marketer_city: "",
      // territoriesList: [],
    };
  }

  componentDidMount() {
    this.props.getMainLabs(); // Calling to get labs list from database
    this.props.addLabInformationFailed("");
    this.props.getTerritoriesList();

    // Wait for sometime so that response is loaded from database
    setTimeout(() => {
      if (this.props.labs.length) {
        const labs = this.props.labs;
        // const mainLabs = this.props.labs.filter(lab => lab.type === "main lab");

        for (let i = 0; i < labs.length; i++) {
          mainLabOptionGroup[0]["options"].push({
            label: labs[i].name,
            value: labs[i].account_id,
          });
        }
      }
    }, 2000);
    // setTimeout(() => {
    //   if (this.props.territoriesList.length) {
    //     const territoriesList = this.props.territoriesList;
    //     for (let i = 0; i < territoriesList.length; i++) {
    //       territoriesOptionGroup[0]["options"].push({
    //         label: territoriesList[i].city,
    //         value: territoriesList[i].id,
    //       });
    //     }
    //   }
    // }, 2000);
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ main_lab_account_id: selectedGroup.value });
  };

  handleTypeChange = e => {
    this.setState({ lab_experience: e.target.value });

    if (this.state.type === "Collection Point") {
    }
  };

  handleISOCertificateChange = e => {
    this.setState({ iso_certificate: e.target.files[0] });
    this.setState({ iso_certificate_error: "" });
  };

  render() {
    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }

    // list of district from territories
    // const districtList = [];
    // for (let i = 0; i < this.props.territoriesList.length; i++) {
    //   districtList.push({
    //     label: this.props.territoriesList[i].district,
    //     value: this.props.territoriesList[i].office,
    //   });
    // }

    // Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }
    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Lab Information | Lab Hazir</title>
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
                            Lab account information - Step 2 of 2
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.lab && this.props.lab ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              The verification link is sent to your email,
                              please verify your account first in order to
                              login.{" "}
                            </Alert>
                          ) : null}
                          {this.props.lab && this.props.lab ? (
                            // Redirecting back to the login page
                            setTimeout(() => {
                              if (this.props.lab) {
                                this.props.history.push("/login");
                              }
                            }, 2000)
                          ) : null}


                          {this.props.addLabError && this.props.addLabError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addLabError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              type:
                                (this.state && this.state.type) || "Main Lab",
                              branch_name:
                                (this.state && this.state.branch_name) || "",
                              main_lab_account_id:
                                (this.state &&
                                  this.state.main_lab_account_id) ||
                                "",
                              email:
                                (this.state &&
                                  this.state.email) ||
                                "",
                              logo: (this.state && this.state.logo) || "",
                              national_taxation_no:
                                (this.state &&
                                  this.state.national_taxation_no) ||
                                "",
                              lab_experience:
                                (this.state && this.state.lab_experience) || "",
                              is_homesampling_offered:
                                (this.state && this.state.is_homesampling_offered) || "No",
                              home_sampling_charges:
                                (this.state && this.state.home_sampling_charges) || "",
                              state_sampling_charges:
                                (this.state && this.state.state_sampling_charges) || "",
                              state_sampling_time:
                                (this.state && this.state.state_sampling_time) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              address: (this.state && this.state.address) || "",
                              city_id: (this.state && this.state.city_id) || "",
                              // office:
                              //   (this.state && this.state.office) || "",
                              // province:
                              //   (this.state && this.state.province) || "Punjab",
                              is_digital_payment_accepted:
                                (this.state &&
                                  this.state.is_digital_payment_accepted) ||
                                "Yes",
                              registered_by:
                                (this.state && this.state.registered_by) ||
                                "Lab",
                              is_registering_for_first_time:
                                (this.state &&
                                  this.state.is_registering_for_first_time) ||
                                "No",
                              lab_staff_name:
                                (this.state && this.state.lab_staff_name) || "",
                              lab_staff_designation:
                                (this.state &&
                                  this.state.lab_staff_designation) ||
                                "",
                              marketer_name:
                                (this.state && this.state.marketer_name) || "",
                              marketer_cnic:
                                (this.state && this.state.marketer_cnic) || "",
                              marketer_email:
                                (this.state && this.state.marketer_email) || "",
                              marketer_phone:
                                (this.state && this.state.marketer_phone) || "",
                              marketer_city:
                                (this.state && this.state.marketer_city) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              name: Yup.string()
                                .trim()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),

                              main_lab_account_id: Yup.string().when("type", {
                                is: val => val === "Collection Point",
                                then: Yup.string().required(
                                  "Please enter your main lab"
                                ),
                              }),
                              branch_name: Yup.string().when("type", {
                                is: val => val === "Collection Point",
                                then: Yup.string()
                                  .trim()
                                  .required("Please enter your branch name")
                                  .min(3, "Please enter at least 3 characters")
                                  .max(
                                    255,
                                    "Please enter maximum 255 characters"
                                  ),
                              }),
                              // Validation for logo based on type value
                              type: Yup.string(),
                              logo: Yup.mixed().test(
                                "required",
                                "Please upload logo",
                                function (val) {
                                  const { type, logo } = this.parent;
                                  if (type === "Main Lab") {
                                    return logo ? true : false;
                                  } else {
                                    return true;
                                  }
                                }
                              ),
                              national_taxation_no: Yup.string().when("type", {
                                is: val => val === "Main Lab",
                                then: Yup.string()
                                  .trim()
                                  .required("Please enter NTN # of your lab")
                                  .max(
                                    255,
                                    "Please enter maximum 255 characters"
                                  ),
                              }),
                              // Validation for logo based on type value
                              type: Yup.string(),
                              lab_experience: Yup.number(
                                "Please enter number only"
                              )
                                .positive()
                                .integer()
                                .min(
                                  0,
                                  "Please enter a number greater than or equal to 0"
                                )
                                .max(
                                  150,
                                  "Please enter a number less than or equal to 150"
                                )
                                .test(
                                  "required",
                                  "Please enter your lab experience",
                                  function (val) {
                                    const { type, lab_experience } =
                                      this.parent;
                                    if (type === "Main Lab") {
                                      return lab_experience ? true : false;
                                    } else {
                                      return true;
                                    }
                                  }
                                ),
                              landline: Yup.string()
                                .required("Please enter your landline no.")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              address: Yup.string()
                                .trim()
                                .required("Please enter your full address")
                                .max(
                                  255,
                                  "Please enter maximum 255 characters"
                                ),
                              // city: Yup.string()
                              //   .trim()
                              //   .required("Please select your city")
                              //   .max(255, "Please enter maximum 255 characters")
                              //   .matches(
                              //     /^[a-zA-Z][a-zA-Z ]+$/,
                              //     "Please enter only alphabets and spaces"
                              //   ),

                              lab_staff_name: Yup.string().when(
                                "registered_by",
                                {
                                  is: val => val == "Lab",
                                  then: Yup.string()
                                    .trim()
                                    .required("Please enter your name")
                                    .min(
                                      3,
                                      "Please enter at least 3 characters"
                                    )
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    ),

                                }
                              ),

                              lab_staff_designation: Yup.string().when(
                                "registered_by",
                                {
                                  is: val => val == "Lab",
                                  then: Yup.string()
                                    .trim()
                                    .required("Please enter your designation")
                                    .min(
                                      3,
                                      "Please enter at least 3 characters"
                                    )
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    )
                                    .matches(
                                      /^[a-zA-Z][a-zA-Z ]+$/,
                                      "Please enter only alphabets  spaces"
                                    ),
                                }
                              ),
                              marketer_name: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                    .trim()
                                    .required("Please enter marketer name")
                                    .min(
                                      3,
                                      "Please enter at least 3 characters"
                                    )
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    ),

                                }
                              ),
                              marketer_cnic: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                    .required("Please enter marketer CNIC")
                                    .matches(
                                      /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                      "Please enter a valid CNIC e.g. 37106-8234782-3"
                                    )
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    ),
                                }
                              ),

                              marketer_email: Yup.string().when(
                                "registered_by",
                                {
                                  is: val => val == "Marketer",
                                  then: Yup.string()
                                    .required("Please enter marketer email")
                                    .email("Please enter valid email")
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    ),
                                }
                              ),
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email"),
                              marketer_phone: Yup.string().when(

                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                    .required(
                                      "Please enter marketer mobile no."
                                    )
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    )
                                    .matches(
                                      /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                      "Please enter a valid Pakistani phone number e.g. 03123456789"
                                    ),
                                }
                              ),
                              marketer_city: Yup.string().when(
                                "is_registering_for_first_time",
                                {
                                  is: val => val == "Yes",
                                  then: Yup.string()
                                    .trim()
                                    .required("Please select marketer city")
                                    .max(
                                      255,
                                      "Please enter maximum 255 characters"
                                    )
                                    .matches(
                                      /^[a-zA-Z][a-zA-Z ]+$/,
                                      "Please enter only alphabets and spaces"
                                    ),
                                }
                              ),
                            })}
                            onSubmit={values => {
                              this.props.addLabInformation(
                                values,
                                this.props.match.params.id
                              );
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                {/* <pre>{JSON.stringify(errors, null, 2)}</pre> */}
                                {/* Name field */}
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Lab name
                                  </Label>
                                  <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Please enter your lab name"
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

                                {/* Type field */}
                                <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    Main Lab / Collection Point
                                  </Label>
                                  <Field
                                    name="type"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        type: e.target.value,
                                      })
                                    }
                                    value={this.state.type}
                                    className="form-select"
                                  >
                                    <option value="Main Lab">Main Lab</option>
                                    <option value="Collection Point">
                                      Collection Point
                                    </option>
                                  </Field>
                                  <p className="text-danger">Note: once the lab type is selected such as Main Lab or Collection Point, it cannot be changed at any later stage.</p>
                                </div>

                                {/* Branch name field */}
                                {this.state.type === "Collection Point" && (
                                  <div className="mb-3">
                                    <Label
                                      for="branch_name"
                                      className="form-label"
                                    >
                                      Branch name
                                    </Label>
                                    <Field
                                      id="branch_name"
                                      name="branch_name"
                                      type="text"
                                      placeholder="Please enter your lab branch name"
                                      onChange={e =>
                                        this.setState({
                                          branch_name: e.target.value,
                                        })
                                      }
                                      value={this.state.branch_name}
                                      className={
                                        "form-control" +
                                        (errors.branch_name &&
                                          touched.branch_name
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="branch_name"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                )}

                                {/* Main lab name field */}
                                {this.state.type === "Collection Point" && (
                                  <div className="mb-3">
                                    <Label
                                      for="main_lab_account_id"
                                      className="form-label"
                                    >
                                      What is your main lab name?
                                    </Label>
                                    <Select
                                      styles={
                                        errors.main_lab_account_id &&
                                          touched.main_lab_account_id
                                          ? errorStyle
                                          : style
                                      }
                                      name="main_lab_account_id"
                                      component="select"
                                      onChange={this.handleSelectGroup}
                                      className="defautSelectParent is-invalid"
                                      options={mainLabOptionGroup}
                                    />

                                    {touched.main_lab_account_id &&
                                      errors.main_lab_account_id && (
                                        <div
                                          style={{
                                            marginTop: "0.25rem",
                                            fontSize: "80%",
                                            color: "#f46a6a",
                                          }}
                                        >
                                          Please select your main lab
                                        </div>
                                      )}
                                  </div>
                                )}

                                {this.state.type !== "Collection Point" && (
                                  <div>
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
                                          this.setState({
                                            logo: e.target.files[0],
                                          })
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

                                    {/* National Taxation No field */}
                                    <div className="mb-3">
                                      <Label
                                        for="national_taxation_no"
                                        className="form-label"
                                      >
                                        Lab NTN # (National Taxation Number)
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
                                    {/* Lab experience field */}
                                    <div className="mb-3">
                                      <Label
                                        for="lab_experience"
                                        className="form-label"
                                      >
                                        Lab Experience (Years)
                                      </Label>
                                      <Field
                                        id="lab_experience"
                                        name="lab_experience"
                                        placeholder="Please enter your lab experience (in years)"
                                        type="number"
                                        onChange={e =>
                                          this.setState({
                                            lab_experience: e.target.value,
                                          })
                                        }
                                        value={this.state.lab_experience}
                                        className={
                                          "form-control" +
                                          (errors.lab_experience &&
                                            touched.lab_experience
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="lab_experience"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Email field */}
                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    name="email"
                                    placeholder="Enter email"
                                    onChange={e =>
                                      this.setState({
                                        email: e.target.value,
                                      })
                                    }
                                    type="text"
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

                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label for="landline" className="form-label">
                                    Lab Phone No./UAN
                                  </Label>
                                  <Field
                                    id="landline"
                                    name="landline"
                                    type="text"
                                    placeholder="Please enter your landline no."
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
                                    Address on Google Map
                                  </Label>
                                  <Field
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Please enter your complete address searchable on Google Maps"
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
                                  <span className="text-primary font-size-12">
                                    <strong>
                                      Note: Please add the complete valid
                                      address searchable on google maps.
                                    </strong>
                                  </span>
                                </div>

                                {/* Province field */}
                                {/* <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    Province
                                  </Label>
                                  <Field
                                    name="province"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        province: e.target.value,
                                      })
                                    }
                                    value={this.state.province}
                                    className="form-select"
                                  >
                                    <option value="Punjab">Punjab</option>
                                    <option value="Sindh">Sindh</option>
                                    <option value="Balochistan">
                                      Balochistan
                                    </option>
                                    <option value="Khyber Pakhtunkhawa">
                                      Khyber Pakhtunkhawa
                                    </option>
                                    <option value="Islamabad Capital Territory">
                                      Islamabad Capital Territory
                                    </option>
                                  </Field>
                                </div> */}


                                {/* District field */}
                                {/* <div className="mb-3">
                          <Label for="office" className="form-label">
                            District
                          </Label>
                          <Select
                            name="office"
                            component="Select"
                            onChange={selectedGroup =>
                              this.setState({
                                office: selectedGroup.value,
                              })
                            }
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                borderColor:
                                  errors.office && touched.office
                                    ? "#f46a6a"
                                    : "#ced4da",
                              }),
                            }}
                            className={
                              "defautSelectParent" +
                              (errors.office && touched.office
                                ? " is-invalid"
                                : "")
                            }
                            options={DISTRICTS}
                            placeholder="Select District..."
                          />
                          <ErrorMessage
                            name="office"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>  */}


                                {/* city field */}
                                <div className="mb-3">


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
                                </div>


                                {/* District field */}
                                {/* <div className="mb-3">
                                  <Label for="office" className="form-label">
                                    District
                                  </Label>
                                  <Select
                                    name="office"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        office: selectedGroup.value,
                                      })
                                    }
                                    className="defautSelectParent"
                                    options={
                                      districtList
                                    }
                                    defaultValue={{
                                      label:
                                      this.state.district,
                                      value:
                                      this.state.office, 
                                                                            
                                    }}
                                  />
                                  <ErrorMessage
                                    name="office"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div> */}

                                {/* City field */}
                                {/* <div className="mb-3">
                                  <Label for="city" className="form-label">
                                    City
                                  </Label>
                                  <Select
                                    name="city"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        city: selectedGroup.value,
                                      })
                                    }
                                    placeholder="Select City..."
                                    className="defautSelectParent"
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
                                    name="city"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div> */}
                                {/* Accept Digital Payments field */}
                                <div className="mb-3">
                                  <Label
                                    for="is_digital_payment_accepted"
                                    className="form-label"
                                  >
                                    Do you accept digital payments?
                                  </Label>
                                  <Field
                                    name="is_digital_payment_accepted"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        is_digital_payment_accepted:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_digital_payment_accepted
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>

                                <div className="mb-3">
                                  <Label
                                    for="is_homesampling_offered"
                                    className="form-label"
                                  >
                                    Are you Offering Home Sampling?
                                  </Label>
                                  <Field
                                    name="is_homesampling_offered"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        is_homesampling_offered:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_homesampling_offered
                                    }

                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>
                                {this.state.is_homesampling_offered == "Yes" ? (
                                  <div>
                                    <div className="mb-3">
                                      <Label
                                        for="home_sampling_charges"
                                        className="form-label"
                                      >
                                        Charges for Offering Routine Home Sampling
                                      </Label>
                                      <Field
                                        id="home_sampling_charges"
                                        name="home_sampling_charges"
                                        type="number"
                                        onChange={e =>
                                          this.setState({
                                            home_sampling_charges: e.target.value,
                                          })
                                        }
                                        placeholder="Please enter the Normal Home Sampling Charges"
                                        value={this.state.home_sampling_charges}
                                        className={
                                          "form-control" +
                                          (errors.home_sampling_charges &&
                                            touched.home_sampling_charges
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="home_sampling_charges"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <Label
                                        for="state_sampling_charges"
                                        className="form-label"
                                      >
                                        Charges for Offering Urgent Home Sampling
                                      </Label>
                                      <Field
                                        id="state_sampling_charges"
                                        name="state_sampling_charges"
                                        type="number"
                                        onChange={e =>
                                          this.setState({
                                            state_sampling_charges: e.target.value,
                                          })
                                        }
                                        value={this.state.state_sampling_charges}
                                        placeholder="Please enter the Urgent Home Sampling Charges"
                                        className={
                                          "form-control" +
                                          (errors.state_sampling_charges &&
                                            touched.state_sampling_charges
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="state_sampling_charges"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                    <div className="mb-3">
                                      <Label for="state_sampling_time" className="form-label">
                                        Sampling Collection Time in case of Urgent Home Sampling (In hours)
                                      </Label>
                                      <Field
                                        id="state_sampling_time"
                                        name="state_sampling_time"
                                        type="number"
                                        onChange={(e) =>
                                          this.setState({
                                            state_sampling_time: Math.max(0, Math.min(3, e.target.value)),
                                          })
                                        }
                                        value={this.state.state_sampling_time}
                                        placeholder="Please enter Urgent Home Sampling Time (In Hours)"
                                        min={0}
                                        max={3}
                                        // step={1}
                                        className={
                                          "form-control" +
                                          (errors.state_sampling_time && touched.state_sampling_time
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <p className="text-primary">Note: Urgent Home Sampling can be more than 3 hours.</p>
                                      <ErrorMessage
                                        name="state_sampling_time"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>

                                  </div>
                                ) : null}


                                {/* Registered by field */}
                                <div className="mb-3">
                                  <Label
                                    for="registered_by"
                                    className="form-label"
                                  >
                                    Who is registering lab?
                                  </Label>
                                  <Field
                                    name="registered_by"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        registered_by: e.target.value,
                                      })
                                    }
                                    defaultValue={this.state.registered_by}
                                    className="form-select"
                                  >
                                    <option value="Lab">Lab</option>
                                    <option value="Marketer">Marketer</option>
                                  </Field>
                                </div>

                                {this.state.registered_by === "Lab" && (
                                  <div>
                                    {/* Lab Staff Name field */}
                                    <div className="mb-3">
                                      <Label
                                        for="lab_staff_name"
                                        className="form-label"
                                      >
                                        Registered by (Name)
                                      </Label>
                                      <Field
                                        id="lab_staff_name"
                                        name="lab_staff_name"
                                        type="text"
                                        placeholder="Please enter the name of person registering lab"
                                        onChange={e =>
                                          this.setState({
                                            lab_staff_name: e.target.value,
                                          })
                                        }
                                        value={this.state.lab_staff_name}
                                        className={
                                          "form-control" +
                                          (errors.lab_staff_name &&
                                            touched.lab_staff_name
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="lab_staff_name"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>

                                    {/* Lab Staff Designation field */}
                                    <div className="mb-3">
                                      <Label
                                        for="lab_staff_designation"
                                        className="form-label"
                                      >
                                        Lab Staff Designation
                                      </Label>
                                      <Field
                                        id="lab_staff_designation"
                                        name="lab_staff_designation"
                                        type="text"
                                        placeholder="Please enter the designation of person registering lab"
                                        onChange={e =>
                                          this.setState({
                                            lab_staff_designation:
                                              e.target.value,
                                          })
                                        }
                                        value={this.state.lab_staff_designation}
                                        className={
                                          "form-control" +
                                          (errors.lab_staff_designation &&
                                            touched.lab_staff_designation
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="lab_staff_designation"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Marketer's fields */}
                                {this.state.registered_by === "Marketer" && (
                                  <div>
                                    {/* Is Registering First Time field */}
                                    <div className="mb-3">
                                      <Label
                                        for="is_registering_for_first_time"
                                        className="form-label"
                                      >
                                        Are you registering lab for the first
                                        time?
                                      </Label>
                                      <Field
                                        name="is_registering_for_first_time"
                                        component="select"
                                        onChange={e =>
                                          this.setState({
                                            is_registering_for_first_time:
                                              e.target.value,
                                          })
                                        }
                                        value={
                                          this.state
                                            .is_registering_for_first_time
                                        }
                                        className="form-select"
                                      >
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                      </Field>
                                    </div>

                                    {/* Marketer Email field */}
                                    <div className="mb-3">
                                      <Label
                                        for="marketer_email"
                                        className="form-label"
                                      >
                                        Marketer Email
                                      </Label>
                                      <Field
                                        name="marketer_email"
                                        type="text"
                                        placeholder="Please enter marketer email"
                                        onChange={e =>
                                          this.setState({
                                            marketer_email: e.target.value,
                                          })
                                        }
                                        value={this.state.marketer_email}
                                        className={
                                          "form-control" +
                                          (errors.marketer_email &&
                                            touched.marketer_email
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />
                                      <ErrorMessage
                                        name="marketer_email"
                                        component="div"
                                        className="invalid-feedback"
                                      />
                                    </div>

                                    {this.state
                                      .is_registering_for_first_time ===
                                      "Yes" && (
                                        <div>
                                          {/* Marketer Name field */}
                                          <div className="mb-3">
                                            <Label
                                              for="marketer_name"
                                              className="form-label"
                                            >
                                              Marketer Name
                                            </Label>
                                            <Field
                                              id="marketer_name"
                                              name="marketer_name"
                                              type="text"
                                              placeholder="Please enter marketer name"
                                              onChange={e =>
                                                this.setState({
                                                  marketer_name: e.target.value,
                                                })
                                              }
                                              value={this.state.marketer_name}
                                              className={
                                                "form-control" +
                                                (errors.marketer_name &&
                                                  touched.marketer_name
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="marketer_name"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>

                                          {/* Marketer CNIC field */}
                                          <div className="mb-3">
                                            <Label
                                              for="marketer_cnic"
                                              className="form-label"
                                            >
                                              Marketer CNIC
                                            </Label>
                                            <Field
                                              id="marketer_cnic"
                                              name="marketer_cnic"
                                              type="text"
                                              placeholder="Please enter marketer cnic"
                                              onChange={e =>
                                                this.setState({
                                                  marketer_cnic: e.target.value,
                                                })
                                              }
                                              value={this.state.marketer_cnic}
                                              className={
                                                "form-control" +
                                                (errors.marketer_cnic &&
                                                  touched.marketer_cnic
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="marketer_cnic"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>

                                          {/* Marketer Phone field */}
                                          <div className="mb-3">
                                            <Label
                                              for="marketer_phone"
                                              className="form-label"
                                            >
                                              Marketer Mobile No.
                                            </Label>
                                            <Field
                                              id="marketer_phone"
                                              name="marketer_phone"
                                              type="text"
                                              placeholder="Please enter marketer mobile no."
                                              onChange={e =>
                                                this.setState({
                                                  marketer_phone: e.target.value,
                                                })
                                              }
                                              value={this.state.marketer_phone}
                                              className={
                                                "form-control" +
                                                (errors.marketer_phone &&
                                                  touched.marketer_phone
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                            />
                                            <ErrorMessage
                                              name="marketer_phone"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>

                                          {/* Marketer City field */}
                                          <div className="mb-3">
                                            <Label
                                              for="marketer_city"
                                              className="form-label"
                                            >
                                              Marketer City
                                            </Label>
                                            <Select
                                              name="marketer_city"
                                              component="Select"
                                              onChange={selectedGroup =>
                                                this.setState({
                                                  marketer_city:
                                                    selectedGroup.value,
                                                })
                                              }
                                              className={
                                                "defautSelectParent" +
                                                (errors.marketer_city &&
                                                  touched.marketer_city
                                                  ? " is-invalid"
                                                  : "")
                                              }
                                              styles={{
                                                control: (base, state) => ({
                                                  ...base,
                                                  borderColor:
                                                    errors.marketer_city &&
                                                      touched.marketer_city
                                                      ? "#f46a6a"
                                                      : "#ced4da",
                                                }),
                                              }}
                                              options={CITIES}
                                              placeholder="Select City..."
                                            />

                                            <ErrorMessage
                                              name="marketer_city"
                                              component="div"
                                              className="invalid-feedback"
                                            />
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                )}
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
      </React.Fragment>
    );
  }
}

LabInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  onGetMainLabs: PropTypes.func,
  labs: PropTypes.array,
  getTerritoriesList: PropTypes.func,
  getMainLabs: PropTypes.func,
  getMainLabsSuccess: PropTypes.func,
  addLabInformation: PropTypes.func,
  addLabInformationFailed: PropTypes.any,
  addLabError: PropTypes.any,
  lab: PropTypes.any,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => ({
  addLabError: state.LabInformation.addLabError,
  lab: state.LabInformation.lab,
  labs: state.LabInformation.labs,
  territoriesList: state.LabInformation.territoriesList,
});

export default connect(mapStateToProps, {
  getTerritoriesList,
  getMainLabs,
  getMainLabsSuccess,
  addLabInformation,
  addLabInformationFailed,
})(LabInformation);