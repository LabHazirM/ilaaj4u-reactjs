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
  addB2bClientInformation,
  addB2bClientInformationFailed,
} from "../../store/auth/b2bclientinformation/actions";

// Redux
import { connect } from "react-redux";

class B2bClientInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      landline: "",
      website_url: "",
      business_logo: "",
      // district: "",
      // province: "Punjab",
      city_id: "",
    };
  }

  componentDidMount() {
    this.props.addB2bClientInformationFailed("");
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
            <title>B2B Client Information | Lab Hazir</title>
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
                            B2B Client Account Information
                          </h5>
                          <p className="text-muted">
                            You are one step away from your free Lab Hazir
                            account.
                          </p>
                        </div>

                        <div className="mt-4">
                          {this.props.b2bclient && this.props.b2bclient ? (
                            <Alert
                              color="success"
                              style={{ marginTop: "13px" }}
                            >
                              The verification link is sent to your email,
                              please verify your account first in order to
                              login.{" "}
                            </Alert>
                          ) : null}

                          {this.props.b2bclient&& this.props.b2bclient? (
                             setTimeout(() => {
                              if (this.props.b2bclient) {
                                this.props.history.push("/login");
                              }
                            }, 2000)
                          ) : null}
                          

                          {this.props.addB2bClientError &&
                          this.props.addB2bClientError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addB2bClientError}
                            </Alert>
                          ) : null}

                          <Formik
                            enableReinitialize={true}
                            initialValues={{
                              name: (this.state && this.state.name) || "",
                              landline:
                                (this.state && this.state.landline) || "",
                              website_url:
                                (this.state && this.state.website_url) || "",
                              business_logo:
                                (this.state && this.state.business_logo) || "",
                              email:
                                (this.state && this.state.email) || "",
                              city_id:
                                (this.state && this.state.city_id) || "",
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
                              email: Yup.string()
                                .required("Please enter your email")
                                .email("Please enter valid email"),
                              website_url: Yup.string()
                                .required("Please enter website url")
                                .url("Please enter a valid url"),
                              landline: Yup.string()
                                .required("Please enter your phone no.")
                                .max(255, "Please enter maximum 255 characters")
                                .matches(
                                  /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                  "Please enter a valid Pakistani phone number e.g. 03123456789"
                                ),
                            })}
                            onSubmit={values => {
                              this.props.addB2bClientInformation(
                                values,
                                this.props.match.params.id
                              );
                              window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                              // Redirecting back to the login page
                             
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

                                <div className="mb-3">
                                      <Label for="name" className="form-label">
                                        Business Logo
                                      </Label>
                                      <Input
                                        id="formFile"
                                        name="business_logo"
                                        type="file"
                                        multiple={false}
                                        accept=".jpg,.jpeg,.png"
                                        onChange={e =>
                                          this.setState({
                                            business_logo: e.target.files[0],
                                          })
                                        }
                                        className={
                                          "form-control" +
                                          (errors.business_logo && touched.business_logo
                                            ? " is-invalid"
                                            : "")
                                        }
                                      />

                                      <ErrorMessage
                                        name="business_logo"
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
                                    placeholder="Enter landline No"
                                    type="text"
                                    onChange={e =>
                                      this.setState({
                                        landline: e.target.value,
                                      })
                                    }
                                    value={this.state.landline}
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
                        </div> */}


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
                       

                                {/* {URL Field} */}
                                <div className="mb-3">
                                  <Label
                                    for="website_url"
                                    className="form-label"
                                  >
                                    URL
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
      </React.Fragment>
    );
  }
}

B2bClientInformation.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  location: PropTypes.object,
  addB2bClientInformation: PropTypes.func,
  addB2bClientInformationFailed: PropTypes.any,
  addB2bClientError: PropTypes.any,
  b2bclient: PropTypes.any,
  getTerritoriesList:PropTypes.func,
  territoriesList: PropTypes.array,
};

const mapStateToProps = state => {
  const { b2bclient, addB2bClientError, loading, territoriesList } = state.B2bClientInformation;
  
  return { b2bclient, addB2bClientError, loading, territoriesList };
};

export default connect(mapStateToProps, {
  getTerritoriesList,
  addB2bClientInformation,
  addB2bClientInformationFailed,

})(B2bClientInformation);