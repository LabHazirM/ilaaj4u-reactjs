import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, Col, Container, Row, Label } from "reactstrap";
import MetaTags from "react-meta-tags";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import CarouselPage from "../AuthenticationInner/CarouselPage";
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
// action
import {
  getTerritoriesList,
  getCorporatesList,
  addPatientInformation,
  addPatientInformationFailed,
} from "../../store/actions";
// Redux
import { connect } from "react-redux";
class PatientInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      is_assosiatewith_anycorporate: "No",
      corporate_id: null, // Updated to initialize as null
      employee_id_card: "",
      employee_code: [], // Add this line
      employee_id_cardError: "",
      email: "",
      city_id: "",
      address: "",
      guest_id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      user_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      employeeData: [], // New state property for employee data
    };
    console.log("empluyee data in state", this.state.employee_code)
  }

  componentDidMount() {
    console.log("uuid", this.props.match.params.uuid)
    console.log("guest_id", this.props.match.params.guest_id)
    console.log("id", this.props.match.params.id)
    console.log("user type", this.state.user_type)
    this.props.addPatientInformationFailed("");
    this.props.getTerritoriesList();
    this.props.getCorporatesList();
    console.log("user id", this.state.user_id)
    // Fetch and set employee codes here
    this.fetchEmployeeCodes();
  }
  // fetchEmployeeCodes = async () => {
  //   try {
  //     const response = await axios.get(`https://labhazirapi.com/api/corporate/employees-list`);
  //     const employeeData = response.data.data;
  
  //     if (employeeData && employeeData.length > 0) {
  //       const employeeCodes = employeeData.map((item) => item.employee_code);
  //       console.log("Employee Code Match:", employeeCodes, employeeData);
  
  //       // Update the state with the fetched employee_codes and employeeData
  //       this.setState({
  //         employee_id_card: "", // Reset employee_id_card when corporate changes
  //         employee_code: employeeCodes,
  //         employeeData: employeeData, // Add this line to set employeeData
  //         corporate_id: employeeData.corporate_id,
  //       });
  //     } else {
  //       console.error("No employee data found for the given corporate ID");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching employee_code:", error);
  //   }
  // };  
  fetchEmployeeCodes = async () => {
    try {
      const response = await axios.get(
        `https://labhazirapi.com/api/corporate/employees-list`
      );
      const employeeData = response.data.data;

      if (employeeData && employeeData.length > 0) {
        const employeeCodes = employeeData.map((item) => item.employee_code);
        console.log("Employee Code Match:", employeeCodes, employeeData);

        // Update the state with the fetched employee_codes and employeeData
        this.setState({
          employee_id_card: "",
          employee_code: employeeCodes,
          employeeData: employeeData,
        });
      } else {
        console.error("No employee data found for the given corporate ID");
      }
    } catch (error) {
      console.error("Error fetching employee_code:", error);
    }
  };
  validateEmployeeCode = enteredEmployeeIdCard => {
    const { employeeData } = this.state;

    const matchedEmployee = employeeData.find(
      item => item.employee_code === enteredEmployeeIdCard
    );

    if (!matchedEmployee) {
      this.setState({
        employee_id_cardError:
          "This ID Card Number does not exist with any Corporation. Please enter your correct ID Card Number.",
        corporate_id: null,
      });
    } else {
      this.setState({
        employee_id_cardError: "",
        corporate_id: matchedEmployee.corporate_id,
      });
    }
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
    const corporatesList = [];
    for (let i = 0; i < this.props.corporatesList.length; i++) {
      corporatesList.push({
        label: this.props.corporatesList[i].name,
        value: this.props.corporatesList[i].id,
      });
    }
    // Redirect to register page if getting access directly from url
    if (typeof this.props.location.state == "undefined") {
      return <Redirect to={"/register"} />;
    }

    return (
      <React.Fragment>
        <div>
          <MetaTags>
            <title>Patient Information | Lab Hazir</title>k{" "}
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
                            Patient account information - Step 2 of 2
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.patient || this.state.user_id ? (
                            this.state.user_type === "b2bclient" || this.state.user_type === "CSR" ? (
                              <Alert color="success" style={{ marginTop: "13px" }}>
                                Account Registered Successfully.
                              </Alert>
                            ) : (
                              <Alert color="success" style={{ marginTop: "13px" }}>
                                Your Account Registered Successfully. Please log in to your account.
                              </Alert>
                            )
                          ) : null}

                          {this.props.addPatientError &&
                            this.props.addPatientError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addPatientError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              phone: (this.state && this.state.phone) || "",
                              is_assosiatewith_anycorporate: (this.state && this.state.is_assosiatewith_anycorporate) || "No",
                              corporate_id: (this.state && this.state.corporate_id) || "",
                              employee_id_card: (this.state && this.state.employee_id_card) || "",
                              email: (this.state && this.state.email) || "",
                              city_id: (this.state && this.state.city_id) || "",
                              address: (this.state && this.state.address) || "",
                            }}
                            validationSchema={Yup.object().shape({
                              employee_id_card: Yup.string().when("is_assosiatewith_anycorporate", {
                                is: "Yes",
                                then: Yup.string()
                                  .trim()
                                  .required("Please enter your ID Card Number")
                                  .test(
                                    "is-valid-employee-id",
                                    "This ID Card Number does not exist in the selected Corporation. Please enter your correct ID Card Number.",
                                    (value) => this.state.employee_code.includes(value)
                                  ),
                              }),
                              name: Yup.string()
                                .trim()
                                .required("Please enter your name")
                                .min(3, "Please enter at least 3 characters")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^[a-zA-Z][a-zA-Z ]+$/,
                                  "Please enter only alphabets and spaces"
                                ),
                              phone: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                              email: Yup.string()
                                .required("Please enter your Email.")
                                .email("Please enter valid Email")
                            })}
                            onSubmit={values => {
                              this.props.addPatientInformation(
                                values,
                                this.props.match.params.id
                              );
                              window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

                              // Redirecting back to the login page
                              setTimeout(() => {
                                if (this.props.patient && !this.state.user_id) {
                                  console.log(this.props.match.params.uuid);
                                  // Add a 4-second delay using setTimeout
                                  setTimeout(() => {
                                    this.props.history.push(
                                      this.props.match.params.uuid
                                        ? `/login/${this.props.match.params.guest_id}/${this.props.match.params.uuid}`
                                        : `/login/${this.props.match.params.guest_id}`
                                    );
                                  }, 2000); // 4000 milliseconds = 4 seconds
                                } else if (
                                  this.props.patient &&
                                  this.state.user_id &&
                                  this.state.user_type === "b2bclient"
                                ) {
                                  console.log(this.props.match.params.guest_id);
                                  this.props.history.push(
                                    this.props.match.params.guest_id
                                      ? `/labs/${this.props.match.params.guest_id}/${this.props.match.params.id}`
                                      : `/labs`
                                  );
                                }
                                else if (
                                  this.props.patient &&
                                  this.state.user_id &&
                                  this.state.is_assosiatewith_anycorporate === "No" && 
                                  !this.state.employee_id_card &&
                                  this.state.user_type === "CSR"
                                ) {
                                  console.log(this.props.match.params.uuid);
                                  this.props.history.push(
                                    this.props.match.params.uuid
                                      ? `/corporate-csr/${this.props.match.params.uuid}/${this.props.match.params.id}`
                                      : `/corporate-csr/${this.props.match.params.id}`
                                  );
                                }
                                else if (
                                  this.props.patient &&
                                  this.state.user_id &&
                                  this.state.is_assosiatewith_anycorporate === "Yes" && 
                                  this.state.employee_id_card &&
                                  this.state.user_type === "CSR"
                                ){
                                  console.log(
                                    "Patient Profile:",
                                    this.state.is_assosiatewith_anycorporate,
                                    this.props.patient,
                                    this.state.employee_id_card,
                                    this.state.user_type
                                  );
                                  const uuid = this.props.match.params.id;
                                  const accountId = this.state.corporate_id;
                                  const url = uuid
                                    ? `/corporate-patients-book-appointments/${uuid}/${accountId}`
                                    : `/corporate-patients-book-appointments/${accountId}`;
                                  this.props.history.push(url);
                                }
                                
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
                                    placeholder="Please enter your name"
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

                                {/* Phone field */}
                                <div className="mb-3">
                                  <Label for="phone" className="form-label">
                                    Mobile No.
                                  </Label>
                                  <Field
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Please enter your mobile number"
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

                                <div className="mb-3">
                                  <Label for="email" className="form-label">
                                    Email
                                  </Label>
                                  <Field
                                    id="email"
                                    name="email"
                                    type="text"
                                    placeholder="Please enter your Email"
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
                                {/* city field */}
                                <div className="mb-3">
                                  <Label for="name" className="form-label">
                                    Address
                                  </Label>
                                  <Field
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Please enter your address"
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
                                <div className="mb-3">


                                  <Label for="city_id" className="form-label">
                                    City
                                  </Label>
                                  <Select
                                    name="city_id"
                                    component="Select"
                                    placeholder="Please Select your City...."
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

                                 {/* corporates field */}
                                <div className="mb-3">
                                  <Label
                                    for="is_assosiatewith_anycorporate"
                                    className="form-label"
                                  >
                                    Are you associated with any corporation?
                                  </Label>
                                  <Field
                                    name="is_assosiatewith_anycorporate"
                                    component="select"
                                    onChange={e =>
                                      this.setState({
                                        is_assosiatewith_anycorporate:
                                          e.target.value,
                                      })
                                    }
                                    value={
                                      this.state.is_assosiatewith_anycorporate
                                    }

                                    className="form-select"
                                  >
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                  </Field>
                                </div>
                                {this.state.is_assosiatewith_anycorporate == "Yes" ? (
                                   <div>   
                                                            
<div className="mb-3">
  <Label for="employee_id_card" className="form-label">
    ID Card.
  </Label>
  <Field
    id="employee_id_card"
    name="employee_id_card"
    type="text"
    placeholder="Please enter your ID Card Number..."
    onChange={e => {
      this.setState({ employee_id_card: e.target.value });
      this.validateEmployeeCode(e.target.value);
    }}
    value={this.state.employee_id_card}
    className={
      "form-control" +
      (this.state.employee_id_cardError ? " is-invalid" : "")
    }
  />
  <ErrorMessage
    name="employee_id_card"
    component="div"
    className="invalid-feedback"
  />
  {this.state.employee_id_cardError && (
    <div className="text-danger">{this.state.employee_id_cardError}</div>
  )}
</div>
<div className="mb-3">
          <Label for="corporate_id" className="form-label" hidden={true}>
            Corporate ID
          </Label>
          <Field
            id="corporate_id"
            name="corporate_id"
            hidden={true}
            type="text"
            onChange={e => this.setState({ corporate_id: e.target.value })}
            value={this.state.corporate_id || ""}
            className={
              "form-control" +
              (errors.corporate_id && touched.corporate_id ? " is-invalid" : "")
            }
          />
          <ErrorMessage
            name="corporate_id"
            component="div"
            className="invalid-feedback"
          />
        </div>
                                   </div>
                                ) : null}                                

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
PatientInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addPatientInformation: PropTypes.func,
  addPatientInformationFailed: PropTypes.any,
  addPatientError: PropTypes.any,
  patient: PropTypes.any,
  getTerritoriesList: PropTypes.func,
  getCorporatesList: PropTypes.func,
  territoriesList: PropTypes.array,
  corporatesList: PropTypes.array,
  employeeData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      employee_code: PropTypes.string,
      corporate_id: PropTypes.number,
    })
  ),
};
const mapStateToProps = state => {
  const { territoriesList } = state.PatientInformation;
  const { corporatesList } = state.PatientInformation;
  const { patient, addPatientError, loading } = state.PatientInformation;
  return { patient, addPatientError, loading, territoriesList, corporatesList };
};
export default connect(mapStateToProps, {
  getTerritoriesList,
  getCorporatesList,
  addPatientInformation,
  addPatientInformationFailed,
})(PatientInformation);