import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Label, Input, Alert } from "reactstrap";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getTerritoriesList
  } from "store/territories-list/actions";
  
import { addStaff, addStaffFail } from "store/staff/actions";

class StaffInfo extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      staff: [],
      staff: "",
      collectorImg: "",
      territoriesList: [],
      complaintSuccess: "",
      successMessage: "", 
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };

  }

  componentDidMount() {
    const { territoriesList, onGetTerritoriesList, addStaffFail } = this.props;
    addStaffFail(""); 
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
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
    const { onAddStaff } = this.props;
    const staff = this.state.staff;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Staff | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Register - Step 2" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
          {/* Render error message */}
          {this.props.addStaffError &&
                            this.props.addStaffError ? (
                            <Alert color="danger" style={{ marginTop: "13px" }}>
                              {this.props.addStaffError}
                            </Alert>
                          ) : null}
{this.props.addStaffSuccess && (
  <React.Fragment>
    <Alert color="success" style={{ marginTop: "13px" }}>
      {this.props.addStaffSuccess.message}
    </Alert>
    {setTimeout(() => {
      this.props.history.push("/csr-list");
    }, 2000)} 
  </React.Fragment>
)}


                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        name: (staff && staff.name) || "",
                        email: (staff && staff.email) || "",
                        cnic: (staff && staff.cnic) || "",
                        phone: (staff && staff.phone) || "",
                        roles: (staff && staff.roles) || "",
                        city_id: (this.state && this.state.city_id) || "",
                        photo: (this.state && this.state.collectorImg) || "",
                      }}
                      validationSchema={Yup.object().shape({
                        hiddentEditFlag: Yup.boolean(),
                        name: Yup.string()
                          .trim()
                          .required("Please enter name"),
                        cnic: Yup.string()
                          .required("Please enter your CNIC")
                          .matches(
                            /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                            "Please enter a valid CNIC e.g. 37106-8234782-3"
                          ),
                        email: Yup.string()
                          .required("Please enter your email")
                          .email("Please enter valid email"),
                        phone: Yup.string()
                          .required("Please enter phone")
                          .matches(
                            /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                            "Please enter a valid Pakistani phone number e.g. 03123456789"
                          ),
                          photo: Yup.string().required("Please upload photo"),
                        roles: Yup.string()
                          .trim()
                          .required("Please enter roles"),
                      })}
                      onSubmit={values => {
                        const newStaff = {
                          email: values.email,
                          name: values.name,
                          cnic: values.cnic,
                          phone: values.phone,
                          photo: this.state.collectorImg,
                          roles: values.roles,
                          city_id: values.city_id,
                        };

                        // save new Staff
                        onAddStaff(newStaff, this.props.match.params.id);
                      }}
                    >
                      {({ errors, status, touched }) => (
                        <Form>
                          <Row>
                            <Col className="col-12">
                              <div className="mb-3">
                                <Label className="form-label">Name</Label>
                                <Field
                                  name="name"
                                  type="text"
                                  placeholder="Enter name"
                                  value={this.state.staff.name}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: e.target.value,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        roles: staff.roles,
                                        city_id: staff.city_id,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
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
                                <Label className="form-label">Email</Label>
                                <Field
                                  name="email"
                                  type="text"
                                  placeholder="Enter email"
                                  value={this.state.staff.email}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        email: e.target.value,
                                        name: staff.name,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        roles: staff.roles,
                                        city_id: staff.city_id,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
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
                                <Label className="form-label">CNIC</Label>
                                <Field
                                  name="cnic"
                                  type="text"
                                  placeholder="Enter CNIC"
                                  value={this.state.staff.cnic}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: e.target.value,
                                        phone: staff.phone,
                                        roles: staff.roles,
                                        city_id: staff.city_id,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.cnic && touched.cnic
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

                              <div className="mb-3">
                                <Label className="form-label">Mobile No.</Label>
                                <Field
                                  name="phone"
                                  type="text"
                                  placeholder="Enter mobile no."
                                  value={this.state.staff.phone}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: e.target.value,
                                        roles: staff.roles,
                                        city_id: staff.city_id,
                                      },
                                    });
                                  }}
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
                                <Label for="name" className="form-label">
                                  Photo
                                </Label>
                                <Input
                                  id="formFile"
                                  name="photo"
                                  placeholder="Choose image"
                                  type="file"
                                  multiple={false}
                                  accept=".jpg,.jpeg,.png"
                                  onChange={e =>
                                    this.setState({
                                      collectorImg: e.target.files[0],
                                    })
                                  }
                                  className={
                                    "form-control" +
                                    (errors.photo && touched.photo
                                      ? " is-invalid"
                                      : "")
                                  }
                                />

                                <ErrorMessage
                                  name="photo"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                                    
                             
                              <div className="mb-3">
                                <Label className="form-label">Role</Label>
                                <Field
                                  name="roles"
                                  type="text"
                                  placeholder="Enter roles"
                                  value={this.state.staff.roles}
                                  onChange={e => {
                                    this.setState({
                                      staff: {
                                        name: staff.name,
                                        email: staff.email,
                                        cnic: staff.cnic,
                                        phone: staff.phone,
                                        roles: e.target.value,
                                        city_id: staff.city_id,
                                        photo: staff.photo,
                                      },
                                    });
                                  }}
                                  className={
                                    "form-control" +
                                    (errors.roles && touched.roles
                                      ? " is-invalid"
                                      : "")
                                  }
                                />
                                <ErrorMessage
                                  name="roles"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                                {/* city_id field
                              {/* city_id field */}
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


                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="text-end">
                                <button
                                  type="submit"
                                  className="btn btn-success save-user"
                                >
                                  Save
                                </button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

StaffInfo.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  staff: PropTypes.any,
  className: PropTypes.any,
  onAddStaff: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  territoriesList: PropTypes.array,
  addStaffFail: PropTypes.func,
  addStaffError: PropTypes.any,
  addStaffSuccess: PropTypes.any,

};

const mapStateToProps = ({ staff , territoriesList }) => ({
  staff: staff.staff,
  territoriesList:territoriesList.territoriesList,
  addStaffError: staff.addStaffError,
  addStaffSuccess: staff.addStaffSuccess,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddStaff: (staff, id) => dispatch(addStaff(staff, id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList()),
  addStaffFail: (message) => dispatch(addStaffFail(message)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StaffInfo));
