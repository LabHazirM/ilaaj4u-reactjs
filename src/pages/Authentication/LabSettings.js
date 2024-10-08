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
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";
import {
  getBanks,
} from "store/createbank/actions";
// actions
import { updateLabSettings, getLabSettings } from "../../store/actions";

class LabSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      banks: [],
      bank: "",
      is_247_opened: "",
      phone: "",
      opening_time: "",
      closing_time: "",
      opening_day: "",
      closing_day: "",
      is_homesampling_offered: "",
      home_sampling_charges: "",
      state_sampling_charges: "",
      state_sampling_time: "",
      health_dept_certified: "",
      health_dept_certificate: "",
      registration_no: "",
      license_no: "",
      lab_experience: "",
      complaint_handling_email: "",
      complaint_handling_phone: "",
      is_digital_payment_accepted: "",
      is_Receive_Email_On_Booking:"",
      is_active: "",
      account_number: "",
      type: "",
      branch_code: "",
      isSettingsUpdated: false,
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
    // this.props.getLabSettings(this.state.user_id);
    const { banks, getBanks, getLabSettings } = this.props;
    getBanks(this.state.user_id);
    getLabSettings(this.state.user_id)

    console.log("bank list are: ", this.props.banks)
    setTimeout(() => {
      if (
        typeof this.props.success.health_dept_certified === "string" &&
        this.props.success.health_dept_certified !== ""
      ) {
        this.setState({
          health_dept_certificate:
            process.env.REACT_APP_BACKENDURL +
            this.props.success.health_dept_certificate,
        });
      }

      let is247Opened = "No";
    if (this.props.success.is_247_opened === true) {
      is247Opened = "Yes";
    }

      this.setState({
        home_sampling_charges: this.props.success.home_sampling_charges,
        state_sampling_charges: this.props.success.state_sampling_charges,
        state_sampling_time: this.props.success.state_sampling_time,
        is_247_opened: is247Opened,
        opening_time: this.props.success.opening_time,
        closing_time: this.props.success.closing_time,
        opening_day: this.props.success.opening_day,
        closing_day: this.props.success.closing_day,
        phone: this.props.success.phone,
        type: this.props.success.type,
        complaint_handling_email: this.props.success.complaint_handling_email,
        complaint_handling_phone: this.props.success.complaint_handling_phone,
        registration_no: this.props.success.registration_no,
        lab_experience: this.props.success.lab_experience,
        license_no: this.props.success.license_no,
        health_dept_certified: this.props.success.health_dept_certified,
        // is_iso_15189_certified: this.props.success.is_iso_15189_certified,
        // is_iso_9001_certified: this.props.success.is_iso_9001_certified,
        is_digital_payment_accepted:
          this.props.success.is_digital_payment_accepted,
        is_Receive_Email_On_Booking:
          this.props.success.is_Receive_Email_On_Booking,
        is_active: this.props.success.is_active,
        is_homesampling_offered: this.props.success.is_homesampling_offered,
        bank: this.props.success.bank,
        branch_code: this.props.success.branch_code,
        account_number: this.props.success.account_number,
      });
    }, 1500);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.success !== this.props.success || prevProps.banks !== this.props.banks) {
      const { success } = this.props;
  
      if (success) {
        this.setState({
          health_dept_certificate: success.health_dept_certificate
            ? process.env.REACT_APP_BACKENDURL + success.health_dept_certificate
            : "",
          home_sampling_charges: success.home_sampling_charges,
          state_sampling_charges: success.state_sampling_charges,
          state_sampling_time: success.state_sampling_time,
          is_247_opened: success.is_247_opened ? "Yes" : "No",
          opening_time: success.opening_time,
          closing_time: success.closing_time,
          opening_day: success.opening_day,
          closing_day: success.closing_day,
          phone: success.phone,
          type: success.type,
          complaint_handling_email: success.complaint_handling_email,
          complaint_handling_phone: success.complaint_handling_phone,
          registration_no: success.registration_no,
          lab_experience: success.lab_experience,
          license_no: success.license_no,
          health_dept_certified: success.health_dept_certified,
          is_digital_payment_accepted: success.is_digital_payment_accepted,
          is_Receive_Email_On_Booking: success.is_Receive_Email_On_Booking,
          is_active: success.is_active,
          is_homesampling_offered: success.is_homesampling_offered,
          bank: success.bank,
          branch_code: success.branch_code,
          account_number: success.account_number,
        });
      }
  
      const bankList = this.props.banks.map(bank => ({
        label: bank.name,
        value: bank.id
      }));
  
      this.setState({ banks: bankList });
    }
  }
  render() {
    // Generate bank list from props
    const bankList = this.props.banks.map(bank => ({
      label: bank.name,
      value: bank.id
    }));

    // Debugging logs
    console.log("bankList:", bankList);
    console.log("bank value is:", this.state.bank);
    console.log("branch_code is:", this.state.branch_code);
    // Find the selected option
    const selectedOption = bankList.find(option => option.value === Number(this.state.bank)) || null;

    console.log("selectedOption:", selectedOption);

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Lab" breadcrumbItem="Settings" />

            {this.state.isSettingsUpdated && this.state.isSettingsUpdated ? (
              <Alert color="success">Your settings are updated.</Alert>
            ) : null}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    is_247_opened:
                      (this.state && this.state.is_247_opened) || "Yes",
                    opening_time: (this.state && this.state.opening_time) || "",
                    closing_time: (this.state && this.state.closing_time) || "",
                    opening_day: (this.state && this.state.opening_day) || "",
                    closing_day: (this.state && this.state.closing_day) || "",
                    health_dept_certified:
                      (this.state && this.state.health_dept_certified) || "",
                    home_sampling_charges:
                      (this.state && this.state.home_sampling_charges) || "",
                    state_sampling_charges:
                      (this.state && this.state.state_sampling_charges) || "",
                    state_sampling_time:
                      (this.state && this.state.state_sampling_time) || "",
                    registration_no:
                      (this.state && this.state.registration_no) || "",
                    lab_experience:
                      (this.state && this.state.lab_experience) || "",
                    license_no: (this.state && this.state.license_no) || "",
                    phone: (this.state && this.state.phone) || "",
                    type: (this.state && this.state.type) || "",
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
                    is_homesampling_offered: (this.state && this.state.is_homesampling_offered) || "",
                    bank: (this.state && this.state.bank) || "",
                    branch_code: (this.state && this.state.branch_code) || "",
                    account_number:
                      (this.state && this.state.account_number) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    state_sampling_charges: Yup.number(
                      "Please enter number only"
                    )
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      ),
                    state_sampling_time: Yup.number(
                      "Please enter number only"
                    )
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      ),
                    home_sampling_charges: Yup.number(
                      "Please enter number only"
                    )
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      )
                      .max(
                        5000,
                        "Please enter a number less than or equal to 150"
                      ),
                    complaint_handling_email: Yup.string()
                      // .required("Please enter your complaint handling email")
                      .email("Please enter valid email")
                      .max(255, "Please enter maximum 255 characters"),
                    complaint_handling_phone: Yup.string(),
                    lab_experience: Yup.number("Please enter number only")
                      .required("Please enter your lab experience")
                      .positive()
                      .integer()
                      .min(
                        0,
                        "Please enter a number greater than or equal to 0"
                      )
                    // .required(
                    //   "Please enter your complaint handling phone no."
                    // )
                    // .max(255, "Please enter maximum 255 characters")
                    // .matches(
                    //   /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                    //   "Please enter a valid Pakistani landline number e.g. 0512345678"
                    // ),
                  })}
                  onSubmit={values => {
                    values.health_dept_certificate =
                      this.state.health_dept_certificate;

                    // If health dept certified is selected and certificate is uploaded
                    if (
                      (this.state.health_dept_certified.length > 0 &&
                        this.state.health_dept_certificate) ||
                      this.state.health_dept_certified.length == 0
                    ) {
                      if (typeof values.health_dept_certificate == "string") {
                        // if no file was selected for logo then get current image from url and convert to file
                        this.toDataURL(this.state.health_dept_certificate).then(
                          dataUrl => {
                            values.health_dept_certificate = this.dataURLtoFile(
                              dataUrl,
                              this.state.health_dept_certificate
                                .split("/")
                                .at(-1)
                            );
                          }
                        );

                        values.health_dept_certificate = "";
                      }

                      // Check if the lab is open for 24/7 then set opening and closing time to 00:00:00
                      if (values.is_247_opened == "Yes") {
                        values.opening_time = "00:00:00";
                        values.closing_time = "00:00:00";
                        values.opening_day = "Monday";
                        values.closing_day = "Monday";
                      }

                      // To show success message of update
                      this.setState({ isSettingsUpdated: true });
                      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

                      setTimeout(() => {
                        this.props.updateLabSettings(
                          values,
                          this.state.user_id
                        );

                        // To get updated settings again
                        setTimeout(() => {
                          this.props.getLabSettings(this.state.user_id);
                        }, 1000);

                        // To make success message disappear after sometime
                        setTimeout(() => {
                          this.setState({
                            isSettingsUpdated: false,
                          });
                        }, 5000);
                      }, 2000);
                    }
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      <p>{errors.health_dept_certificate}</p>
                      {/* Operational Hours Fields */}
                      {/* Health Dept Certified */}
                      <div className="mb-3">
                        <Label for="is_247_opened" className="form-label">
                          Are you open for 24 hours?
                        </Label>
                        <Field
                          name="is_247_opened"
                          component="select"
                          onChange={e =>
                            this.setState({
                              is_247_opened: e.target.value,
                            })
                          }
                          value={this.state.is_247_opened}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>

                      {this.state.is_247_opened == "No" && (
                        <Row>
                          <Col md={6} lg={6}>
                            <div className="mb-3 row">
                              <label
                                htmlFor="opening_time"
                                className="col-md-3 col-form-label"
                              >
                                Opening Time
                              </label>
                              <div className="col-md-9">
                                <input
                                  className="form-control"
                                  type="time"
                                  id="opening_time"
                                  name="opening_time"
                                  onChange={e => {
                                    this.setState({
                                      opening_time: e.target.value, // Concatenating seconds for handling on Django side
                                    });
                                  }}
                                  defaultValue={this.state.opening_time}
                                />
                              </div>
                            </div>
                          </Col>

                          <Col md={6} lg={6}>
                            <div className="mb-4 row">
                              <label
                                htmlFor="closing_time"
                                className="col-md-3 col-form-label"
                              >
                                Closing Time
                              </label>
                              <div className="col-md-9">
                                <input
                                  className="form-control"
                                  type="time"
                                  id="closing_time"
                                  name="closing_time"
                                  onChange={e => {
                                    this.setState({
                                      closing_time: e.target.value, // Concatenating seconds for handling on Django side
                                    });
                                  }}
                                  defaultValue={this.state.closing_time}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                      {this.state.is_247_opened == "No" && (
                        <Row>
                          <Col md={6} lg={6}>
                            <div className="mb-3 row">
                              <label
                                htmlFor="opening_day"
                                className="col-md-3 col-form-label"
                              >
                                From
                              </label>
                              <div className="col-md-9">

                                <Field
                                  name="opening_day"
                                  component="select"
                                  defaultValue={this.state.opening_day} // Set the default value
                                  onChange={(e) => {
                                    this.setState({
                                      opening_day: e.target.value, // Update the state when the value changes
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.opening_day && touched.opening_day ? " is-invalid" : "")
                                  }
                                >
                                  <option value="">**Select Day**</option>
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                  <option value="Saturday">Saturday</option>
                                  <option value="Sunday">Sunday</option>
                                </Field>

                              </div>
                            </div>
                          </Col>

                          <Col md={6} lg={6}>
                            <div className="mb-4 row">
                              <label
                                htmlFor="closing_day"
                                className="col-md-3 col-form-label"
                              >
                                To
                              </label>
                              <div className="col-md-9">
                                <Field
                                  name="closing_day"
                                  component="select"
                                  defaultValue={this.state.closing_day} // Set the default value
                                  onChange={(e) => {
                                    this.setState({
                                      closing_day: e.target.value, // Update the state when the value changes
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.closing_day && touched.closing_day ? " is-invalid" : "")
                                  }
                                >
                                  <option value="">**Select Day**</option>
                                  <option value="Monday">Monday</option>
                                  <option value="Tuesday">Tuesday</option>
                                  <option value="Wednesday">Wednesday</option>
                                  <option value="Thursday">Thursday</option>
                                  <option value="Friday">Friday</option>
                                  <option value="Saturday">Saturday</option>
                                  <option value="Sunday">Sunday</option>
                                </Field>

                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                <div className="mb-3">
        <div>
          <Label for="bank" className="form-label">Bank</Label>
          <Select
            name="bank"
            value={selectedOption || null} // Ensure `value` is correctly set
            onChange={selectedGroup => 
              this.setState({ bank: selectedGroup ? selectedGroup.value : "" })
            }
            className={
              "defautSelectParent" +
              (errors.bank && touched.bank
                ? " is-invalid"
                : "")
            }
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor:
                  errors.bank && touched.bank
                    ? "#f46a6a"
                    : "#ced4da",
              }),
            }}
            options={bankList}
          />
          <ErrorMessage
            name="bank"
            component="div"
            className="invalid-feedback"
          />
        </div>
                        {/* <Label for="bank" className="form-label">
                          Bank
                        </Label>
                        <Field
                          name="bank"
                          component="select"
                          onChange={e =>
                            this.setState({
                              bank: e.target.value,
                            })
                          }
                          value={this.state.bank}
                          className="form-select"
                        >
                          <option
                            value=""
                            selected={this.props.success.bank === ""}
                          >
                            --- Select Bank ---
                          </option>

                          <option value="Askari Bank">Askari Bank</option>
                          <option value="Allied Bank">Allied Bank</option>
                          <option value="Bank Al Habib Limited">
                            Bank Al Habib Limited
                          </option>
                          <option value="Bank Alfalah">Bank Alfalah</option>
                          <option value="MCB Bank Limited">
                            MCB Bank Limited
                          </option>
                          <option value="Faysal Bank">
                            Faysal Bank
                          </option>
                          <option value="HBL / Konnect">HBL / Konnect</option>
                          <option value="MCB Islamic">MCB Islamic</option>
                          <option value="Meezan Bank">Meezan Bank</option>
                          <option value="National Bank of Pakistan(NBP)">
                            National Bank of Pakistan(NBP)
                          </option>
                          <option value="Soneri Bank">Soneri Bank</option>
                          <option value="United Bank Limited">
                            United Bank Limited
                          </option>
                  </Field>*/}
                   </div>
                      {this.state.bank && (
                        <div className="mb-3">
                          <Label for="branch_code" className="form-label">
                            Branch Code
                          </Label>
                          <Field
                            id="branch_code"
                            name="branch_code"
                            type="text"
                            onChange={e =>
                              this.setState({
                                branch_code: e.target.value,
                              })
                            }
                            value={this.state.branch_code}
                            className={
                              "form-control" +
                              (errors.branch_code && touched.branch_code
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="branch_code"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      )}
                      {this.state.bank && (
                        <div className="mb-3">
                          <Label for="account_number" className="form-label">
                            Account No.
                          </Label>
                          <Field
                            id="account_number"
                            name="account_number"
                            type="text"
                            onChange={e =>
                              this.setState({
                                account_number: e.target.value,
                              })
                            }
                            value={this.state.account_number}
                            className={
                              "form-control" +
                              (errors.account_number && touched.account_number
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="account_number"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                      )}
                      {/* Health Dept Certified */}
                      <div className="mb-3">
                        <Label
                          for="health_dept_certified"
                          className="form-label"
                        >
                          Certified Health Department
                        </Label>
                        <Field
                          name="health_dept_certified"
                          component="select"
                          onChange={e =>
                            this.setState({
                              health_dept_certified: e.target.value,
                            })
                          }
                          value={this.state.health_dept_certified}
                          className="form-select"
                        >
                          <option
                            value=""
                            selected={
                              this.props.success.health_dept_certified === ""
                            }
                          >
                            --- Please select the certified health department
                            ---
                          </option>
                          <option value="Islamabad Health Regulatory Authority">
                            Islamabad Health Regulatory Authority
                          </option>
                          <option value="Punjab Healthcare Comission">
                            Punjab Healthcare Comission
                          </option>
                          <option value="Sindh Healthcare Comission">
                            Sindh Healthcare Comission
                          </option>
                          <option value="Balochistan Healthcare Comission">
                            Balochistan Healthcare Comission
                          </option>
                          <option value="KPK Healthcare Comission">
                            KPK Healthcare Comission
                          </option>
                          <option value="AJ&K Healthcare Comission">
                            AJ&K Healthcare Comission
                          </option>
                          <option value="Gilgit Baltistan Health Department">
                            Gilgit Baltistan Health Department
                          </option>
                        </Field>
                      </div>

                      {this.state.health_dept_certified && (
                        <div>
                          {/* Health Dept Certificate field */}
                          <div className="mb-3">
                            <Label for="name" className="form-label">
                              Health Dept Certificate (Choose file only if you
                              want to change health dept certificate)
                            </Label>
                            <Row>
                              <Col md={8} lg={8}>
                                <Input
                                  id="formFile"
                                  name="health_dept_certificate"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  onChange={e => {
                                    this.setState({
                                      health_dept_certificate:
                                        e.target.files[0],
                                    });
                                  }}
                                  // className="form-control is-invalid"
                                  className={
                                    "form-control" +
                                    (this.state.health_dept_certified.length >
                                      0 && !this.state.health_dept_certificate
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <div className="invalid-feedback">
                                  Please upload health dept certificate
                                </div>
                              </Col>

                              <Col md={4} lg={4}>
                                {typeof this.props.success
                                  .health_dept_certified === "string" &&
                                  this.props.success.health_dept_certified !==
                                  "" && (
                                    <div className="mt-2">
                                      <strong>Currently: </strong>{" "}
                                      <Link
                                        to={{
                                          pathname:
                                            process.env.REACT_APP_BACKENDURL +
                                            this.props.success
                                              .health_dept_certificate,
                                        }}
                                        target="_blank"
                                      >
                                        Health Dept Certificate
                                      </Link>
                                    </div>
                                  )}
                              </Col>
                            </Row>
                          </div>
                          {/* Registration No. field */}
                          <div className="mb-3">
                            <Label for="registration_no" className="form-label">
                              Registration No. (optional)
                            </Label>
                            <Field
                              id="registration_no"
                              name="registration_no"
                              type="text"
                              onChange={e =>
                                this.setState({
                                  registration_no: e.target.value,
                                })
                              }
                              value={this.state.registration_no}
                              className={
                                "form-control" +
                                (errors.registration_no &&
                                  touched.registration_no
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="registration_no"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>

                          {/* License No. field */}
                          <div className="mb-3">
                            <Label for="license_no" className="form-label">
                              License No. (optional)
                            </Label>
                            <Field
                              id="license_no"
                              name="license_no"
                              type="text"
                              onChange={e =>
                                this.setState({
                                  license_no: e.target.value,
                                })
                              }
                              value={this.state.license_no}
                              className={
                                "form-control" +
                                (errors.license_no && touched.license_no
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="license_no"
                              component="div"
                              className="invalid-feedback"
                            />
                          </div>
                        </div>
                      )}
                      <div className="mb-3">
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
                      </div>

                      {/* Phone field */}
                      <div className="mb-3">
                        <Label for="phone" className="form-label">
                          Lab Mobile No. (if any)
                        </Label>
                        <Field
                          id="phone"
                          name="phone"
                          type="text"
                          onChange={e =>
                            this.setState({ phone: e.target.value })
                          }
                          value={this.state.phone}
                          className="form-control"
                        />
                      </div>

                      {/* Complaint Handling Email field */}
                      <div className="mb-3">
                        <Label
                          for="complaint_handling_email"
                          className="form-label"
                        >
                          Help & Support Email
                        </Label>
                        <Field
                          name="complaint_handling_email"
                          type="text"
                          onChange={e =>
                            this.setState({
                              complaint_handling_email: e.target.value,
                            })
                          }
                          value={this.state.complaint_handling_email}
                          className={
                            "form-control" +
                            (errors.complaint_handling_email &&
                              touched.complaint_handling_email
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="complaint_handling_email"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                      {/* Complaint Handling Phone field */}
                      <div className="mb-3">
                        <Label
                          for="complaint_handling_phone"
                          className="form-label"
                        >
                          Help & Support Phone No.
                        </Label>
                        <Field
                          id="complaint_handling_phone"
                          name="complaint_handling_phone"
                          type="text"
                          onChange={e =>
                            this.setState({
                              complaint_handling_phone: e.target.value,
                            })
                          }
                          value={this.state.complaint_handling_phone}
                          className={
                            "form-control" +
                            (errors.complaint_handling_phone &&
                              touched.complaint_handling_phone
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="complaint_handling_phone"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div><div className="mb-3">
                        <Label for="is_homesampling_offered" className="form-label">
                          Are you Offering Home Sampling?
                        </Label>
                        <Field
                          name="is_homesampling_offered"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_homesampling_offered: e.target.value,
                            })
                          }
                          value={this.state.is_homesampling_offered}
                          className="form-select"
                        >
                          <option value="">--</option>
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


                      {/* Accept Credit Card for Payment field */}
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
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_digital_payment_accepted: e.target.value,
                            })
                          }
                          value={this.state.is_digital_payment_accepted}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>
                      


                      {/* //EMAIL  */}
                      <div className="mb-3">
                        <Label
                          for="is_Receive_Email_On_Booking"
                          className="form-label"
                        >
                          Do you want to receive an email when a patient books an appointment?
                        </Label>
                        <Field
                          name="is_Receive_Email_On_Booking"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_Receive_Email_On_Booking: e.target.value,
                            })
                          }
                          value={this.state.is_Receive_Email_On_Booking}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>

                      <div className="mb-3">
                        <Label for="type" className="form-label">
                          Main Lab / Collection Point
                        </Label>
                        <Field
                          name="type"
                          // component="select"
                          disabled // Set the disabled attribute to make it read-only
                          onChange={e =>
                            this.setState({
                              type: e.target.value,
                            })
                          }
                          value={this.state.type}
                          className="form-select"
                        >
                          {/* <option value="Main Lab">Main Lab</option>
    <option value="Collection Point">Collection Point</option> */}
                        </Field>
                      </div>

                      {/* Is Active */}
                      <div className="mb-3">
                        <Label for="is_active" className="form-label">
                          Are you active for providing services?
                        </Label>
                        <Field
                          name="is_active"
                          component="select"
                          defaultValue="No"
                          onChange={e =>
                            this.setState({
                              is_active: e.target.value,
                            })
                          }
                          value={this.state.is_active}
                          className="form-select"
                        >
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </Field>
                      </div>
                      <div className="text-center mt-4">
                        <Button
                          type="submit"
                          color="danger"
                          disabled={this.state.isSettingsUpdated}
                        >
                          Update Settings
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

LabSettings.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateLabSettings: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  banks: PropTypes.any,
  getLabSettings: PropTypes.func,
  getBanks: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.LabSettings;
  const {banks} = state.createBank
  return { error, success, banks };
};

export default withRouter(
  connect(mapStateToProps, {
    updateLabSettings,
    getLabSettings,
    getBanks,
  })(LabSettings)
);
