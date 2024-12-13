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
import { updateLabProfile, getLabProfile } from "../../store/actions";

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

class LabProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      logo: "",
      owner_name: "",
      registration_no: "",
      national_taxation_no: "",
      lab_experience: "",
      email: "",
      phone: "",
      landline: "",
      address: "",
      city: "",
      district: "",
      complaint_handling_email: "",
      complaint_handling_phone: "",
      is_digital_payment_accepted: "",
      is_Receive_Email_On_Booking:"",
      is_active: "",
      is_blocked: "",
      isProfileUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
  dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  componentDidMount() {
    this.props.getLabProfile(this.state.user_id);

    setTimeout(() => {
      this.setState({
        name: this.props.success.name,
        logo: process.env.REACT_APP_BACKENDURL + this.props.success.logo,
        owner_name: this.props.success.owner_name,
        registration_no: this.props.success.registration_no,
        national_taxation_no: this.props.success.national_taxation_no,
        lab_experience: this.props.success.lab_experience,
        email: this.props.success.email,
        phone: this.props.success.phone,
        landline: this.props.success.landline,
        address: this.props.success.address,
        city: this.props.success.city,
        district: this.props.success.district,
        province: this.props.success.province,
        complaint_handling_email: this.props.success.complaint_handling_email,
        complaint_handling_phone: this.props.success.complaint_handling_phone,
        is_digital_payment_accepted:
          this.props.success.is_digital_payment_accepted,
        is_Receive_Email_On_Booking:
          this.props.success.is_Receive_Email_On_Booking,
        is_active: this.props.success.is_active,
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
                      <div className="me-3">
                        <img
                          src={this.state.logo}
                          alt=""
                          className="avatar-md rounded-circle img-thumbnail"
                        />
                      </div>
                      <div className="align-self-center flex-1">
                        <div className="text-muted">
                          <h5>{this.state.name}</h5>
                          <p className="mb-0">{this.state.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {this.state.isProfileUpdated && this.state.isProfileUpdated ? (
              <Alert color="success">Your profile is updated.</Alert>
            ) : null}

            <h4 className="card-title mb-4">Update Lab Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    logo: (this.state && this.state.logo) || "",
                    owner_name: (this.state && this.state.owner_name) || "",
                    registration_no:
                      (this.state && this.state.registration_no) || "",
                    national_taxation_no:
                      (this.state && this.state.national_taxation_no) || "",
                    lab_experience:
                      (this.state && this.state.lab_experience) || "",
                    email: (this.state && this.state.email) || "",
                    phone: (this.state && this.state.phone) || "",
                    landline: (this.state && this.state.landline) || "",
                    address: (this.state && this.state.address) || "",
                    city: (this.state && this.state.city) || "",
                    district: (this.state && this.state.district) || "",
                    province: (this.state && this.state.province) || "Punjab",
                    complaint_handling_email:
                      (this.state && this.state.complaint_handling_email) || "",
                    complaint_handling_phone:
                      (this.state && this.state.complaint_handling_phone) || "",
                    is_digital_payment_accepted:
                      (this.state && this.state.is_digital_payment_accepted) ||
                      "No",
                    is_Receive_Email_On_Booking:
                      (this.state && this.state.is_Receive_Email_On_Booking) ||
                      "No",
                    is_active: (this.state && this.state.is_active) || "Yes",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters"),
                    lab_experience: Yup.number("Please enter number only")
                      .required("Please enter your lab experience")
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      )
                      .max(
                        150,
                        "Please enter a number less than or equal to 150"
                      ),
                    email: Yup.string()
                      .required("Please enter your email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    // landline: Yup.string()
                    //   .required("Please enter your landline no.")
                    //   .max(255, "Please enter maximum 255 characters")
                    //   .matches(
                    //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                    //     "Please enter a valid Pakistani landline number"
                    //   ),
                    landline: Yup.string()
                    .required("Please enter your landline no.")
                    .max(
                      255,
                      "Please enter maximum 255 characters"
                    ),
                    address: Yup.string()
                      .trim()
                      .required("Please enter your full address")
                      .max(255, "Please enter maximum 255 characters"),
                    city: Yup.string()
                      .trim()
                      .required("Please enter your city")
                      .max(255, "Please enter maximum 255 characters")
                      .matches(
                        /^[a-zA-Z][a-zA-Z ]+$/,
                        "Please enter only alphabets and spaces"
                      ),
                    district: Yup.string()
                      .trim()
                      .required("Please enter your district")
                      .max(255, "Please enter maximum 255 characters")
                      // .matches(
                      //   /^[a-zA-Z][a-zA-Z ]+$/,
                      //   "Please enter only alphabets and spaces"
                      // ),
                  })}
                  onSubmit={values => {
                    // if no file was selected for logo then get current image from url and convert to file
                    if (typeof values.logo == "string") {
                      this.toDataURL(values.logo).then(dataUrl => {
                        var fileData = this.dataURLtoFile(
                          dataUrl,
                          values.logo.split("/").at(-1)
                        );
                        values.logo = fileData;

                        this.props.updateLabProfile(values, this.state.user_id);
                      });
                    }

                    // Otherwise just call update method
                    else {
                      this.props.updateLabProfile(values, this.state.user_id);
                    }

                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getLabProfile(this.state.user_id);
                    }, 1000);

                    // To display updated logo
                    setTimeout(() => {
                      this.setState({
                        logo:
                          process.env.REACT_APP_BACKENDURL +
                          this.props.success.logo,
                      });
                    }, 2000);

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
                          Lab name
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
                            (errors.name && touched.name ? " is-invalid" : "")
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
                          Logo (Choose file only if you want to change logo)
                        </Label>
                        <Row>
                          <Col md={8} lg={8}>
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
                              className="form-control"
                            />
                          </Col>

                          <Col md={4} lg={4}>
                            <div className="mt-2">
                              <strong>Currently: </strong>{" "}
                              <Link
                                to={{
                                  pathname:
                                    process.env.REACT_APP_BACKENDURL +
                                    this.props.success.logo,
                                }}
                                target="_blank"
                              >
                                Logo
                              </Link>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* National Taxation No  field */}
                      <div className="mb-3">
                        <Label
                          for="national_taxation_no"
                          className="form-label"
                        >
                          Lab NTN #
                        </Label>
                        <Field
                          id="national_taxation_no"
                          name="national_taxation_no"
                          className="form-control"
                          type="text"
                          readOnly={true}
                        />
                      </div>
                      {/* Lab experience field */}
                      {/* <div className="mb-3">
                        <Label for="lab_experience" className="form-label">
                          Lab Experience (Years)
                        </Label>
                        <Field
                          id="lab_experience"
                          name="lab_experience"
                          type="number"
                          onChange={e =>
                            this.setState({ lab_experience: e.target.value })
                          }
                          value={this.state.lab_experience}
                          className={
                            "form-control" +
                            (errors.lab_experience && touched.lab_experience
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="lab_experience"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div> */}
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
                          <option value="Balochistan">Balochistan</option>
                          <option value="Khyber Pakhtunkhawa">
                            Khyber Pakhtunkhawa
                          </option>
                          <option value="Islamabad Capital Territory">
                            Islamabad Capital Territory
                          </option>
                        </Field>
                      </div> */}
                      {/* District field */}
                      <div className="mb-3">
                        <Label for="district" className="form-label">
                          District
                        </Label>

                        <Select
                          value={
                            this.state.district != ""
                              ? {
                                  label: this.state.district,
                                  value: this.state.district,
                                }
                              : {
                                  label: this.props.success.district,
                                  value: this.props.success.district,
                                }
                          }
                          name="district"
                          component="Select"
                          onChange={selectedGroup =>
                            this.setState({
                              district: selectedGroup.value,
                            })
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor:
                                errors.district && touched.district
                                  ? "#f46a6a"
                                  : "#ced4da",
                            }),
                          }}
                          className={
                            "defautSelectParent" +
                            (errors.district && touched.district
                              ? " is-invalid"
                              : "")
                          }
                          options={DISTRICTS}
                          placeholder="Select District..."
                        />

                        <ErrorMessage
                          name="district"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      {/* City field */}
                      <div className="mb-3">
                        <Label for="city" className="form-label">
                          City
                        </Label>
                        <Select
                          value={
                            this.state.city != ""
                              ? {
                                  label: this.state.city,
                                  value: this.state.city,
                                }
                              : {
                                  label: this.props.success.city,
                                  value: this.props.success.city,
                                }
                          }
                          name="city"
                          component="Select"
                          onChange={selectedGroup =>
                            this.setState({
                              city: selectedGroup.value,
                            })
                          }
                          className={
                            "defautSelectParent" +
                            (errors.city && touched.city ? " is-invalid" : "")
                          }
                          styles={{
                            control: (base, state) => ({
                              ...base,
                              borderColor:
                                errors.city && touched.city
                                  ? "#f46a6a"
                                  : "#ced4da",
                            }),
                          }}
                          options={CITIES}
                          placeholder="Select City..."
                        />

                        <ErrorMessage
                          name="city"
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

LabProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateLabProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabProfile: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.LabProfile;
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateLabProfile,
    getLabProfile,
  })(LabProfile)
);
