import React, { Component } from "react";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import PropTypes from "prop-types";
import { any } from "prop-types";
import { Field, Formik } from "formik";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";

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
  addNewCreateBank,
} from "store/createbank/actions";

class DonorPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createBanks: [],
      complaintSuccess:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      name: "",
      phone: "",
      email: "",
      registered_at: "",
      registered_by: "",
      isDisabled: true,
      isRequiredFilled: true,
      createBank: "",
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
      createBank: {
        name: this.state.name,
        phone: this.state.phone,
        email: this.state.email,
        registered_at: this.state.registered_at,
        registered_by: this.state.registered_by,
      },
    });

    // API call to get the checkout items
    const { onAddCreateBankData } = this.props;setTimeout(() => {
      console.log(
        onAddCreateBankData(this.state.createBank, this.state.user_id)
      );
    }, 1000);
        // If no error messages then show wait message
        setTimeout(() => {
          if (this.state.createBank) {
            this.setState({
              complaintSuccess:
                "Bank Added Successfully",
            });
          }
        }, 1000);
        setTimeout(() => {
          this.setState({
            complaintSuccess: "",
            phone: "",
            name: "",
            email: "",
            registered_at: "",
            registered_by: "",
          });
        }, 5000);
        setTimeout(() => {
          if (this.state.createBank) {
            this.props.history.push("/banks-list");
          }
        }, 3000)
  };




  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {

    const { createBanks } = this.props;
    if (
      isEmpty(prevProps.createBanks) &&
      !isEmpty(createBanks) &&
      size(createBanks) !== size(prevProps.createBanks)
    ) {
      this.setState({ createBanks });
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs title="Register" breadcrumbItem="Register Bank" />
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
                            {/* Bank Information */}
                          </CardTitle>
                          {/* <p className="card-title-desc">
                            Fill the Bank Information
                          </p> */}
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="name"
                              md="2"
                              className="col-form-label"
                            >
                              Bank Name
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
                                placeholder="Enter Bank Name"
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
                              htmlFor="phone"
                              md="2"
                              className="col-form-label"
                            >
                              Phone
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                id="phone"
                                name="phone"
                                type="text"
                                placeholder="Please enter marketer mobile no."
                                onChange={e =>
                                  this.setState({
                                    phone: e.target.value,
                                  })
                                }
                                value={this.state.phone}
                              // className={
                              //   "form-control" +
                              //   (errors.phone &&
                              //   touched.phone
                              //     ? " is-invalid"
                              //     : "")
                              // }
                              />
                            </Col>
                          </FormGroup>
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="email"
                              md="2"
                              className="col-form-label"
                            >
                              Email
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                name="email"
                                type="text"
                                placeholder="Please enter marketer email"
                                onChange={e =>
                                  this.setState({
                                    email: e.target.value,
                                  })
                                }
                                value={this.state.email}
                              // className={
                              //   "form-control" +
                              //   (errors.phone &&
                              //   touched.phone
                              //     ? " is-invalid"
                              //     : "")
                              // }
                              />
                            </Col>
                          </FormGroup>
                         
                          <FormGroup className="mb-4" row>
                            <Label
                              htmlFor="registered_by"
                              md="2"
                              className="col-form-label"
                            >
                              Registered By
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Col md="10">
                              <Input
                                name="registered_by"
                                type="text"
                                placeholder="Write the name of the one who has done the Register"
                                onChange={e =>
                                  this.setState({
                                    registered_by: e.target.value,
                                  })
                                }
                                value={this.state.registered_by}
                              // className={
                              //   "form-control" +
                              //   (errors.phone &&
                              //   touched.phone
                              //     ? " is-invalid"
                              //     : "")
                              // }
                              />
                            </Col>
                          </FormGroup>

                        </div>
                        {/* </TabPane>
                        </TabContent> */}
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
                            to="/donor-appointment"
                            className="btn btn-success mb-4"
                          >
                            <i className="mdi mdi-truck-fast me-1" /> Register Bank{" "}
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </Col>
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
  createBanks: PropTypes.array,
  // onGetDonorPaymentItems: PropTypes.func,
  onAddCreateBankData: PropTypes.func,
  createBank: PropTypes.array,
};

const mapStateToProps = ({ createBank }) => ({
  createBanks: createBank.createBanks,
  createBank: createBank.createBank,

});

const mapDispatchToProps = (dispatch, ownProps) => ({

  onAddCreateBankData: (createBank, id) =>
    dispatch(addNewCreateBank(createBank, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DonorPayment));

