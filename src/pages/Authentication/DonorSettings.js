import PropTypes from "prop-types";
import React, { Component } from "react";
import Select from "react-select";
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

import { CITIES, DISTRICTS } from "helpers/global_variables_helper";


//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateDonorSettings, getDonorSettings } from "../../store/actions";


let mainLabOptionGroup = [
  {
    options: [],
  },
];

class LabSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donation_to: "",
      lab_id: "",
      province: "",
      district: "",
      city: "",
      main_lab_account_id: "",
      isSettingsUpdated: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
  }

  componentDidMount() {
    // this.props.getTerritoriesList();
    setTimeout(() => {
      this.props.getDonorSettings(this.state.user_id);
    }, 1000);

    setTimeout(() => {
      this.setState({
        donation_to: this.props.success.donation_to,
        lab_id: this.props.success.lab_id,
        province: this.props.success.province,
        district: this.props.success.district,
        city: this.props.success.city,
      });
    }, 2000);
  }

  render() {

    // const cityList = [];
    // for (let i = 0; i < this.props.territoriesList.length; i++) {
    //   cityList.push({
    //     label: this.props.territoriesList[i].city,
    //     value: this.props.territoriesList[i].id,
    //   });
    // }

    // const districtList = [];
    // for (let i = 0; i < this.props.territoriesList.length; i++) {
    //   districtList.push({
    //     label: this.props.territoriesList[i].district,
    //     value: this.props.territoriesList[i].id,
    //   });
    // }


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
                    donation_to:
                      (this.state && this.state.donation_to) || "",
                    province:
                      (this.state && this.state.province) || "",
                    lab_id:
                      (this.state && this.state.lab_id) || "",
                    district: (this.state && this.state.district) || "",
                    city: (this.state && this.state.city) || "",
                    main_lab_account_id:
                    (this.state &&
                      this.state.main_lab_account_id) ||
                    "",
               
                  }}
                  validationSchema={Yup.object().shape({
                    main_lab_account_id: Yup.string().when("donation_to", {
                      is: val => val === "lab",
                      then: Yup.string().required(
                        "Please enter your main lab"
                      ),
                    }),
                                   })}
                  onSubmit={values => {
                    console.log("values: ", values);
                    // If health dept certified is selected and certificate is uploaded
                    if (
                      (this.state.donation_to.length > 0 &&
                        this.state.donation_to) ||
                      this.state.donation_to.length == 0
                    ) {
                  
                      // To show success message of update
                      this.setState({ isSettingsUpdated: true });
                      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                      setTimeout(() => {
                        this.props.updateDonorSettings(
                          values,
                          this.state.user_id
                        );

                        // To get updated settings again
                        setTimeout(() => {
                          this.props.getDonorSettings(this.state.user_id);
                        }, 2000);

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
                      <p>{errors.donation_to}</p>
                      {/* Operational Hours Fields */}
                     

                      {/* Health Dept Certified */}
                      <div className="mb-3">
                        <Label
                          for="donation_to"
                          className="form-label"
                        >
                          Donation To
                        </Label>
                        <Field
                          name="donation_to"
                          component="select"
                          onChange={e =>
                            this.setState({
                              donation_to: e.target.value,
                            })
                          }
                          defaultValue={this.state.donation_to}
                          className="form-select"
                        >
                          <option value="All">All</option>
                          <option value="Lab">Lab</option>
                          <option value="Province">Province</option>
                          <option value="District">District</option>
                          <option value="City">City</option>

                        </Field>
                      </div>
                      {this.state.donation_to === "Province" && (

                        <div className="mb-3">
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
                        </div>

                      )}
                            {/* disctrict field */}
                      {this.state.donation_to === "District" && (
                            <div className="mb-3">
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

                      )}
                            {/* city field */}
                        {this.state.donation_to === "City" && (
                          <div className="mb-3">
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
                                className={
                                  "defautSelectParent" +
                                  (errors.city && touched.city
                                    ? " is-invalid"
                                    : "")
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
                                                )}
                      {/* {this.state.donation_to === "Lab" && (
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
                      )} */}
      
                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
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
  updateDonorSettings: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getDonorSettings: PropTypes.func,
  territoriesList: PropTypes.array,
  // getTerritoriesList:PropTypes.func,
};

const mapStateToProps = state => {
  
  const { error, success } = state.LabSettings;
  return { error, success };
  
};

export default withRouter(
  connect(mapStateToProps, {
    // getTerritoriesList,
    updateDonorSettings,
    getDonorSettings,
  })(LabSettings)
);
