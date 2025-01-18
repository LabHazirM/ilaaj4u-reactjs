import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

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
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";

import classnames from "classnames";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getListInvoice,
  addNewInvoiceAdjustment,
  getStaffProfile
} from "store/outpayments/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class OutPaymentsForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      outPayments: [],
      staffProfiles: [],
      outPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      invoice_id: "",
      total_adjustment: "",
      price_discount: "",
      others: "",
      tax: "",
      status: "",
      comments: "",
      checkedoutData: "",
      successMessage: "",
      amountExceedsLimit: false,
      selectedOption: null,
      selectedAmount: 0, // Initialize with 0, it will be updated later
    };
    // this.toggleTab = this.toggleTab.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

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

  handleSubmitClicks = () => {
    this.setState({
      outPayment: {
        invoice_id: this.state.invoice_id,
        tax: this.state.tax,
        total_adjustment: this.state.total_adjustment,
        price_discount: this.state.price_discount,
        others: this.state.others,
        status: "Approved",
        comments: this.state.comments,
      },
      successMessage: 'Invoice adjustment added successfully!',
    });
  
    // API call to create a new outPayment record
    const { onAddNewInvoiceAdjustment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewInvoiceAdjustment(this.state.outPayment, this.state.user_id)
      );
  
      // After 2 seconds, reload the window
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, 1000);
  };

  componentDidMount() {
    const { staffProfiles, onGetStaffProfile } = this.props;
    onGetStaffProfile(this.state.user_id);
    this.setState({
      staffProfiles
    });
    console.log("state", staffProfiles)

    const { listInvoice, onGetListInvoice } = this.props;
    if (listInvoice && !listInvoice.length) {
      onGetListInvoice();
    }
    this.setState({ listInvoice });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ outPayment: selectedGroup.value });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { outPayments } = this.props;
    if (
      !isEmpty(outPayments) &&
      size(prevProps.outPayments) !== size(outPayments)
    ) {
      this.setState({ outPayments: {}, isEdit: false });
    }
  }

  onPaginationPageChange = page => {
    if (
      this.node &&
      this.node.current &&
      this.node.current.props &&
      this.node.current.props.pagination &&
      this.node.current.props.pagination.options
    ) {
      this.node.current.props.pagination.options.onPageChange(page);
    }
  };

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  handleAmountChange = e => {
    const enteredAmount = e.target.value;
  
    if (parseFloat(enteredAmount) <= this.state.selectedAmount || enteredAmount === "") {
      // If the entered amount is within the limit or is empty, update the state
      this.setState({
        tax: enteredAmount,
        amountExceedsLimit: false,
      });
    } else {
      // If the entered amount exceeds the limit, display a warning
      this.setState({
        amountExceedsLimit: true,
      });
    }
  };

  render() {
    const { SearchBar } = Search;
    const { outPayments } = this.props;
    const { staffProfiles } = this.props;
    const { listInvoice } = this.props;

    // const { units } = this.props;

    const { onAddNewInvoiceAdjustment, onGetOutPayment, onGetStaffProfile } =
      this.props;
    const outPayment = this.state.outPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: outPayments.length, // replace later with size(outPayments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const listInvoiceList = [];
    for (let i = 0; i < listInvoice.length; i++) {
      if (listInvoice[i].lab_office === this.props.staffProfiles.territory_office) {
        listInvoiceList.push({
          label: `${listInvoice[i].order_id} - ${listInvoice[i].lab_name} - ${listInvoice[i].lab_type} - ${listInvoice[i].lab_city} - (Invoice Amount: ${listInvoice[i].total_dues})`,
          value: listInvoice[i].id,
          data: { dues: listInvoice[i].total_dues}, // Include the 'dues' property in the data field
        });
      }
    }


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Invoice Adjustment Form | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="Invoice Adjustment Form" />
            <Formik>
              <div className="checkout-tabs">
                {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <Row>
                  <div> <span className="text-danger font-size-12">
                    {/* <strong>
                      Note: There will be that Labs, Donors and B2b Clients whose terriotory will match this staff.
                    </strong> */}
                  </span>
                    <br></br>
                  </div>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                    {this.state.successMessage && (
          <div className="alert alert-success mt-3 w-50 ml-3" style={{marginLeft:"30px"}} role="alert">
            {this.state.successMessage}
          </div>
        )}
                      <CardBody>
                        <div>
                          {
                             outPayment.invoice_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Invoice ID
                                </Label>
                                <Field
                                  name="invoice_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.invoice_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.invoice_id
                                    }
                                    value={
                                      outPayment.invoice_id
                                    }
                                  >
                                    {
                                      outPayment.invoice_id
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">Invoice ID</Label>
                                <Select
                                  name="invoice_id"
                                  component="Select"
                                  // onChange={selectedGroup =>
                                  //   this.setState({
                                  //     invoice_id:
                                  //       selectedGroup.value,
                                  //   })
                                  // }
                                  onChange={selectedOption => {
                                    const selectedValue = selectedOption ? selectedOption.value : null;
                                    const selectedData = selectedOption ? selectedOption.data || {} : {};
                                    const totalAmount = parseFloat(selectedData.dues) || 0;
                                  
                                    this.setState({
                                      invoice_id: selectedValue,
                                      selectedOption,
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false, // Reset the flag when a new lab is selected
                                    });
                                  
                                    // Auto-set the amount field
                                    this.setState({ tax: totalAmount.toString() });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  }}
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.invoice_id
                                      ? " is-invalid"
                                      : "")
                                  }
                                  styles={{
                                    control: (
                                      base,
                                      state
                                    ) => ({
                                      ...base,
                                      borderColor: !this
                                        .state.invoice_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={listInvoiceList}
                                  placeholder="Select Invoice ID..."
                                />

                                <div className="invalid-feedback">
                                  Please select Invoice ID
                                </div>
                              </div>)
                          }

                          
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Tax
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Tax.."
                              name="tax"
                              value={this.state.tax}
                              onChange={e => this.handleAmountChange(e)}
                              />
                              {this.state.amountExceedsLimit && (
                                <span style={{ color: "#f46a6a", fontSize: "14px" }}>
                                Warning: The entered Tax cannot exceed the Invoice Amount.
                                </span>
                              )}
                          </FormGroup>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Full Invoice Adjustment
                              {/* <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span> */}
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              required={true}
                              placeholder="Enter Full Invoice Adjustment Amount.."
                              name="total_adjustment"
                              value={this.state.total_adjustment}
                              onChange={e =>
                                this.setState({
                                  total_adjustment: e.target.value,
                                })
                              }
                            />
                          </FormGroup><FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Price Discount
                              {/* <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span> */}
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              required={true}
                              placeholder="Enter Price Discount.."
                              name="price_discount"
                              value={this.state.price_discount}
                              onChange={e =>
                                this.setState({
                                  price_discount: e.target.value,
                                })
                              }
                            />
                          </FormGroup><FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Others
                              {/* <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span> */}
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              required={true}
                              placeholder="Enter Other Amount.."
                              name="others"
                              value={this.state.others}
                              onChange={e =>
                                this.setState({
                                  others: e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Comments
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Comments"
                              name="comments"
                              onChange={e =>
                                this.setState({
                                  comments: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <Row className="mt-4">
                            <Col sm="6">
                            </Col>
                            <Col sm="6">
                              <div className="text-end">
                                <button
                                  to="/dashboard-financeofficer"
                                  className="btn btn-danger"
                                  onClick={this.handleSubmitClicks}
                                // disabled={this.state.carts.length == 0}
                                >
                                  <i className="mdi mdi-truck-fast me-1" />
                                  Save and Approve
                                </button>
                              </div>

                            </Col>
                          </Row>

                        </div>
                      </CardBody>
                    </Card>
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

OutPaymentsForm.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  outPayments: PropTypes.array,
  listInvoice: PropTypes.array,
  className: PropTypes.any,
  onGetOutPayment: PropTypes.func,
  onAddNewInvoiceAdjustment: PropTypes.func,
  onGetStaffProfile: PropTypes.func,
  staffProfiles: PropTypes.func,
  onGetListInvoice: PropTypes.func,

};

const mapStateToProps = ({ outPayments }) => ({
  outPayments: outPayments.outPayments,
  staffProfiles: outPayments.staffProfiles,
  listInvoice: outPayments.listInvoice,



  // units: outPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetListInvoice: () => dispatch(getListInvoice()),
  onGetOutPayment: id => dispatch(getOutPayment(id)),
  onAddNewInvoiceAdjustment: (outPayment, id) =>
    dispatch(addNewInvoiceAdjustment(outPayment, id)),
  onGetStaffProfile: id => dispatch(getStaffProfile(id)),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OutPaymentsForm)); 
