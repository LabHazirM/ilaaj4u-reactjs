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
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  Form,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";

import classnames from "classnames";

import { isEmpty, map, size } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

import {
  addNewCemployeeData,
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
      isDisabled: true,
      isRequiredFilled: true,
      cemployeeData: "",
      checkedoutData: "",
      selectedGroup: null,
    };
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

  handleSelectGroup = selectedGroup => {
    this.setState({ selectedGroup });
  };

  handleProceedClick = () => {
    this.setState({
      cemployeeData: {
        name: this.state.name,
        employee_code: this.state.employee_code,
        type: this.state.type,
      },
    });

    // API call to get the checkout items
    const { onAddcemployeeData } = this.props; setTimeout(() => {
      console.log(
        onAddcemployeeData(this.state.cemployeeData, this.state.user_id)
      );
    }, 1000);
    // If no error messages then show wait message
    setTimeout(() => {
      if (this.state.cemployeeData) {
        this.setState({
          complaintSuccess:
            "Employee Added Successfully",
        });
      }
    }, 1000);
    setTimeout(() => {
      this.setState({
        complaintSuccess: "",
        employee_code: "",
        type: "",
        name: "",
      });
    }, 5000);
    setTimeout(() => {
      if (this.state.cemployeeData) {
        this.props.history.push("/employee-list");
      }
    }, 3000)
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
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Employee | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Add" breadcrumbItem="Employee Data" />
            <Col sm="2" lg="2" style={{ marginLeft: "80%", marginBottom: "10px" }}>
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
                  <Col lg="1" sm="1">
                  </Col>
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
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Employee Name
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
                                placeholder="Enter Employee Name"
                                onChange={e =>
                                  this.setState({
                                    name: e.target.value,
                                  })
                                }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="employee_code"
                              md="2"
                              className="col-form-label"
                            >
                              Employee ID Card No
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                id="employee_code"
                                name="employee_code"
                                type="text"
                                placeholder="Please Enter Employee ID."
                                onChange={e =>
                                  this.setState({
                                    employee_code: e.target.value,
                                  })
                                }
                                value={this.state.employee_code}
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label htmlFor="employee_code"
                              md="2"
                              className="col-form-label">
                              Type
                            </Label>
                            <Col md="10">

                              <Field
                                name="payment_method"
                                as="select"
                                className="form-control"
                                multiple={false}
                                value={
                                  this.state.type
                                }
                                onChange={e =>
                                  this.setState({
                                    type: e.target.value,
                                  })
                                }
                              >
                                <option value="Employee">
                                  Employee
                                </option>
                                <option value="Family">
                                  Family and Friends
                                </option>
                              </Field></Col>
                          </FormGroup>
                        </div>
                      </CardBody>
                    </Card>
                    <Row className="mt-4">
                      <Col sm="6">
                      </Col>
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
                <Row>

                </Row>
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
  // onGetDonorPaymentItems: PropTypes.func,
  onAddcemployeeData: PropTypes.func,
  cemployeeData: PropTypes.array,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  cemployeeData: cemployeeData.cemployeeData,

});

const mapDispatchToProps = (dispatch, ownProps) => ({

  onAddcemployeeData: (cemployeeData, id) =>
    dispatch(addNewCemployeeData(cemployeeData, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));

