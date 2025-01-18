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
  getBanks,
  getLabsMof,
  getListDonationAppointment,
  getBankAccounts,
  getB2bClients,
  addNewOutPayment,
  getOutPayment,
  getStaffProfile
} from "store/outpayments/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";
import bankaccounts from "store/bankaccounts/reducer";

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
      payment_for: "",
      lab_id: "",
      test_appointment_id: "",
      b2b_id: "",
      current_amount: "",
      invoice_id: "",
      bankaccount_id: "",
      bank_id: "",
      amount: "",
      tax: "",
      payment_at: "",
      payment_method: "Cheque",
      cheque_no: "",
      deposit_copy: "",
      cleared_at: "",
      is_cleared: "",
      status: "",
      comments: "",
      checkedoutData: "",
      successMessage: "",
      transection_type: "Other",
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
        transection_type: this.state.transection_type,
        lab_id: this.state.lab_id,
        test_appointment_id: this.state.test_appointment_id,
        b2b_id: this.state.b2b_id,
        tax: this.state.tax,
        bankaccount_id: this.state.bankaccount_id,
        amount: this.state.amount,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        is_cleared: this.state.is_cleared,
        status: "Pending Clearance",
        comments: this.state.comments,
      },
    });

    // API call to create a new outPayment record
    const { onAddNewOutPayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewOutPayment(this.state.outPayment, this.state.user_id)
      );
    }, 2000);
    setTimeout(() => {
      this.props.history.push("/payment-out-pending-clearence-status");
    }, 2000)
  };



  handleProceedClick = () => {
    this.setState({
      outPayment: {
        payment_for: this.state.payment_for,
        transection_type: this.state.transection_type,
        lab_id: this.state.lab_id,
        test_appointment_id: this.state.test_appointment_id,
        b2b_id: this.state.b2b_id,
        bank_id: this.state.bank_id,
        bankaccount_id: this.state.bankaccount_id,
        amount: this.state.amount,
        tax: this.state.tax,
        payment_method: this.state.payment_method,
        payment_at: this.state.payment_at,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        is_cleared: this.state.is_cleared,
        status: "Created",
        comments: this.state.comments,
      },
    });

    // API call to get the checkout items
    const { onAddNewOutPayment } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewOutPayment(this.state.outPayment, this.state.user_id)

      );
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 2000);

    setTimeout(() => {
      this.props.history.push("/payment-out-created-status");
      window.location.reload()

    }, 2000)
  };

  componentDidMount() {
    const { staffProfiles, onGetStaffProfile } = this.props;
    onGetStaffProfile(this.state.user_id);
    this.setState({
      staffProfiles
    });
    console.log("state", staffProfiles)

    const { labsMof, onGetlabsMof } = this.props;
    if (labsMof && !labsMof.length) {
      onGetlabsMof();
    }
    this.setState({ labsMof });

    const { listDonation, onGetListDonationAppointment } = this.props;
    if (listDonation && !listDonation.length) {
      onGetListDonationAppointment();
    }
    this.setState({ listDonation });

    const { banks, onGetbanks } = this.props;
    if (banks && !banks.length) {
      onGetbanks();
    }
    this.setState({ banks });

    const { bankAccounts, onGetbankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetbankAccounts();
    }
    this.setState({ bankAccounts });

    const { b2bClients, onGetB2bClients } = this.props;
    if (b2bClients && !b2bClients.length) {
      onGetB2bClients();
    }
    this.setState({ b2bClients });

    const { outPayments, onGetOutPayment } = this.props;
    if (outPayments && !outPayments.length) {
      onGetOutPayment(this.props.match.params.id);
    }
    this.setState({ outPayments });
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
  
  

  render() {
    const { SearchBar } = Search;
    const isDonation = this.state.transection_type === "Donation";
    const { outPayments } = this.props;
    const { labsMof } = this.props;
    const { listDonation } = this.props;
    const { b2bClients } = this.props;
    const { staffProfiles } = this.props;


    // const { units } = this.props;

    const { onAddNewOutPayment, onGetOutPayment, onGetStaffProfile } =
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
    const labList = [];

    for (let i = 0; i < labsMof.length; i++) {
      if (labsMof[i].office === this.props.staffProfiles.territory_office && labsMof[i].current_amount < 0) {
        const formattedAmount = Math.abs(labsMof[i].current_amount); // Use Math.abs to get the absolute (positive) value
        labList.push({
          label: `${labsMof[i].name} - ${labsMof[i].type} - ${labsMof[i].city} - (Total Payable Amount: ${formattedAmount})`,
          label1: `${labsMof[i].name}`,
          value: labsMof[i].id,
          data: { dues: labsMof[i].current_amount }, // Include the 'dues' property in the data field
        });
      }
    }
    
    const donationlabList = [];
    for (let i = 0; i < labsMof.length; i++) {
      if ((labsMof[i].office === this.props.staffProfiles.territory_office) && (labsMof[i].donation_amount > 0)) {
        donationlabList.push({
          label: `${labsMof[i].name} - ${labsMof[i].type} - ${labsMof[i].city} - (Total Payable Amount: ${labsMof[i].donation_amount})`,
          label1: `${labsMof[i].name}`,
          value: labsMof[i].id,
          // data: { dues: labsMof[i].donation_amount }, // Include the 'dues' property in the data field
        });
      }
    }
    
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
    const DonationAppointmentList = listDonation
    .filter(
      donation =>
        donation.payment_method === "Donation" &&
        donation.payment_status === "Allocate" &&
        donation.status === "Result Uploaded" &&
        donation.lab_office === this.props.staffProfiles.territory_office &&
        donation.dues !== undefined &&
        donation.lab_name === (selectedLab ? selectedLab.label1 : null) // Compare with the selected lab's lab_name

    )
    .map(donation => ({
      label: `(Appointment ID: ${donation.order_id}) - (Amount: ${donation.dues})`,
      value: donation.id,
      data: { dues: donation.dues }, // Include the 'dues' property in the data field
    }));

    // const DonationAppointmentList = [];
    // for (let i = 0; i < listDonation.length; i++) {
    //   if (listDonation[i].status === "Result Uploaded" && listDonation[i].payment_method === "Donation" && listDonation[i].payment_status === "Allocate") {
    //     if (listDonation[i].lab_office === this.props.staffProfiles.territory_office) {
    //       DonationAppointmentList.push({
    //         label: `${listDonation[i].id} - ${listDonation[i].lab_name} - ${listDonation[i].lab_type} - ${listDonation[i].lab_city}`,
    //         value: `${listDonation[i].id}`,
    //       });
    //     }
    //  }
    // }
    const CardAppointmentList = listDonation
    .filter(
      donation =>
        donation.payment_method === "Card" &&
        donation.payment_status === "Paid" &&
        donation.status === "Result Uploaded" &&
        donation.is_settled == false &&
        donation.lab_office === this.props.staffProfiles.territory_office &&
        donation.dues !== undefined &&
        donation.lab_name === (selectedLab ? selectedLab.label : null) // Compare with the selected lab's lab_name
    )
    .map(donation => ({
      label: `${donation.id} - ${donation.lab_name} - ${donation.lab_type} - ${donation.lab_city}`,
      value: donation.id,
      data: { dues: donation.dues }, // Include the 'dues' property in the data field
    }));
    // const CardAppointmentList = [];
    // for (let i = 0; i < listDonation.length; i++) {
    //   if (listDonation[i].status === "Result Uploaded" && listDonation[i].payment_method === "Card" && listDonation[i].payment_status === "Paid" && listDonation[i].is_settled == false) {
    //     if (listDonation[i].lab_office === this.props.staffProfiles.territory_office) {
    //       CardAppointmentList.push({
    //         label: `${listDonation[i].id} - ${listDonation[i].lab_name} - ${listDonation[i].lab_type} - ${listDonation[i].lab_city}`,
    //         value: `${listDonation[i].id}`,
    //       });
    //     }
    //  }
    // }

    // const b2bList = [];
    // for (let i = 0; i < b2bClients.length; i++) {
    //   let flag = 0;

    //   // Check if test available in our database is already being offered by lab
    //   // If yes then don't push it in labList
    //   // for (let j = 0; j < outPayments.length; j++) {
    //   //   if (b2bClients[i].id == outPayments[j].b2b_id) {
    //   //     flag = 1;
    //   //   }
    //   // }
    //   if (!flag) {
    //     b2bList.push({
    //       label: `${b2bClients[i].business_name} - ${b2bClients[i].current_amount}`,
    //       value: `${b2bClients[i].id}`,

    //     });

    //   }
    // }
    const b2bList = [];
    for (let i = 0; i < b2bClients.length; i++) {
      if (b2bClients[i].office === this.props.staffProfiles.territory_office) {
        b2bList.push({
          label: `${b2bClients[i].business_name} - ${b2bClients[i].current_amount}`,
          value: `${b2bClients[i].id}`,
        });
      }
    }

    // const { bankAccounts } = this.props;
    // const bankaccountList = [];
    // for (let i = 0; i < bankAccounts.length; i++) {
    //   let flag = 0;
    //   if (!flag) {
    //     bankaccountList.push(
    //       {
    //         label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no} - ${bankAccounts[i].account_type}`,
    //         value: `${bankAccounts[i].id}`,
    //       }
    //     );
    //   }
    // }
    const { bankAccounts } = this.props;
    // const bankaccountList = [];

    const bankaccountList = bankAccounts
    .filter(bankaccount => {
      if (isDonation) {
        return bankaccount.current_balance > Math.abs(this.state.amount) && bankaccount.account_type === "DONATION";
      } else {
        return bankaccount.current_balance > Math.abs(this.state.amount) && bankaccount.account_type !== "DONATION";
      }
    })
    .map(bankaccount => ({
      label: `(Bank Name: ${bankaccount.bank_name}) - (Account No: ${bankaccount.account_no}) - (Account Type: ${bankaccount.account_type}) - (Current Balance: ${bankaccount.current_balance})`,
      value: bankaccount.id,
    }));
  

    const { banks } = this.props;
    const bankList = [];
    for (let i = 0; i < banks.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankList.push({
          label: banks[i].name,
          value: banks[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>OutPayment | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="OutPayment" />
            <Formik>
              <div className="checkout-tabs">
                {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <div> <span className="text-danger font-size-12">
                    <strong>
                      Note: There will be that Labs, Donors and B2b Clients whose terriotory will match this staff.
                    </strong>
                  </span>
                  <br></br>

                  <strong>
                  <span className="text-danger font-size-12">1:</span> If Payment to <span className="text-primary">Lab</span> and Transection type is <span className="text-primary">Other</span>, the List of Lab only show Lab Name having Payable amount as per Lab Account statement.
                  <br></br>
                  <span className="text-danger font-size-12">2:</span> If Payment to <span className="text-primary">Lab</span> and Transection type is <span className="text-primary">Donation</span>, the List of Lab only show Lab Name having Apppoitments with status Donation Allocate and Result Uploaded.
                  <br></br>
                  <span className="text-danger font-size-12">3:</span> Only the <span className="text-primary">Bank Accounts List</span> having <span className="text-primary">Balance</span>, greater then to or Equal to <span className="text-primary">Payable</span> Amount.
                  <br></br>
                    </strong>
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
                              <option value="B2BClient">B2b</option>
                            </select>

                          </FormGroup>

                          {this.state.payment_for == "Lab" ? (
                            <FormGroup className="mb-0">
                              <Label htmlFor="cardnumberInput" className="fw-bolder">
                                What type of Transection?
                                <span
                                  style={{ color: "#f46a6a" }}
                                  className="font-size-18"
                                >
                                  *
                                </span>
                              </Label>
                              <select
                                name="transection_type"
                                component="select"
                                onChange={e =>
                                  this.setState({
                                    transection_type: e.target.value,
                                  })
                                }
                                defaultValue={this.state.transection_type}
                                className="form-select"
                              >
                                <option value="Other">Routine</option>
                                <option value="Donation">Donation</option>
                              </select>

                            </FormGroup>
                          ) : null}

                          {this.state.payment_for == "Lab" && this.state.transection_type == "Other" ? (
                            outPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
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
                                  onChange={selectedOption => {
                                    const selectedValue = selectedOption ? selectedOption.value : null;
                                    const selectedData = selectedOption ? selectedOption.data || {} : {};
                                    const totalAmount = parseFloat(selectedData.dues) || 0;
                                  
                                    this.setState({
                                      lab_id: selectedValue,
                                      selectedOption,
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false, // Reset the flag when a new lab is selected
                                    });
                                  
                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount.toString() });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
                                  }}
                                  
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
                                  options={labList}
                                  placeholder="Select Lab..."
                                />

                                <div className="invalid-feedback">
                                  Please select your Lab
                                </div>
                              </div>)
                          ) : null}
                           {this.state.payment_for == "Lab" && this.state.transection_type == "Donation" ? (
                            outPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
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

                          {this.state.transection_type == "Donation" && this.state.payment_for == "Lab" ? (
                            outPayment.test_appointment_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Test Appointments
                                </Label>
                                <Field
                                  name="test_appointment_id"
                                  as="select"
                                  defaultValue={outPayment.test_appointment_id}
                                  className="form-control"
                                  readOnly={true}
                                  multiple={true} // Set to true to allow multiple selections
                                >
                                  {/* Render options for each selected test_appointment_id */}
                                  {outPayment.test_appointment_id.map(value => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">Test Appointments</Label>
                                <Select
                                  name="test_appointment_id"
                                  component="Select"
                                  isMulti={true} // Uncomment this line
                                  onChange={selectedGroup => {
                                    this.setState({
                                      test_appointment_id: selectedGroup.map(option => option.value),
                                    });
                                    
                                
                                    const selectedData = selectedGroup.map(option => option.data || {});
                                    const totalAmount = selectedData.reduce(
                                      (total, appointment) => total + (parseFloat(appointment.dues) || 0),
                                      0
                                    );
                                    this.setState({
                                      selectedAmount: totalAmount,
                                      amountExceedsLimit: false, // Reset the flag when a new lab is selected
                                    });
                                
                                    // Auto-set the amount field
                                    this.setState({ amount: totalAmount || '0' });
                                    console.log("amount arahi h yah nahi", selectedData, totalAmount);
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
                              </div>)
                          ) : null}

                          {this.state.payment_for == "B2BClient" ? (
                            outPayment.b2b_id ? (
                              <div className="mb-3">
                                <Label className="form-label" >
                                  B2BClient name
                                </Label>
                                <Field
                                  name="b2b_id"
                                  as="select"
                                  defaultValue={
                                    outPayment.b2b_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      outPayment.b2b_id
                                    }
                                    value={
                                      outPayment.b2b_id
                                    }
                                  >
                                    {
                                      outPayment.business_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">B2BClient Name</Label>
                                <Select
                                  name="b2b_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      b2b_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.b2b_id
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
                                        .state.b2b_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={b2bList}
                                  placeholder="Select B2b..."
                                />

                                <div className="invalid-feedback">
                                  Please select B2BClient
                                </div>
                              </div>
                            )

                          ) : null}

                          {/* {this.state.b2b_id ? (
                            <div className="mb-3">
                              <Label className="form-label">B2BClient name</Label>
                              <Field
                                name="b2b_id"
                                as="select"
                                onChange={selectedGroup => {
                                  const selectedB2B = b2bList.find(b2b_id => b2b_id.value === selectedGroup.value);
                                  this.setState({
                                    b2b_id: selectedGroup.value,
                                    current_amount: selectedB2B.current_amount,
                                  });
                                }}
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option key={this.state.b2b_id} value={this.state.b2b_id}>
                                  {this.state.b2b_id}
                                </option>
                              </Field>
                            </div>
                          ) : null} */}


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
  Tax Deductive by LabHazir
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
    placeholder="Enter Tax"
    name="tax"
    value={this.state.tax}
    onChange={e =>
      this.setState({
        tax: e.target.value,
      })
    }
  />
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
                              Payment at
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
                              min={new Date(
                                new Date().toString().split("GMT")[0] +
                                " UTC"
                              )
                                .toISOString()
                                .slice(0, -8)}
                              className="form-control"
                              onChange={e =>
                                this.setState({
                                  payment_at:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          {/* {outPayment.bank_id &&
                            outPayment.bank_id ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Name</Label>

                              <Field
                                name="bank_id"
                                as="select"
                                defaultValue={
                                  outPayment.bank_id
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    outPayment.bank_id
                                  }
                                  value={
                                    outPayment.bank_id
                                  }
                                >
                                  {
                                    outPayment.bank_name
                                  }
                                </option>
                              </Field>
                            </div>
                          ) : (
                            <div className="mb-3 select2-container">
                              <Label
                                className="col-form-label"
                              >
                                Bank Name</Label>

                              <Select
                                name="bank_id"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    bank_id:
                                      selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bank_id
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
                                      .state.bank_id
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={bankList}
                                placeholder="Select Bank..."
                              />
                              <div className="invalid-feedback">
                                Please select your Bank
                              </div>
                            </div>
                          )} */}

                          {isDonation ? (
                            <>
                              <Label className="col-form-label">Bank Name</Label>
                              <Select
                                name="bankaccount_id"
                                component="Select"
                                onChange={(selectedGroup) =>
                                  this.setState({
                                    bankaccount_id: selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bankaccount_id ? " is-invalid" : "")
                                }
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderColor: !this.state.bankaccount_id ? "#f46a6a" : "#ced4da",
                                  }),
                                }}
                                options={bankaccountList}
                                placeholder="Select Bank Account..."
                              />
                            </>
                          ) : (
                            <>
                              <Label
                                className="col-form-label"
                              >
                                Bank Name</Label>
                              <Select
                                name="bankaccount_id"
                                component="Select"
                                onChange={(selectedGroup) =>
                                  this.setState({
                                    bankaccount_id: selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bankaccount_id ? " is-invalid" : "")
                                }
                                styles={{
                                  control: (base, state) => ({
                                    ...base,
                                    borderColor: !this.state.bankaccount_id ? "#f46a6a" : "#ced4da",
                                  }),
                                }}
                                options={bankaccountList}
                                placeholder="Select Bank Account..."
                              /></>
                          )}

                          {!isDonation && (
                            <div className="invalid-feedback">Please select your Bank Account</div>
                          )}


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
                              name="deposit_copy"
                              type="file"
                              multiple={false}
                              accept=".jpg,.jpeg,.png,.pdf"
                              onChange={e => {
                                this.setState({
                                  deposit_copy:
                                    e.target.files[0],
                                });
                              }}
                              // className="form-control is-invalid"
                              className={
                                "form-control" +
                                (this.state.deposit_copy.length >
                                  0 && !this.state.deposit_copy
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </FormGroup>



                          {/* <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Is Cleared
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="is_cleared"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  is_cleared: e.target.value,
                                })
                              }
                              defaultValue={this.state.is_cleared}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Yes">Yes</option>
                              <option value="No">No</option>

                            </select>
                          </FormGroup> */}

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
                              <div className="text-end">
                                <button
                                  component={Link}
                                  onClick={this.handleProceedClick}
                                  to="/dashboard-financeofficer"
                                  className="btn btn-success mb-4"
                                >
                                  <i className="mdi mdi-truck-fast me-1" /> Created{" "}
                                </button>
                              </div>
                            </Col>
                            <Col sm="6">
                              <button
                                to="/dashboard-financeofficer"
                                className="btn btn-danger"
                                onClick={this.handleSubmitClicks}
                              // disabled={this.state.carts.length == 0}
                              >
                                <i className="mdi mdi-truck-fast me-1" />
                                Pending Clearance
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
  banks: PropTypes.array,
  bankAccounts: PropTypes.array,
  history: PropTypes.object,
  b2bClients: PropTypes.array,
  // units: PropTypes.array,
  outPayments: PropTypes.array,
  className: PropTypes.any,
  onGetlabsMof: PropTypes.func,
  onGetListDonationAppointment: PropTypes.func,
  onGetB2bClients: PropTypes.func,
  onGetOutPayment: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewOutPayment: PropTypes.func,
  onGetbanks: PropTypes.func,
  onGetbankAccounts: PropTypes.func,
  onGetStaffProfile: PropTypes.func,
  staffProfiles: PropTypes.func,

};

const mapStateToProps = ({ outPayments }) => ({
  outPayments: outPayments.outPayments,
  labsMof: outPayments.labsMof,
  listDonation: outPayments.listDonation,
  b2bClients: outPayments.b2bClients,
  banks: outPayments.banks,
  bankAccounts: outPayments.bankAccounts,
  staffProfiles: outPayments.staffProfiles,


  // units: outPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetbanks: () => dispatch(getBanks()),
  onGetbankAccounts: () => dispatch(getBankAccounts()),
  onGetlabsMof: () => dispatch(getLabsMof()),
  onGetListDonationAppointment: () => dispatch(getListDonationAppointment()),
  onGetB2bClients: () => dispatch(getB2bClients()),
  onGetOutPayment: id => dispatch(getOutPayment(id)),
  onAddNewOutPayment: (outPayment, id) =>
    dispatch(addNewOutPayment(outPayment, id)),
  onGetStaffProfile: id => dispatch(getStaffProfile(id)),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OutPaymentsForm)); 
