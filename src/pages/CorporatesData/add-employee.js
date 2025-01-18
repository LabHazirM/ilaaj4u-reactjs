import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { Field, Formik } from "formik";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Input,
  Alert,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
} from "reactstrap";
import classnames from "classnames";
import { isEmpty, map, size } from "lodash";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewCemployeeData,
  getEmployeeCorporate,
} from "store/corporatedata/actions";

import {
  getCorporateProfile,
} from "../../store/actions";

class DonorPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cemployeeDatas: [],
      complaintSuccess: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      name: "",
      employee_code: "",
      type: "Employee",
      parent_employee_id: "",
      relation: "",
      limit: "",
      date: "",
      CorporateProfile: [],
      payment_terms: "",
      isDisabled: true,
      isRequiredFilled: true,
      cemployeeData: "",
      checkedoutData: "",
      selectedGroup: null,
      errors: {},
    };
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  async componentDidMount() {
    const { cemployeeDatas,onGetEmployeeCorporate, getCorporateProfile } = this.props;
    try {
      const response = await getCorporateProfile(this.state.user_id);
      if (response && response.payment_terms) {
        this.setState({
          payment_terms: response.payment_terms,
        });
      } else {
        console.log('Payment terms not found in response');
      }
    } catch (error) {
      console.error('Error fetching corporate profile:', error);
    }
  
    onGetEmployeeCorporate(this.state.user_id);
    this.setState({ cemployeeDatas });
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cemployeeDatas } = this.props;
    console.log("cemployeeDatas",cemployeeDatas);
    if (
      isEmpty(prevProps.cemployeeDatas) &&
      !isEmpty(cemployeeDatas) &&
      size(cemployeeDatas) !== size(prevProps.cemployeeDatas)
    ) {
      this.setState({ cemployeeDatas });
    }
    if (prevProps.CorporateProfile !== this.props.CorporateProfile) {
      const { CorporateProfile } = this.props;
      if (CorporateProfile && CorporateProfile.payment_terms) {
        this.setState({
          payment_terms: CorporateProfile.payment_terms,
        });
      }
    }
  }
 
  

  handleSelectGroup = (selectedGroup) => {
    this.setState({
      parent_employee_id: selectedGroup.label, // Store the name instead of the ID
      errors: { ...this.state.errors, parent_employee_id: "" }, // Clear error
    });
  };

  handleProceedClick = () => {
    const errors = {};

    if (!this.state.name) errors.name = "Name is required";
    if (!this.state.employee_code) errors.employee_code = "ID Card No is required";

    if (this.state.payment_terms === "Payment by Coorporate to LH") {
      if (!this.state.limit) errors.limit = "Amount Limit is required";
      if (!this.state.date) errors.date = "Limit Expiry Date is required";
    }

    if (this.state.type === "Family") {
      if (!this.state.parent_employee_id) errors.parent_employee_id = "Parent Employee Name is required";
      if (!this.state.relation) errors.relation = "Relation with Employee is required";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    const relation = this.state.type === "Family" ? this.state.relation : "Self";

    this.setState(
      {
        cemployeeData: {
          name: this.state.name,
          employee_code: this.state.employee_code,
          type: this.state.type,
          parent_employee_id: this.state.parent_employee_id,
          relation,
          limit: this.state.limit,
          date: this.state.date,
        },
        CorporateProfile:{
          payment_terms:this.state.payment_terms,
        }
      },
      () => {
        console.log("Payment Terms:", this.state.CorporateProfile.payment_terms);
        const { onAddcemployeeData } = this.props;
        setTimeout(() => {
          onAddcemployeeData(this.state.cemployeeData, this.state.user_id);
        }, 1000);
        setTimeout(() => {
          if (this.state.cemployeeData) {
            this.setState({
              complaintSuccess: "Data Added Successfully",
            });
          }
        }, 1000);
        setTimeout(() => {
          this.setState({
            complaintSuccess: "",
            employee_code: "",
            type: "",
            name: "",
            parent_employee_id: "",
            relation: "",
            limit: "",
            date: "",
          });
        }, 5000);
        setTimeout(() => {
          if (this.state.cemployeeData) {
            this.props.history.push("/employee-list");
          }
        }, 3000);
      }
    );
  };

  render() {
    const { cemployeeDatas, errors, payment_terms,CorporateProfile} = this.state;
    console.log("cemployeeDatas",cemployeeDatas);
    console.log("State CorporateProfile:", this.state.CorporateProfile);
    console.log("Props CorporateProfile:", this.props.CorporateProfile);
  
    const employeeList = [];
    for (let i = 0; i < cemployeeDatas.length; i++) {
      if (cemployeeDatas[i].status === "Active" && cemployeeDatas[i].type === "Employee") {
        employeeList.push({
          label: `${cemployeeDatas[i].id} - ${cemployeeDatas[i].name}`,
          value: cemployeeDatas[i].id,
        });
      }
    }
  
    const relationOptions = [
      { label: "Mother", value: "Mother" },
      { label: "Father", value: "Father" },
      { label: "Spouse", value: "Spouse" },
      { label: "Son", value: "Son" },
      { label: "Daughter", value: "Daughter" },
      { label: "Sibling", value: "Sibling" },
      { label: "Other", value: "Other" },
    ];
  
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Employee | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Add" breadcrumbItem="Employee Data" />
            <Col
              sm="2"
              lg="2"
              style={{ marginLeft: "80%", marginBottom: "10px" }}
            >
              <div>
                <Link to={"/employee-file"} className="w-70 font-10 btn btn-secondary">
                  <i className="mdi mdi-upload me-1" />
                  Upload File
                </Link>
              </div>
            </Col>
            <Formik>
              <div className="checkout-tabs">
                <Row>
                  <Col lg="1" sm="1"></Col>
                  <Col lg="10" sm="9">
                    {!this.state.isRequiredFilled ? (
                      <Alert color="danger" className="col-md-5">
                        Please fill the required fields.
                      </Alert>
                    ) : null}
                    {this.state.complaintSuccess && (
                      <Alert color="success" className="col-md-8">
                        {this.state.complaintSuccess}
                      </Alert>
                    )}
  
                    <Card>
                      <CardBody>
                        <div>
                          <CardTitle className="h4">
                            Employee Information
                          </CardTitle>
                          <p className="card-title-desc">
                            Fill the Employee Information
                          </p>
                          <FormGroup className="mb-4" row>
                            <Label htmlFor="type" md="2" className="col-form-label">
                              Type
                            </Label>
                            <Col md="10">
                              <Field
                                name="payment_method"
                                as="select"
                                className="form-control"
                                multiple={false}
                                value={this.state.type}
                                onChange={(e) =>
                                  this.setState({
                                    type: e.target.value,
                                  })
                                }
                              >
                                <option value="Employee">Employee</option>
                                <option value="Family">
                                  Family and Friends
                                </option>
                              </Field>
                            </Col>
                          </FormGroup>
                          {this.state.type === "Family" && (
                            <>
                              <FormGroup className="mb-3" row>
                                <Label htmlFor="parent_employee_id" md="2" className="col-form-label">
                                  Parent Employee Name
                                </Label>
                                <Col md="10">
                                  <Select
                                    name="parent_employee_id"
                                    component="Select"
                                    onChange={this.handleSelectGroup}
                                    className={
                                      "defautSelectParent" +
                                      (!this.state.parent_employee_id ? " is-invalid" : "")
                                    }
                                    styles={{
                                      control: (base, state) => ({
                                        ...base,
                                        borderColor: !this.state.parent_employee_id
                                          ? "#f46a6a"
                                          : "#ced4da",
                                      }),
                                    }}
                                    options={employeeList}
                                    placeholder="Select Employee..."
                                  />
                                  {errors.parent_employee_id && (
                                    <div className="invalid-feedback">
                                      {errors.parent_employee_id}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label htmlFor="relation" md="2" className="col-form-label">
                                  Relation with Employee
                                </Label>
                                <Col md="10">
                                  <Select
                                    name="relation"
                                    component="Select"
                                    onChange={(selectedOption) =>
                                      this.setState({
                                        relation: selectedOption.value,
                                      })
                                    }
                                    options={relationOptions}
                                    placeholder="Select Relation..."
                                  />
                                  {errors.relation && (
                                    <div className="invalid-feedback">
                                      {errors.relation}
                                    </div>
                                  )}
                                </Col>
                              </FormGroup>
                            </>
                          )}
                          <FormGroup className="mb-4" row>
                            <Label htmlFor="name" md="2" className="col-form-label">
                              Name
                              <span style={{ color: "#f46a6a" }} className="font-size-18">
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                type="text"
                                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                name="name"
                                placeholder="Enter Name"
                                onChange={(e) =>
                                  this.setState({
                                    name: e.target.value,
                                    errors: { ...this.state.errors, name: "" }, // Clear error
                                  })
                                }
                              />
                              {errors.name && (
                                <div className="invalid-feedback">{errors.name}</div>
                              )}
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label htmlFor="employee_code" md="2" className="col-form-label">
                              ID Card No
                              <span style={{ color: "#f46a6a" }} className="font-size-18">
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                id="employee_code"
                                name="employee_code"
                                type="text"
                                className={`form-control ${errors.employee_code ? "is-invalid" : ""}`}
                                placeholder="Please Enter ID."
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (value.length <= 13 && /^[0-9]*$/.test(value)) {
                                    this.setState({
                                      employee_code: value,
                                      errors: { ...this.state.errors, employee_code: "" }, // Clear error
                                    });
                                  }
                                }}
                                value={this.state.employee_code}
                              />
                              {errors.employee_code && (
                                <div className="invalid-feedback">
                                  {errors.employee_code}
                                </div>
                              )}
                            </Col>
                          </FormGroup>
                          {payment_terms === "Payment by Coorporate to LH" && (
                            <>
                              <FormGroup className="mb-4" row>
                                <Label htmlFor="limit" md="2" className="col-form-label">
                                  Quota Amount
                                  <span
                                    style={{ color: "#f46a6a" }}
                                    className="font-size-18"
                                  >
                                    *
                                  </span>
                                </Label>
                                <Col md="10">
                                  <Input
                                    id="limit"
                                    name="limit"
                                    type="text"
                                    className={`form-control ${errors.limit ? "is-invalid" : ""}`}
                                    placeholder="Please Enter limit."
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value.length <= 13 && /^[0-9]*$/.test(value)) {
                                        this.setState({
                                          limit: value,
                                          errors: { ...this.state.errors, limit: "" }, // Clear error
                                        });
                                      }
                                    }}
                                    value={this.state.limit}
                                  />
                                  {errors.limit && (
                                    <div className="invalid-feedback">{errors.limit}</div>
                                  )}
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                            <Label htmlFor="date" md="2" className="col-form-label">
                              Limit Expiry Date
                              <span style={{ color: "#f46a6a" }} className="font-size-18">
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                id="date"
                                name="date"
                                min={new Date(
                                  new Date().toString().split("GMT")[0] +
                                  " UTC"
                                )
                                  .toISOString()
                                  .slice(0, -8)}
                                type="datetime-local"
                                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                                placeholder="Please Enter Date."
                                onChange={(e) =>
                                  this.setState({
                                    date: e.target.value,
                                    errors: { ...this.state.errors, date: "" }, // Clear error
                                  })
                                }
                                value={this.state.date}
                              />
                              {errors.date && (
                                <div className="invalid-feedback">{errors.date}</div>
                              )}
                            </Col>
                          </FormGroup>
                            </>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                    <Row className="mt-4">
                      <Col sm="6"></Col>
                      <Col sm="6">
                        <div className="text-end">
                          <button
                            component={Link}
                            onClick={this.handleProceedClick}
                            className="btn btn-success mb-4"
                          >
                            <i className="mdi mdi-truck-fast me-1" /> Create
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row></Row>
              </div>
            </Formik>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

DonorPayment.propTypes = {
  match: PropTypes.object,
  history: PropTypes.any,
  success: PropTypes.any,
  cemployeeDatas: PropTypes.array,
  onAddcemployeeData: PropTypes.func,
  getCorporateProfile: PropTypes.func.isRequired,
  CorporateProfile: PropTypes.object, // Adjusted this to object
  onGetEmployeeCorporate: PropTypes.func,
};
const mapStateToProps = ({ cemployeeData,CorporateProfile }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  cemployeeData: cemployeeData.cemployeeData,
  CorporateProfile:CorporateProfile.success,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddcemployeeData: (cemployeeData, id) =>
    dispatch(addNewCemployeeData(cemployeeData, id)),
  onGetEmployeeCorporate: (id) => dispatch(getEmployeeCorporate(id)),
  getCorporateProfile: (id) => dispatch(getCorporateProfile(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));
