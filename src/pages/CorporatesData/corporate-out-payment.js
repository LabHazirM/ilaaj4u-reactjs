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
  getLabsc,
  getListDonationAppointment,
  addNewCorporatePayment,
  getCorporateProfileforpayment
} from "store/outpayments/actions";
// import { getCorporateProfile } from "store/auth/staffprofile/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class OutPaymentsForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      outPayments: [],
      corporateProfiles: [],
      outPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      payment_for: "",
      lab_id: "",
      test_appointment_id: "",
      current_amount: "",
      // invoice_id: "",
      // bankaccount_id: "",
      // bank_id: "",
      originalAmount: 0, // Initialize originalAmount

      amount: "",
      tax: "",
      payment_at: "",
      payment_method: "Cheque",
      cheque_no: "",
      cheque_image: "",
      // cleared_at: "",
      // is_cleared: "",
      payment_status: "",
      comments: "",
      checkedoutData: "",
      successMessage: "",
      // transection_type: "Other",
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
        payment_for: this.state.payment_for,
        // transection_type: this.state.transection_type,
        lab_id: this.state.lab_id,
        test_appointment_id: this.state.test_appointment_id,
        // b2b_id: this.state.b2b_id,
        tax: this.state.tax,
        // bankaccount_id: this.state.bankaccount_id,
        amount: this.state.amount,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        cheque_image: this.state.cheque_image,
        // is_cleared: this.state.is_cleared,
        payment_status: "Submit",
        comments: this.state.comments,
      },
    });

    // API call to create a new outPayment record
    const { onAddNewCorporatePayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewCorporatePayment(this.state.outPayment, this.state.user_id)
      );
    }, 1000);
    setTimeout(() => {
      this.props.history.push("/corporate-payment-form-status");
    }, 2000)
  };



  handleProceedClick = () => {
    this.setState({
      outPayment: {
        payment_for: this.state.payment_for,
        lab_id: this.state.lab_id,
        test_appointment_id: this.state.test_appointment_id,
        amount: this.state.amount,
        tax: this.state.tax,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        cheque_image: this.state.cheque_image,
        payment_status: "Created",
        comments: this.state.comments,
      },
    });

    // API call to get the checkout items
    const { onAddNewCorporatePayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewCorporatePayment(this.state.outPayment, this.state.user_id)

      );
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 2000);

    setTimeout(() => {
      this.props.history.push("/corporate-payment-form-status");
      // window.location.reload()

    }, 2000)
  };

  componentDidMount() {
    const { corporateProfiles, onGetCorporateProfileforpayment } = this.props;
    onGetCorporateProfileforpayment(this.state.user_id);
    this.setState({
      corporateProfiles
    });
    console.log("state", corporateProfiles)

    // const { labsMof, onGetLabsc } = this.props;
    // if (labsMof && !labsMof.length) {
    //   onGetLabsc(this.state.user_id);
    // }
    // this.setState({ labsMof });

    const { labsMof, onGetLabsc, } = this.props;
    onGetLabsc(this.state.user_id);
    this.setState({ labsMof });
    console.log("state", labsMof)

    const { listDonation, onGetListDonationAppointment } = this.props;
    if (listDonation && !listDonation.length) {
      onGetListDonationAppointment();
    }
    this.setState({ listDonation });
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
    const enteredAmount = parseFloat(e.target.value);

    if (!isNaN(enteredAmount)) {
      const absoluteSelectedAmount = Math.abs(this.state.selectedAmount);

      if (enteredAmount <= absoluteSelectedAmount && enteredAmount >= -absoluteSelectedAmount) {
        // If the entered amount is within the limit, update the state with the absolute value
        this.setState({
          amount: Math.abs(enteredAmount),
          amountExceedsLimit: false,
        });
      } else {
        // If the entered amount exceeds the limit, display a warning
        this.setState({
          amountExceedsLimit: true,
        });
      }
    } else {
      // If the entered amount is not a valid number, reset the state
      this.setState({
        amount: '',
        amountExceedsLimit: false,
      });
    }
  };

  handleTaxChange = e => {
    const enteredTax = parseFloat(e.target.value);
    const totalAmount = parseFloat(this.state.selectedAmount); // Get the total amount from state

    if (!isNaN(enteredTax)) {
      if (enteredTax <= totalAmount) {
        // Calculate the new amount by subtracting the tax from the total amount
        const newAmount = totalAmount - enteredTax;

        // Update the state with the new calculated value, and ensure it's rounded to two decimal places
        this.setState({
          tax: enteredTax,
          amount: Math.round(newAmount * 100) / 100, // Round to two decimal places
          amountExceedsLimit: false, // Reset the flag
          taxInputError: false, // Reset the tax input error flag
        });
      } else {
        // If the entered tax exceeds the total amount, set the tax input error flag
        this.setState({
          taxInputError: true,
        });
      }
    } else {
      // If the entered tax is not a valid number or is cleared, set the amount to the total amount
      this.setState({
        tax: '',
        amount: totalAmount, // Set the amount to the total amount without subtracting tax
        amountExceedsLimit: false, // Reset the flag
        taxInputError: false, // Reset the tax input error flag
      });
    }
  };




  render() {
    const { SearchBar } = Search;
    // const isDonation = this.state.transection_type === "Donation";
    const { outPayments } = this.props;
    const { labsMof } = this.props;
    const { listDonation } = this.props;
    const { corporateProfiles } = this.props;


    // const { units } = this.props;

    const { onAddNewCorporatePayment, onGetCorporateProfileforpayment } =
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
    // const labList = [];

    // for (let i = 0; i < labsMof.length; i++) {
    //   // if (labsMof[i].office === this.props.corporateProfiles.territory_office && labsMof[i].current_amount < 0) {
    //   //   const formattedAmount = Math.abs(labsMof[i].current_amount); // Use Math.abs to get the absolute (positive) value
    //     labList.push({
    //       label: `${labsMof[i].name} - ${labsMof[i].type} - ${labsMof[i].city}`,
    //       label1: `${labsMof[i].name}`,
    //       value: labsMof[i].id,
    //       // data: { dues: labsMof[i].current_amount }, // Include the 'dues' property in the data field
    //     });
    //   // }
    // }

    const donationlabList = [];
      for (let i = 0; i < labsMof.length; i++) {
        // if ((labsMof[i].office === this.props.corporateProfiles.territory_office) && (labsMof[i].donation_amount > 0)) {
        donationlabList.push({
          label: `${labsMof[i].name} - ${labsMof[i].type} - ${labsMof[i].city}`,
          label1: `${labsMof[i].name}`,
          label2: `${labsMof[i].account_id}`,
          value: labsMof[i].lab_id,
          // data: { dues: labsMof[i].donation_amount }, // Include the 'dues' property in the data field
        });
        // }
      }
      // .filter(
      //   labslist =>
      //     labslist.type == "Main Lab"
      // )
      // .map(labslist => ({
      //   label: `(Lab Name: ${labslist.name}) - (Type: ${labslist.type}) - (City: ${labslist.city})`,
      //   label1: `${labslist.name}`,
      //   label2: `${labslist.account_id}`,
      //   value: labslist.lab_id,
      //   // data: { dues: labslist.dues },
      // }));

    // Assuming you have a state variable to store the selected lab id (this.state.selectedLabId)
    const selectedLab = donationlabList.find(lab => lab.value === this.state.lab_id);

    // const DonationAppointmentList = [];
    // for (let i = 0; i < listDonation.length; i++) {
    //   let flag = 0;
    //   // for (let j = 0; j < outPayments.length; j++) {
    //   //   if (listDonation[i].id == outPayments[j].lab_id) {
    //   //     flag = 1;
    //   //   }
    //   // }
    //   if (!flag) {
    //     DonationAppointmentList.push({
    //       label: listDonation[i].id,
    //       value: listDonation[i].id,
    //     });
    //   }
    // }
    let DonationAppointmentList = listDonation
      .filter(
        donation => {
          const corporationId = String(donation.corporation);
          const profileId = String(this.props.corporateProfiles.id);
      
          // Check conditions
          const isFeesValid = donation.plateform_fees > 0 && donation.plateform_fees !== undefined;
          const isCorporationValid = corporationId === profileId;
          const isPaymentStatusValid = donation.payment_status === "Allocate";
          const hasDues = donation.dues !== undefined;
          const hasValidLabNameOrBranch = donation.lab_name === (selectedLab ? selectedLab.label1 : null) || 
                                           donation.mainbranch === (selectedLab ? selectedLab.label2 : null);
      
      
          // Perform filtering based on all conditions
          return (
            isFeesValid &&
            isCorporationValid &&
            isPaymentStatusValid &&
            donation.corporation != null &&
            hasDues &&
            hasValidLabNameOrBranch
          );
        }
      )
      .map(donation => ({
        label: `(Appointment ID: ${donation.order_id}) - (Amount: ${donation.dues})`,
        value: donation.id,
        data: { dues: donation.dues },
      }));

    // Add "All" option if there are appointments available
    if (DonationAppointmentList.length > 0) {
      DonationAppointmentList.unshift({ label: "All Appointments", value: "all" });
    }

    // Filter out "All Appointments" from the labels
    const labelsToShow = DonationAppointmentList
      .filter(option => option.value !== "all")
      .map(option => option.label);

    // const DonationAppointmentList = [];
    // for (let i = 0; i < listDonation.length; i++) {
    //   if (listDonation[i].status === "Result Uploaded" && listDonation[i].payment_method === "Donation" && listDonation[i].payment_status === "Allocate") {
    //     if (listDonation[i].lab_office === this.props.corporateProfiles.territory_office) {
    //       DonationAppointmentList.push({
    //         label: `${listDonation[i].id} - ${listDonation[i].lab_name} - ${listDonation[i].lab_type} - ${listDonation[i].lab_city}`,
    //         value: `${listDonation[i].id}`,
    //       });
    //     }
    //  }
    // }
    const CardAppointmentList = listDonation
      .filter(
        donation =>{
          const corporationId = String(donation.corporation);
          const profileId = String(this.props.corporateProfiles.id);

          const isFeesValid = donation.plateform_fees > 0 && donation.plateform_fees !== undefined;
          const isCorporationValid = corporationId === profileId;
          return isFeesValid && isCorporationValid;
  }
      )
      .map(donation => ({
        label: `(Appointment ID: ${donation.order_id}) - (Plateform charges: ${donation.plateform_fees})`,
        value: donation.id,
        data: { plateform_fees: donation.plateform_fees }, // Include the 'dues' property in the data field
      }));

    if (CardAppointmentList.length > 0) {
      CardAppointmentList.unshift({ label: "All Appointments", value: "all" });
    }
    // Filter out "All Appointments" from the labels
    const labelsToShow2 = CardAppointmentList
      .filter(option => option.value !== "all")
      .map(option => option.label);

    // const CardAppointmentList = [];
    // for (let i = 0; i < listDonation.length; i++) {
    //   if (listDonation[i].status === "Result Uploaded" && listDonation[i].payment_method === "Card" && listDonation[i].payment_status === "Submit" && listDonation[i].is_settled == false) {
    //     if (listDonation[i].lab_office === this.props.corporateProfiles.territory_office) {
    //       CardAppointmentList.push({
    //         label: `${listDonation[i].id} - ${listDonation[i].lab_name} - ${listDonation[i].lab_type} - ${listDonation[i].lab_city}`,
    //         value: `${listDonation[i].id}`,
    //       });
    //     }
    //  }
    // }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Payment Form | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="Payment Form" />
            <Formik>
              <div className="checkout-tabs">
                {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Make Payment for Lab or Labhazir.
                  </strong>
                </span>
                  <br></br>
                </div>
                <Row>

                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                      <CardBody>
                        <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment To
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_for"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_for: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_for}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Lab">Lab</option>
                              <option value="Labhazir">Labhazir</option>
                            </select>

                          </FormGroup>

                          {this.state.payment_for == "Lab" ? (
                            outPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab nameeeeeeeeeeeeeeee
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.lab_id
                                    }
                                    value={
                                      outPayment.lab_id
                                    }
                                  >
                                    {
                                      outPayment.lab_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">Lab Name</Label>
                                <Select
                                  name="lab_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      lab_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.lab_id
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
                                        .state.lab_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={donationlabList}
                                  placeholder="Select Lab..."
                                />

                                <div className="invalid-feedback">
                                  Please select your Lab
                                </div>
                              </div>)
                          ) : null}
                          {this.state.payment_for == "Labhazir" ? (
                            <div className="mb-3 select2-container">
                              <Label className="fw-bolder">Test Appointments</Label>
                              <Select
                                name="test_appointment_id"
                                component="Select"
                                isMulti={true}
                                onChange={selectedGroup => {
                                  const selectedValues = selectedGroup.map(option => option.value);
                                  if (selectedValues.includes("all")) {
                                    // If "All Appointments" option is selected, select all appointments
                                    const allAppointmentIds = CardAppointmentList
                                      .filter(option => option.value !== "all")
                                      .map(option => option.value);
                                    this.setState({ test_appointment_id: allAppointmentIds });

                                    const selectedData = CardAppointmentList
                                      .filter(option => option.value !== "all")
                                      .map(option => option.data || {});
                                    const totalAmount = selectedData.reduce(
                                      (total, appointment) => total + (parseFloat(appointment.plateform_fees) || 0),
                                      0
                                    );
                                    this.setState({
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false,
                                    });

                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount || '0' });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  } else {
                                    this.setState({ test_appointment_id: selectedValues });

                                    const selectedData = selectedGroup.map(option => option.data || {});
                                    const totalAmount = selectedData.reduce(
                                      (total, appointment) => total + (parseFloat(appointment.plateform_fees) || 0),
                                      0
                                    );
                                    this.setState({
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false,
                                    });

                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount || '0' });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  }
                                }}
                                className={
                                  "defautSelectParent" +
                                  (!this.state.test_appointment_id
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
                                      .state.test_appointment_id
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={CardAppointmentList}
                                placeholder="Select Appointment..."
                              />

                              <div className="invalid-feedback">
                                Please select Appointment
                              </div>
                            </div>
                          ) : null}
                          {this.state.payment_for === "Lab" && (
                            <div className="mb-3 select2-container">
                              <Label className="fw-bolder">Test Appointments</Label>
                              <Select
                                name="test_appointment_id"
                                component="Select"
                                isMulti={true}
                                onChange={selectedGroup => {
                                  const selectedValues = selectedGroup.map(option => option.value);
                                  if (selectedValues.includes("all")) {
                                    // If "All Appointments" option is selected, select all appointments
                                    const allAppointmentIds = DonationAppointmentList
                                      .filter(option => option.value !== "all")
                                      .map(option => option.value);
                                    this.setState({ test_appointment_id: allAppointmentIds });

                                    const selectedData = DonationAppointmentList
                                      .filter(option => option.value !== "all")
                                      .map(option => option.data || {});
                                    const totalAmount = selectedData.reduce(
                                      (total, appointment) => total + (parseFloat(appointment.dues) || 0),
                                      0
                                    );
                                    this.setState({
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false,
                                    });

                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount || '0' });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  } else {
                                    this.setState({ test_appointment_id: selectedValues });

                                    const selectedData = selectedGroup.map(option => option.data || {});
                                    const totalAmount = selectedData.reduce(
                                      (total, appointment) => total + (parseFloat(appointment.dues) || 0),
                                      0
                                    );
                                    this.setState({
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false,
                                    });

                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount || '0' });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  }
                                }}
                                className={
                                  "defautSelectParent" +
                                  (!this.state.test_appointment_id
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
                                      .state.test_appointment_id
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={DonationAppointmentList}
                                placeholder="Select Appointment..."
                              />

                              <div className="invalid-feedback">
                                Please select Appointment
                              </div>
                            </div>
                          )}


                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Amount
                              <span style={{ color: "#f46a6a" }} className="font-size-18">
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              required={true}
                              placeholder="Enter Amount"
                              name="amount"
                              value={Math.abs(this.state.amount)} // Display the absolute (positive) value
                              onChange={e => this.handleAmountChange(e)}
                            />
                            {this.state.amountExceedsLimit && (
                              <span style={{ color: "#f46a6a", fontSize: "14px" }}>
                                Warning: The entered amount cannot exceed the Lab Payable Amount.
                              </span>
                            )}
                          </FormGroup>


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
                              className={`form-control ${this.state.taxInputError ? 'is-invalid' : ''}`}
                              id="taxInput"
                              placeholder="Enter Tax"
                              name="tax"
                              value={this.state.tax}
                              onChange={this.handleTaxChange}
                            />
                            {this.state.taxInputError && (
                              <div className="invalid-feedback">
                                Tax amount cannot exceed the total amount.
                              </div>
                            )}
                          </FormGroup>


                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment Method
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_method"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_method: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_method}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Payment Type
                                ---
                              </option>
                              <option value="Cheque">Cheque</option>
                              <option value="Card">Online</option>

                            </select>
                          </FormGroup>

                          <FormGroup className="mt-4 mb-0">
                            <Label htmlFor="cardnameInput" className="fw-bolder">
                              Cheque/TT #
                              <span
                                style={{ color: "#f46a6a" }}
                              // className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="0000 0000 0000 0000"
                              name="cheque_no"
                              onChange={e =>
                                this.setState({
                                  cheque_no: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment Date
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
                              name="payment_at"
                              type="datetime-local"
                              // min={new Date(
                              //   new Date().toString().split("GMT")[0] +
                              //   " UTC"
                              // )
                              //   .toISOString()
                              //   .slice(0, -8)}
                              className="form-control"
                              onChange={e =>
                                this.setState({
                                  payment_at:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                          <FormGroup className=" mt-4 mb-0">
                            <Label htmlFor="expirydateInput" className="fw-bolder">
                              Payment Copy
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              id="formFile"
                              name="cheque_image"
                              type="file"
                              multiple={false}
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={e => {
                                this.setState({
                                  cheque_image:
                                    e.target.files[0],
                                });
                              }}
                              // className="form-control is-invalid"
                              className={
                                "form-control" +
                                (this.state.cheque_image.length >
                                  0 && !this.state.cheque_image
                                  ? " is-invalid"
                                  : "")
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
                            <Col md="2">
                            </Col>
                            <Col md="4">
                              <div className="text-end">
                                <button
                                  component={Link}
                                  onClick={this.handleProceedClick}
                                  to="/dashboard-financeofficer"
                                  className="btn btn-danger"
                                >
                                  <i className="mdi mdi-truck-fast me-1" /> Created{" "}
                                </button>
                              </div>
                            </Col>
                            <Col md="4">
                              <button
                                to="/dashboard-financeofficer"
                                onClick={this.handleSubmitClicks}
                                className="btn btn-success mb-4"
                              // disabled={this.state.carts.length == 0}
                              >
                                <i className="mdi mdi-truck-fast me-1" />
                                Submit
                              </button>
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
  labsMof: PropTypes.array,
  listDonation: PropTypes.array,
  history: PropTypes.object,
  // units: PropTypes.array,
  outPayments: PropTypes.array,
  className: PropTypes.any,
  onGetLabsc: PropTypes.func,
  onGetListDonationAppointment: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewCorporatePayment: PropTypes.func,
  onGetCorporateProfileforpayment: PropTypes.func,
  corporateProfiles: PropTypes.func,

};

const mapStateToProps = ({ outPayments }) => ({
  outPayments: outPayments.outPayments,
  labsMof: outPayments.labsMof,
  listDonation: outPayments.listDonation,
  corporateProfiles: outPayments.corporateProfiles,

  // units: outPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsc: id => dispatch(getLabsc(id)),
  onGetListDonationAppointment: () => dispatch(getListDonationAppointment()),
  onAddNewCorporatePayment: (outPayment, id) =>
    dispatch(addNewCorporatePayment(outPayment, id)),
  onGetCorporateProfileforpayment: id => dispatch(getCorporateProfileforpayment(id)),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OutPaymentsForm)); 