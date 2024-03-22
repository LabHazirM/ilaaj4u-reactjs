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
  addNewCemployeefile,
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
      excel_file: "",
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
        excel_file: this.state.excel_file,
      },
    });

    // API call to get the checkout items
    const { onAddcemployeefile } = this.props;setTimeout(() => {
      console.log(
        onAddcemployeefile(this.state.cemployeeData)
      );
    }, 1000);
        // If no error messages then show wait message
        setTimeout(() => {
          if (this.state.cemployeeData) {
            this.setState({
              complaintSuccess: "Employee Added Successfully",
            });
            
            // Navigate to "/employee-list" route
            setTimeout(() => {
              this.props.history.push("/employee-list");
            }, 3000);
          } else {
            this.setState({
              complaintSuccess: "Please Provide Correct data",
            });
          }
        }, 1000);
        
        setTimeout(() => {
          this.setState({
            complaintSuccess: "",
            excel_file: "",
          });
        }, 5000);        
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
                      <div className="w-100">
                        <h4><b>Instructions to fill the excel sheet:</b></h4>
                        <div>
                          <ol>
                            <li>
                              Create a file whose format is, .xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf
                            </li>
                            <li>
                              There should be a file of 3 columns, in while corporate_id, name, employee_code (13 digits National ID Card Number)
                            </li>
                            {/* <li>
                              If you are offering a test that is not in the list,
                              add the test at the end.
                            </li> */}
                            <li>
                              Please use <strong>Unique</strong> employee_code (13 digits National ID Card Number)
                            </li>
                            <li>
                              If the employee_code (13 digits National ID Card Number) is alraedy used, the entries in the file will be auto skipped.
                            </li>
                            <li>
                              If you want to get more information, contact
                              us at <strong>labhazir@gmail.com</strong>
                            </li>
                          </ol>
                        </div>
                      </div>
                      <div>
                        <Col lg="3">
                          <FormGroup className=" mt-4 mb-0">
                            <Label htmlFor="expirydateInput" className="fw-bolder">
                              Upload File
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              id="formFile"
                              name="excel_file"
                              type="file"
                              multiple={false}
                              accept=".xlsx, .xls, .csv, .ods, .xml, .html, .txt, .dbf"
                              onChange={e => {
                                const file = e.target.files[0];
                                if (file) {
                                  const allowedTypes = [".xlsx", ".xls", ".csv", ".ods", ".xml", ".html", ".txt", ".dbf"];
                                  const fileType = file.name.split(".").pop(); // Get the file extension
                                  if (allowedTypes.includes("." + fileType.toLowerCase())) {
                                    this.setState({ excel_file: file });
                                  } else {
                                    alert("Only XLSX, XLS, CSV, ODS, XML, HTML, TXT, and DBF file types are allowed.");
                                    e.target.value = null; // Clear the file input
                                    this.setState({ excel_file: null });
                                  }
                                }
                              }}
                              className="form-control"
                            />

                          </FormGroup>
                        </Col></div>
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
                            <i className="mdi mdi-truck-fast me-1" /> Upload{" "}
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
  onAddcemployeefile: PropTypes.func,
  cemployeeData: PropTypes.array,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  cemployeeData: cemployeeData.cemployeeData,

});

const mapDispatchToProps = (dispatch, ownProps) => ({

  onAddcemployeefile: (cemployeeData) =>
    dispatch(addNewCemployeefile(cemployeeData)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));

