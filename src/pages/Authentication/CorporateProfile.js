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
  FormGroup
} from "reactstrap";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux  
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import {
  getTerritoriesList,
  updateCorporateProfile,
  getCorporateProfile,
  getCorporateProfileSuccess,
} from "../../store/actions";

class CorporateProfile extends Component {
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
      city: "",
      payment_terms: "",
      payment_request: "",
      limit: "",
      end_date: "",
      reason: "",
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
  // Converts a date string to the required format
  formatDateForInput(dateStr) {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16); // Converts to YYYY-MM-DDTHH:MM
  }

  componentDidMount() {
    this.props.getCorporateProfile(this.state.user_id);
    this.props.getTerritoriesList();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.success !== this.props.success) {
      const { success } = this.props;
      console.log("payment request  is ", success.payment_request)
      if (success) {
        this.setState({
          name: success.name || "",
          logo: success.logo ? process.env.REACT_APP_BACKENDURL + success.logo : "",
          national_taxation_no: success.national_taxation_no || "",
          email: success.email || "",
          phone: success.phone || "",
          landline: success.landline || "",
          address: success.address || "",
          city: success.city || "",
          payment_terms: success.payment_terms || "",
          limit:  success.limit || "",
          end_date: success.end_date ? this.formatDateForInput(success.end_date) : "",
          reason: success.reason || "",
          payment_request: success.payment_request || "",
        });
  
        // Check if city and city_id are present and not empty
        if (success.city && success.city_id) {
          // Parse the cities and city_ids
          const cities = success.city.split(", ");
          const cityIds = success.city_id.split(",").map(id => parseInt(id));
  
          // Combine cities and cityIds into an array of objects compatible with react-select
          const selectedCities = cityIds.map((id, index) => ({
            label: cities[index],
            value: id,
          }));
  
          // Set the selected cities in the state
          this.setState({ selectedCities });
        } else {
          console.error("Missing city or city_id in success object:", success);
        }
      }
    }
  }
  

  render() {
   
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Corporate" breadcrumbItem="Profile" />

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

            <h4 className="card-title mb-4">Update Corporate Profile</h4>

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    name: (this.state && this.state.name) || "",
                    logo: (this.state && this.state.logo) || "",
                    national_taxation_no: (this.state && this.state.national_taxation_no) || "",
                    email: (this.state && this.state.email) || "",
                    phone: (this.state && this.state.phone) || "",
                    landline: (this.state && this.state.landline) || "",
                    address: (this.state && this.state.address) || "",
                    city: (this.state && this.state.city) || "",
                    payment_terms:  this.state.payment_terms || "",
                    limit: this.state.limit || "",
                    end_date:  this.state.end_date ||"",
                    reason: this.state.reason ||"",
                    payment_request: (this.state && this.state.payment_request) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    name: Yup.string()
                      .trim()
                      .required("Please enter your name")
                      .min(3, "Please enter at least 3 characters")
                      .max(255, "Please enter maximum 255 characters"),
                      
                    logo: Yup.mixed().required("Please upload your lab logo"),
                     
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
                      .max(255, "Please enter maximum 255 characters"),
                    limit: Yup.string().when('payment_terms', {
                      is: 'Payment by Coorporate to LH',
                      then: Yup.string().required("Please enter quota amount")
                    }),
                    end_date: Yup.string().when('payment_terms', {
                      is: 'Payment by Coorporate to LH',
                      then: Yup.string().required("Please enter limit expiry end_date")
                    }),
                    reason: Yup.string().when('payment_terms', {
                      is: 'Request for Change Payment',
                      then: Yup.string().required("Please enter reason for change payment method")
                      }),
                  })}
                  onSubmit={values => {
                    // if no file was selected for logo then get current image from url and convert to file
                    if (typeof values.logo == "string") {
                      this.toDataURL(values.logo).then(dataUrl => {
                        var fileData = this.dataURLtoFile(
                          dataUrl,
                          values.logo.split("/").at(-1)
                        );
                        values.city_id = this.state.selectedCities.map(city => city.value).join(", ");
                        values.logo = fileData;

                        this.props.updateCorporateProfile(values, this.state.user_id);
                        // console.log("update howa yah nahi 11 if", this.props.updateCorporateProfile(values, this.state.user_id))
                      });
                    }

                    // Otherwise just call update method
                    else {
                      values.city_id = this.state.selectedCities.map(city => city.value).join(", ");
                      this.props.updateCorporateProfile(values, this.state.user_id);
                      // console.log("update howa yah nahi  else", this.props.updateCorporateProfile(values, this.state.user_id))
                    }

                    // To show success message of update
                    this.setState({ isProfileUpdated: true });
                    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});


                    // To get updated profile again
                    setTimeout(() => {
                      this.props.getCorporateProfile(this.state.user_id);
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
                  {({ errors, status, touched, values, setFieldValue }) => (
                    <Form className="form-horizontal">

                      {/* Name field */}
                      <div className="mb-3">
                        <Label for="name" className="form-label">
                          Corporate Name
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

                      {/* Owner name field */}
                      <div className="mb-3">
                        <Label
                          for="national_taxation_no"
                          className="form-label"
                        >
                          Corporate NTN #
                        </Label>
                        <Field
                          id="national_taxation_no"
                          name="national_taxation_no"
                          className="form-control"
                          type="text"
                          readOnly={true}
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
                            (errors.phone && touched.phone ? " is-invalid" : "")
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
                       {/*City*/}
                    
                      <div className="mb-3">

<Label for="city_id" className="form-label">
  City
</Label>
<Select
  name="city_id"
  isMulti={true}
  onChange={selectedGroups => {
    // Update selectedCities state with the new selection
    this.setState({
      selectedCities: selectedGroups,
      // Update city state with the names of the selected cities for display purposes if needed
      city: selectedGroups ? selectedGroups.map(group => group.value).join(", ") : ""
    });
  }}
  className={
    "defautSelectParent" +
    (errors.city_id && touched.city_id ? " is-invalid" : "")
  }
  styles={{
    control: (base, state) => ({
      ...base,
      borderColor:
        errors.city_id && touched.city_id ? "#f46a6a" : "#ced4da",
    }),
  }}
  options={cityList} // Pass the cityList array as options
  value={this.state.selectedCities} // Set the selected cities here
  placeholder="Select City..."
/>

<ErrorMessage
  name="city_id"
  component="div"
  className="invalid-feedback"
/>


<ErrorMessage
  name="city_id"
  component="div"
  className="invalid-feedback"
/>
</div>
                      {/* Address field */}
                      <div className="mb-3">
                        <Label for="address" className="form-label">
                          Complete Address
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

{values.payment_terms === "Payment by Coorporate to LH" && (
                      <div>
                      <Label for="payment_terms" className="form-label">
                        What are your Payment Terms?
                      </Label>
                      <Field
                        name="payment_terms"
                        as="select"
                        onChange={e => {
                          const value = e.target.value;
                          setFieldValue('payment_terms', value);

                          // Reset fields when changing payment terms
                          if (value !== "Payment by Coorporate to LH") {
                            setFieldValue('limit', '');
                            setFieldValue('end_date', '');
                          }
                          if (value !== "Request for Change Payment") {
                            setFieldValue('reason', '');
                          }
                        }}
                        value={values.payment_terms}
                        className="form-select"
                      >
                        <>
                            <option value="Payment by Coorporate to LH">
                              Payment by Corporate to LH
                            </option>
                            <option value="Request for Change Payment">
                              Request for Change Payment
                            </option>
                          </>
                     
                      </Field>
                      <ErrorMessage name="payment_terms" component="div" className="invalid-feedback" />
                    </div>
)}

{values.payment_request == "Request for Change Payment" && (
      <div >
            <span className="text-danger font-size-12">
                <strong>
                You have requested for payment change, wait until labhazir team approves it.
                </strong>
          </span>
      </div>
)}

{values.payment_terms === "Payment by Patient to Lab" && (
                      <div className="mb-3">
                      <Label for="payment_terms" className="form-label">
                        What are your Payment Terms?
                      </Label>
                      <Field
                        name="payment_terms"
                        as="select"
                        onChange={e => {
                          const value = e.target.value;
                          setFieldValue('payment_terms', value);

                          // Reset fields when changing payment terms
                          if (value !== "Payment by Coorporate to LH") {
                            setFieldValue('limit', '');
                            setFieldValue('end_date', '');
                          }
                          if (value !== "Request for Change Payment") {
                            setFieldValue('reason', '');
                          }
                          // Adjust payment_terms if payment_request is "Request for Change Payment"
                          // if (values.payment_request === "Request for Change Payment" && value === "Payment by Coorporate to LH") {
                          //   setFieldValue('payment_terms', "Request for Change Payment");
                          // }
                        }}
                        value={values.payment_terms}
                        className="form-select"
                      >
                        <>
                            <option value="Payment by Patient to Lab">
                              Payment by Patient to Lab
                            </option>
                            <option value="Payment by Coorporate to LH">
                              Payment by Corporate to Lab
                            </option>                            
                          </>
                      </Field>
                      <ErrorMessage name="payment_terms" component="div" className="invalid-feedback" />
                    </div>
)}
 {values.payment_terms === "Request for Change Payment" && (
                      <div className="mb-3">
                      <Label for="payment_terms" className="form-label">
                        What are your Payment Terms?
                      </Label>
                      <Field
                        name="payment_terms"
                        as="select"
                        onChange={e => {
                          const value = e.target.value;
                          setFieldValue('payment_terms', value);

                          // Reset fields when changing payment terms
                          if (value !== "Payment by Coorporate to LH") {
                            setFieldValue('limit', '');
                            setFieldValue('end_date', '');
                          }
                          if (value !== "Request for Change Payment") {
                            setFieldValue('reason', '');
                          }
                        }}
                        value={values.payment_terms}
                        className="form-select"
                      >
                        <>
                            <option value="Request for Change Payment">
                              Request for Change Payment
                            </option>
                            <option value="Payment by Coorporate to LH">
                              Payment by Corporate to LH
                            </option>
                          </>
                      </Field>
                      <ErrorMessage name="payment_terms" component="div" className="invalid-feedback" />
                    </div>
)}
{/* Conditionally render Quota Amount and Limit Expiry Date */}
{values.payment_terms === "Payment by Coorporate to LH" && (values.payment_request !== "Request for Change Payment" || values.payment_request !== "Approved Payment Method") && (
  <>
    <div>
      <Label for="limit" className="form-label">
        Quota Amount
        <span style={{ color: "#f46a6a" }} className="font-size-18">*</span>
      </Label>
      <Field
        id="limit"
        name="limit"
        type="text"
        className={
          "form-control" 
          // +
          // (errors.limit && touched.limit ? " is-invalid" : "")
        }
      />
      {/* <ErrorMessage name="limit" component="div" className="invalid-feedback" /> */}
    </div>
    <p className="text-danger font-size-12"><strong>Note: This Amount will be assigned to all employees and their family members.</strong></p>

    <div className="mb-3">
      <Label for="end_date" className="form-label">
        End Date
      </Label>
      <Input
        id="end_date"
        name="end_date"
        type="datetime-local"
        value={values.end_date}
        onChange={e => {
          setFieldValue('end_date', e.target.value);
        }}
        className="form-control"
      />
      {/* <ErrorMessage name="end_date" component="div" className="text-danger" /> */}
    </div>
  </>
)}
{/* Conditionally render Reason */}
{values.payment_terms === "Request for Change Payment" && (
  <div className="mb-3">
    <Label for="reason" className="form-label">
      Reason
    </Label>
    <Field
      as="textarea"
      id="reason"
      name="reason"
      rows="2"
      cols="5"
      placeholder="Enter reason for change payment method"
      className={
        "form-control" 
        // +
        // (errors.reason && touched.reason ? " is-invalid" : "")
      }
    />
    {/* <ErrorMessage name="reason" component="div" className="invalid-feedback" /> */}
  </div>
)}


                      {/* District field */}
                      {/* <div className="mb-3">
                        <Label for="district" className="form-label">
                          District
                        </Label>
                        <Field
                          id="district"
                          name="district"
                          type="text"
                          onChange={e =>
                            this.setState({
                              district: e.target.value,
                            })
                          }
                          value={this.state.district}
                          className={
                            "form-control" +
                            (errors.district && touched.district
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="district"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div> */}
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

CorporateProfile.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  updateCorporateProfile: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getCorporateProfile: PropTypes.func,
  getCorporateProfileSuccess: PropTypes.func,
  getTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => {
  const { territoriesList } = state.CorporateInformation;
  const { error, success } = state.CorporateProfile;

  return { error, success, territoriesList };
};

export default withRouter(
  connect(mapStateToProps, {
    getTerritoriesList,
    updateCorporateProfile,
    getCorporateProfile,
    getCorporateProfileSuccess,
  })(CorporateProfile)
);
