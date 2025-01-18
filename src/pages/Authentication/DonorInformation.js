import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label } from "reactstrap";
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
  addDonorInformation,
  addDonorInformationFailed,
} from "../../store/auth/donorinformation/actions";

// Redux
import { connect } from "react-redux";

class DonorInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone:"",
      email: "",
      type:"",
      cnic:"",
      company_name:"",
      is_income_tax_payable:"",
      national_taxation_no:"",
      is_blocked:"",
      city_id: "",
      // district: "",
      // province: "Punjab",


    };
  }

  componentDidMount() {
    this.props.addDonorInformationFailed("");
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

    // const districtList = [];
    // for (let i = 0; i < this.props.territoriesList.length; i++) {
    //   districtList.push({
    //     label: this.props.territoriesList[i].district,
    //     value: this.props.territoriesList[i].id,
    //   });
    // }
    // const provinceList = [];
    // for (let i = 0; i < this.props.territoriesList.length; i++) {
    //   provinceList.push({
    //     label: this.props.territoriesList[i].province,
    //     value: this.props.territoriesList[i].id,
    //   });
    // }
    //Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Donor Information | Lab Hazir</title>
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
                            Donor account information
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.donor&& this.props.donor? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              The verification link is sent to your email,
                              please verify your account first in order to
                              login.{" "}
                            </Alert>
                          ) : null}

                          {this.props.donor&& this.props.donor? (
                             setTimeout(() => {
                              if (this.props.donor) {
                                this.props.history.push("/login");
                              }
                            }, 2000)
                          ) : null}

                          

                          {this.props.addDonorError &&
                          this.props.addDonorError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addDonorError}
                            </Alert>
                          ) : null}

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
                              national_taxation_no: (this.state && this.state.national_taxation_no) || "",
                              is_blocked: (this.state && this.state.is_blocked) || "",
                              // province:
                              // (this.state && this.state.province) || "",
                              // district:
                              //   (this.state && this.state.district) || "",
                              city_id:
                                (this.state && this.state.city_id) || "",

                            }}
                            validationSchema={Yup.object().shape({
                              // name: Yup.string()
                              //   .trim()
                              //   .required("Please enter your name")
                              //   .min(3, "Please enter at least 3 characters")
                              //   .max(255, "Please enter maximum 255 characters")
                              //   .matches(
                              //     /^[a-zA-Z][a-zA-Z ]+$/,
                              //     "Please enter only alphabets and spaces"
                              //   ),
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email"),
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                            })}
                            onSubmit={values => {
                              this.props.addDonorInformation(
                                values,
                                this.props.match.params.id
                              );
                              window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
                              // Redirecting back to the login page
                              
                            }}
                          >
                            {({ errors, status, touched }) => (
                              <Form className="form-horizontal">
                                  <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Name
                                  </Label>
                                  <Field
                                    id="name"
                                    name="name"
                                    placeholder="Enter Name"
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
                                {/* Landline field */}
                                <div className="mb-3">
                                  <Label for="phone" className="form-label">
                                    Phone
                                  </Label>
                                  <Field
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter phone No"
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
                                  {/* Type field */}
                                  <div className="mb-3">
                                  <Label for="type" className="form-label">
                                    Individual / Company
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
                                    <option
                                      value=""
                                    >
                                      --- Please select the Type
                                      ---
                                    </option>
                                    <option value="Individual">Individual</option>
                                    <option value="Company">
                                    Company
                                    </option>
                                  </Field>
                                </div>
                                  {/* Name field */}
                                  {this.state.type === "Individual" && (
                                  <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Name
                                  </Label>
                                  <Field
                                    id="name"
                                    name="name"
                                    placeholder="Enter Name"
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
                                )}
                                    {/* Branch name field */}
                                    {this.state.type === "Individual" && (
                                  <div className="mb-3">
                                    <Label
                                      for="cnic"
                                      className="form-label"
                                    >
                                      CNIC
                                    </Label>
                                    <Field
                                      id="cnic"
                                      name="cnic"
                                      type="text"
                                      placeholder="Please enter your cnic"
                                      onChange={e =>
                                        this.setState({
                                          cnic: e.target.value,
                                        })
                                      }
                                      value={this.state.cnic}
                                      className={
                                        "form-control" +
                                        (errors.cnic &&
                                        touched.cnic
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="cnic"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                )}
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
                                  <Label for="district" className="form-label">
                                    District
                                  </Label>
                                  <Select
                                    name="district"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        district: selectedGroup.value,
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
                                      this.state.id,                                       
                                    }}
                                  />
                                  <ErrorMessage
                                    name="district"
                                    component="div"
                                    className="invalid-feedback"
                                  />
                                </div> */}
                                
                                {/* City field */}
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
                                    placeholder="Select City..."
                                    className="defautSelectParent"
                                    options={
                                      cityList
                                    }
                                    defaultValue={{
                                      label:
                                      this.state.city_id,
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
                                {/* Branch name field */}
                                {this.state.type === "Company" && (
                                  <div className="mb-3">
                                    <Label
                                      for="company_name"
                                      className="form-label"
                                    >
                                      Company name
                                    </Label>
                                    <Field
                                      id="company_name"
                                      name="company_name"
                                      type="text"
                                      placeholder="Please enter your company name"
                                      onChange={e =>
                                        this.setState({
                                          company_name: e.target.value,
                                        })
                                      }
                                      value={this.state.company_name}
                                      className={
                                        "form-control" +
                                        (errors.company_name &&
                                        touched.company_name
                                          ? " is-invalid"
                                          : "")
                                      }
                                    />
                                    <ErrorMessage
                                      name="comapny_name"
                                      component="div"
                                      className="invalid-feedback"
                                    />
                                  </div>
                                )}
                                {/* Main lab name field */}
                                {this.state.type === "Company" && (
                                  <div className="mb-3">
                                    <Label
                                      for="is_income_tax_payable"
                                      className="form-label"
                                    >
                                      Is Income Tax Payable?
                                    </Label>
                                    <Field
                                    name="is_income_tax_payable"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        is_income_tax_payable:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_income_tax_payable
                                    }
                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                  </div>
                                )}
                                {this.state.type === "Company" && (
                                <div className="mb-3">
                                  <Label for="national_taxation_no" className="form-label">
                                    NTN No
                                  </Label>
                                  <Field
                                    name="national_taxation_no"
                                    placeholder="Enter national_taxation_no"
                                    onChange={e =>
                                      this.setState({
                                        national_taxation_no: e.target.value,
                                      })
                                    }
                                    type="text"
                                    value={this.state.national_taxation_no}

                                    className={
                                      "form-control" +
                                      (errors.national_taxation_no && touched.national_taxation_no
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

DonorInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addDonorInformation: PropTypes.func,
  addDonorInformationFailed: PropTypes.any,
  addDonorError: PropTypes.any,
  donor: PropTypes.any,
  getTerritoriesList:PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => {
  const { donor, addDonorError, loading , territoriesList} = state.DonorInformation;
  return { donor, addDonorError, loading , territoriesList};
};

export default connect(mapStateToProps, {
  getTerritoriesList,
  addDonorInformation,
  addDonorInformationFailed,
})(DonorInformation);