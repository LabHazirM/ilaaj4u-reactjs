import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
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

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewCemployeeData,
  getEmployeeCorporate,
} from "store/corporatedata/actions";

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
      relation: "", // Added state for relation
      limit :"",
      isDisabled: true,
      isRequiredFilled: true,
      cemployeeData: "",
      checkedoutData: "",
      selectedGroup: null,
    };
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  componentDidMount() {
    const { cemployeeDatas, onGetEmployeeCorporate } = this.props;
    onGetEmployeeCorporate(this.state.user_id);
    this.setState({ cemployeeDatas });
    console.log("state", cemployeeDatas);
  }

  handleSelectGroup = (selectedGroup) => {
    this.setState({ 
      parent_employee_id: selectedGroup.label, // Store the name instead of the ID
    });
  };

  handleProceedClick = () => {
    const relation = this.state.type === "Family" ? this.state.relation : "Himself";
  
    this.setState(
      {
        cemployeeData: {
          name: this.state.name,
          employee_code: this.state.employee_code,
          type: this.state.type,
          parent_employee_id: this.state.parent_employee_id, // Now contains the name
          relation,
          limit: this.state.limit,
        },
      },
      () => {
        const { onAddcemployeeData } = this.props;
        setTimeout(() => {
          onAddcemployeeData(this.state.cemployeeData, this.state.user_id);
        }, 1000);
        // Success message logic
        setTimeout(() => {
          if (this.state.cemployeeData) {
            this.setState({
              complaintSuccess: "Data Added Successfully",
            });
          }
        }, 1000);
        // Reset state
        setTimeout(() => {
          this.setState({
            complaintSuccess: "",
            employee_code: "",
            type: "",
            name: "",
            parent_employee_id: "",
            relation: "",
            limit: "",
          });
        }, 5000);
        // Redirect logic
        setTimeout(() => {
          if (this.state.cemployeeData) {
            this.props.history.push("/employee-list");
          }
        }, 3000);
      }
    );
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cemployeeDatas } = this.props;
    if (
      isEmpty(prevProps.cemployeeDatas) &&
      !isEmpty(cemployeeDatas) &&
      size(cemployeeDatas) !== size(prevProps.cemployeeDatas)
    ) {
      this.setState({ cemployeeDatas });
    }
  }

  render() {
    const cemployeeData = this.state.cemployeeData;

    const { cemployeeDatas } = this.props;

    const employeeList = [];
    for (let i = 0; i < cemployeeDatas.length; i++) {
      if (cemployeeDatas[i].status === "Active" && cemployeeDatas[i].type ==="Employee") {
        employeeList.push({
          label: cemployeeDatas[i].name,
          value: cemployeeDatas[i].id,
        });
      }
    }

    // Relation options
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
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Add" breadcrumbItem="Employee Data" />
            <Col
              sm="2"
              lg="2"
              style={{ marginLeft: "80%", marginBottom: "10px" }}
            >
              <div>
                <Link
                  to={"/employee-file"}
                  className="w-70 font-10 btn btn-secondary"
                >
                  {" "}
                  <i className="mdi mdi-upload me-1" />
                  Upload File{" "}
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
                            <Label
                              htmlFor="type"
                              md="2"
                              className="col-form-label"
                            >
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
                          {this.state.type === "Family" ? (
                            <>
                              <FormGroup className="mb-3" row>
                                <Label
                                  htmlFor="name"
                                  md="2"
                                  className="col-form-label"
                                >
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
                                  <div className="invalid-feedback">
                                    Please select Parent Employee.
                                  </div>
                                </Col>
                              </FormGroup>
                              <FormGroup className="mb-4" row>
                                <Label
                                  htmlFor="relation"
                                  md="2"
                                  className="col-form-label"
                                >
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
                                </Col>
                              </FormGroup>
                            </>
                          ) : null}
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Name
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Enter Name"
                                onChange={(e) =>
                                  this.setState({
                                    name: e.target.value,
                                  })
                                }
                              />
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
      placeholder="Please Enter ID."
      onChange={(e) => {
        const value = e.target.value;
        if (value.length <= 13 && /^[0-9]*$/.test(value)) {
          // Allow only digits and ensure length is not more than 13
          this.setState({
            employee_code: value,
          });
        }
      }}
      value={this.state.employee_code}
    />
  </Col>
</FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="limit"
                              md="2"
                              className="col-form-label"
                            >
                              Amount Limit
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
                                placeholder="Please Enter limit."
                                onChange={(e) =>
                                  this.setState({
                                    limit: e.target.value,
                                  })
                                }
                                value={this.state.limit}
                              />
                            </Col>
                          </FormGroup>
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
                            // to="/donor-appointment"
                            className="btn btn-success mb-4"
                          >
                            <i className="mdi mdi-truck-fast me-1" /> Create{" "}
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
  history: any,
  cemployeeDatas: PropTypes.array,
  onAddcemployeeData: PropTypes.func,
  cemployeeData: PropTypes.array,
  onGetEmployeeCorporate: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  cemployeeData: cemployeeData.cemployeeData,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddcemployeeData: (cemployeeData, id) =>
    dispatch(addNewCemployeeData(cemployeeData, id)),
  onGetEmployeeCorporate: (id) => dispatch(getEmployeeCorporate(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));
