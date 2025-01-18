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
  getAcceptedLabAdvertisements,
  getLabs,
  getDonors,
  getLabsc,
  addNewInPayment,
  getInPayment,
  getStaffProfile
} from "store/inpayments/actions";
import {
  getListDonationAppointment,
  getListCLabs
} from "store/outpayments/actions";


import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class InPaymentsForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      inPayments: [],
      staffProfiles: [],
      inPayment: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      payment_for: "",
      lab_id: "",
      tax: "",
      donor_id: "",
      advertisement_id: "",
      recieved_by: "",
      handover_to: "",
      amount: "",
      paid_at: "",
      cheque_payment_date: "",

      // deposit_bank: "",
      payment_method: "Cash",
      // card_number: "",
      cheque_no: "",
      refered_no: "",
      cheque_image: "",
      test_appointment_id: "",
      // invoice_id: "",
      // cleared_at: "",
      // verified_by: "",
      payment_status: "",
      // isDisabled: true,
      // isRequiredFilled: true,
      checkedoutData: "",
    };
    // this.toggleTab = this.toggleTab.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
    // console.log("finance officer office", this.props.staffProfiles.territory_office);

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

  handleProceedClick = () => {
    this.setState({
      inPayment: {
        payment_for: this.state.payment_for,
        lab_id: this.state.lab_id,
        test_appointment_id: this.state.test_appointment_id,
        donor_id: this.state.donor_id,
        advertisement_id: this.state.advertisement_id,
        amount: this.state.amount,
        tax: this.state.tax,
        payment_method: this.state.payment_method,
        recieved_by: this.state.recieved_by,
        handover_to: this.state.handover_to,
        paid_at: this.state.paid_at,
        // invoice_id: this.state.invoice_id,
        cheque_payment_date: this.state.cheque_payment_date,
        cheque_no: this.state.cheque_no,
        cheque_image: this.state.cheque_image,
        refered_no: this.state.refered_no,
        payment_status: "Created",
      },
    });

    // API call to get the checkout items
    const { onAddInPaymentData } = this.props;
    setTimeout(() => {
      console.log(
        onAddInPaymentData(this.state.inPayment, this.state.user_id)
      );
      // window.location.reload()
    }, 2000);
    setTimeout(() => {
      this.props.history.push("/payment-status");
      window.location.reload()
  }, 2000)
  };

  componentDidMount() {

    const { staffProfiles, onGetStaffProfile } = this.props;
    onGetStaffProfile(this.state.user_id);
    this.setState({ 
      staffProfiles
    });
    console.log("state",staffProfiles)
    
    const { listDonation, onGetListDonationAppointment } = this.props;
    if (listDonation && !listDonation.length) {
      onGetListDonationAppointment();
    }
    this.setState({ listDonation });

    const { listCLabs, onGetListCLabs } = this.props;
    if (listCLabs && !listCLabs.length) {
      onGetListCLabs();
    }
    this.setState({ listCLabs });

    const { labs, onGetlabs } = this.props;
    if (labs && !labs.length) {
      onGetlabs();
    }
    this.setState({ labs });

    const { advertisements, onGetAcceptedLabAdvertisements } = this.props;
    if (advertisements && !advertisements.length) {
      onGetAcceptedLabAdvertisements(this.props.match.params.id);
    }
    this.setState({ advertisements });

    const { donors, onGetdonors } = this.props;
    if (donors && !donors.length) {
      onGetdonors();
    }
    this.setState({ donors });

    const { inPayments, onGetInPayment } = this.props;
    if (inPayments && !inPayments.length) {
      onGetInPayment(this.props.match.params.id);
    }
    this.setState({ inPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ inPayment: selectedGroup.value });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { inPayments } = this.props;
    if (
      !isEmpty(inPayments) &&
      size(prevProps.inPayments) !== size(inPayments)
    ) {
      this.setState({ inPayments: {}, isEdit: false });
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
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
    });
  };
  calculateTotalAmount = selectedTestAppointments => {
    const totalAmount = selectedTestAppointments.reduce(
      (total, appointment) => total + (parseFloat(appointment.dues) || 0),
      0
    );
    return totalAmount;
  };

  render() {
    const { SearchBar } = Search;

    const { inPayments } = this.props;
    const { labs } = this.props;
    const { advertisements } = this.props;
    const { listDonation, listCLabs } = this.props;
    const {staffProfiles} = this.props;
    const { donors } = this.props;

    // const { units } = this.props;

    const { onAddInPaymentData, onGetInPayment, onGetStaffProfile } =
      this.props;
    const inPayment = this.state.inPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: inPayments.length, // replace later with size(inPayments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      if (console.log( "dfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdfdf", labs[i].office )=== console.log("fdfdfdfdfdfdfdfdf", this.props.staffProfiles.territory_office)) {
        
        labList.push({
          label: `${labs[i].name} - ${labs[i].type} - ${labs[i].city}`,
          label1: `${labs[i].name}`,
          value: labs[i].id,
        });
      }
    }

    const listCorporateLabs = []
    for (let i = 0; i < listCLabs.length; i++) {
      if (listCLabs[i].office === this.props.staffProfiles.territory_office) {
        listCorporateLabs.push({
          label: `${listCLabs[i].name} - ${listCLabs[i].corporate_name} - ${listCLabs[i].status}`,
          label1: `${listCLabs[i].name}`,
          label2: `${listCLabs[i].account_id}`,
          value: listCLabs[i].lab_id,
        });
      }
    }
    
    // Assuming you have a state variable to store the selected lab id (this.state.selectedLabId)
    const selectedLab = labList.find(lab => lab.value === this.state.lab_id);
    
    // const CashAppointmentList = listDonation
    //   .filter(
    //     donation =>
    //       donation.payment_method === "Cash" &&
    //       donation.payment_status === "Paid" &&
    //       donation.is_settled === false &&
    //       donation.lab_office === this.props.staffProfiles.territory_office &&
    //       donation.dues !== undefined &&
    //       donation.lab_name === (selectedLab ? selectedLab.label1 : null) // Compare with the selected lab's lab_name
    //   )
    //   .map(donation => ({
    //     label: `(Appointment ID: ${donation.id}) - (Amount: ${donation.dues})`,
    //     value: donation.id,
    //     data: { dues: donation.dues },
    //   }));

    const corporatelabsList = listDonation
      .filter(
        donation =>
          // donation.payment_method === "Donation" &&
          donation.refrell_fees > 0 &&
          donation.corporation != null &&
          donation.refrell_fees !== undefined &&
          donation.lab_name === (selectedLab ? selectedLab.label1 : null) || donation.mainbranch === (selectedLab ? selectedLab.label2 : null)

      )
      .map(donation => ({
        label: `(Appointment ID: ${donation.order_id}) - (Amount: ${donation.refrell_fees})`,
        value: donation.id,
        data: { refrell_fees: donation.refrell_fees }, // Include the 'dues' property in the data field
      }));
    
    const advertisementList = [];
    for (let i = 0; i < advertisements.length; i++) {
      if (advertisements[i].lab_office === this.props.staffProfiles.territory_office && advertisements[i].payment_status != "Cleared") {
        advertisementList.push({
          label: `${advertisements[i].id} - (Lab: ${advertisements[i].lab_name}) - (Price: ${advertisements[i].amount})`,
          value: `${advertisements[i].id}`,
          data: {dues: `${advertisements[i].amount}`}  
        });
      }
    }
    
    const donorList = [];
    for (let i = 0; i < donors.length; i++) {
      if (donors[i].office === this.props.staffProfiles.territory_office) {
        donorList.push({
          label: donors[i].name,
          value: donors[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>InPayment | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="InPayment" />
            <Formik>
              <div className="checkout-tabs">
                <Row>
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be that Labs, Donors and B2b Clients whose terriotory will match this staff.
                  </strong>
                  </span>
                  <br></br>
                </div>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card >
                      <CardBody >
                        <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment From
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
                              <option value="Corporate Lab">Corporate Lab</option>
                              <option value="Donor">Donor</option>
                              <option value="Advertisement">Lab-Advertisement</option>
                            </select>

                          </FormGroup>
                          {this.state.payment_for == "Corporate Lab" ? (
                            inPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.lab_id
                                    }
                                    value={
                                      inPayment.lab_id
                                    }
                                  >
                                    {
                                      inPayment.lab_name
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
                                  options={listCorporateLabs}
                                  placeholder="Select Lab..."
                                />

                                <div className="invalid-feedback">
                                  Please select your Lab
                                </div>
                              </div>)
                          ) : null}
                          {this.state.payment_for == "Corporate Lab"  ? (
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
                                   (total, appointment) => total + (parseFloat(appointment.refrell_fees) || 0),
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
                               options={corporatelabsList}
                               placeholder="Select Appointment..."
                             />
 
                             <div className="invalid-feedback">
                               Please select Appointment
                             </div>
                           </div>
                          ) : null}
                          {this.state.payment_for == "Lab" ? (
                            inPayment.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.lab_id
                                    }
                                    value={
                                      inPayment.lab_id
                                    }
                                  >
                                    {
                                      inPayment.lab_name
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
                                  options={labList}
                                  placeholder="Select Lab..."
                                />

                                <div className="invalid-feedback">
                                  Please select your Lab
                                </div>
                              </div>)
                          ) : null}
                          {this.state.payment_for == "Donor" ? (
                            inPayment.donor_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Donor name
                                </Label>
                                <Field
                                  name="donor_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.donor_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.donor_id
                                    }
                                    value={
                                      inPayment.donor_id
                                    }
                                  >
                                    {
                                      inPayment.donor_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">Donor Name</Label>
                                <Select
                                  name="donor_id"
                                  component="Select"
                                  onChange={selectedGroup =>
                                    this.setState({
                                      donor_id:
                                        selectedGroup.value,
                                    })
                                  }
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.donor_id
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
                                        .state.donor_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={donorList}
                                  placeholder="Select Donor..."
                                />

                                <div className="invalid-feedback">
                                  Please select Donor
                                </div>
                              </div>
                            )

                          ) : null}
                          
                           {this.state.payment_for == "Advertisement" ? (
                            inPayment.advertisement_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Advertisement Title
                                </Label>
                                <Field
                                  name="advertisement_id"
                                  as="select"
                                  defaultValue={
                                    inPayment.advertisement_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      inPayment.advertisement_id
                                    }
                                    value={
                                      inPayment.advertisement_id
                                    }
                                  >
                                    {
                                      inPayment.advertisement_title
                                    }
                                  </option>
                                </Field>
                              </div>
                              
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label className="fw-bolder">Advertisement Title</Label>
                                <Select
                                  name="advertisement_id"
                                  component="Select"
                                  onChange={selectedGroup => {
                                    const selectedData = selectedGroup.data || {};
                                    const totalAmount = parseFloat(selectedData.dues) || 0;
                                  
                                    this.setState({
                                      advertisement_id: selectedGroup.value,
                                      amount: totalAmount || '0'
                                    });
                                  }}
                                  
                                  
                                  className={
                                    "defautSelectParent" +
                                    (!this.state.advertisement_id
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
                                        .state.advertisement_id
                                        ? "#f46a6a"
                                        : "#ced4da",
                                    }),
                                  }}
                                  options={advertisementList}
                                  placeholder="Select Advertisements..."
                                />

                                <div className="invalid-feedback">
                                  Please select Advertisement
                                </div>
                              </div>
                            )

                            
                          ) : null}
<FormGroup className="mb-0">
  <Label htmlFor="cardnumberInput" className="fw-bolder">
    Amount
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
    required={true}
    placeholder="Amount.."
    name="amount"
    value={this.state.amount}
    onChange={e =>
      this.setState({
        amount: e.target.value,
      })
    }
  />
</FormGroup>
{this.state.payment_for == "Advertisement" || this.state.payment_for == "Lab" ? (
<FormGroup className="mb-0">
  <Label htmlFor="cardnumberInput" className="fw-bolder">
    Tax Deductive by Lab
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
</FormGroup>) : null}
                          <div>
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment Method
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cash"
                                  defaultChecked
                                  name="payment_method"
                                  id="customRadioInline1"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline1"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top " style={{color:"green"}} />{" "}
                                  Cash
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Cheque"
                                  name="payment_method"
                                  id="customRadioInline2"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline2"
                                >
                                  <i className="far fa-money-bill-alt me-1 font-size-20 align-top" style={{color:"blue"}}  />{" "}
                                  Cheque
                                </Label>
                              </div>
                              <div className="form-check form-check-inline font-size-16">
                                <Input
                                  type="radio"
                                  value="Card"
                                  id="customRadioInline3"
                                  name="payment_method"
                                  className="form-check-input"
                                  onChange={e =>
                                    this.setState({
                                      payment_method: e.target.value,
                                    })
                                  }
                                />
                                <Label
                                  className="form-check-label font-size-13"
                                  htmlFor="customRadioInline3"
                                >
                                  <i className="bx bx-transfer-alt me-1 align-top" style={{color:"green", fontSize:"30px", marginTop:"-4px"}}  />{" "}
                                  Online
                                </Label>
                              </div>
                            </div>

                            {this.state.payment_method == "Cash" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15 text-danger fw-bolder">
                                  For Cash Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput" className="fw-bolder">
                                        Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                     <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Recieved By
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
                              placeholder="Enter Your Name"
                              name="recieved_by"
                              onChange={e =>
                                this.setState({
                                  recieved_by: e.target.value,
                                })
                              }
                            />
                                     </FormGroup>

                                     <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Handover To
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
                              placeholder="Enter Your Name"
                              name="handover_to"
                              onChange={e =>
                                this.setState({
                                  handover_to: e.target.value,
                                })
                              }
                            />
                                     </FormGroup>

                                  </Form>
                                </div>
                              </div>
                            ) : null}

                            {this.state.payment_method == "Cheque" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15 text-danger fw-bolder">
                                  For Cheque Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput" className="fw-bolder">
                                      Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                    
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput" className="fw-bolder">
                                       Cheque Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="cheque_payment_date"
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
                                            cheque_payment_date:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>

                                    <Row>
                                      <Col lg="6">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cardnameInput" className="fw-bolder">
                                            Cheque #
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
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className=" mt-4 mb-0">
                                          <Label htmlFor="expirydateInput" className="fw-bolder">
                                            Cheque Image
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
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </div>
                            ) : null}

                            {this.state.payment_method == "Card" ? (
                              <div>
                                <h5 className="mt-5 mb-3 font-size-15 text-danger fw-bolder">
                                  For Online Payment
                                </h5>
                                <div className="p-4 border">
                                  <Form>
                                    <FormGroup className="mb-0">
                                      <Label htmlFor="cardnumberInput" className="fw-bolder">
                                      Payment Recieved Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="paid_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        className="form-control"
                                        onChange={e =>
                                          this.setState({
                                            paid_at:
                                              e.target.value,
                                          })
                                        }
                                      />
                                    </FormGroup>
                                    <Row>
                                      <Col lg="6">
                                        <FormGroup className="mt-4 mb-0">
                                          <Label htmlFor="cardnameInput" className="fw-bolder">
                                            Online Ref #
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
                                            placeholder="00000000000000"
                                            name="refered_no"
                                            onChange={e =>
                                              this.setState({
                                                refered_no: e.target.value,
                                              })
                                            }
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col lg="3">
                                        <FormGroup className=" mt-4 mb-0">
                                          <Label htmlFor="expirydateInput" className="fw-bolder">
                                            Ref Copy
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
                                      </Col>
                                    </Row>
                                  </Form>
                                </div>
                              </div>
                            ) : null}

                          </div>
                          {/* <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              payment_status
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="payment_status"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  payment_status: e.target.value,
                                })
                              }
                              defaultValue={this.state.payment_status}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Type
                                ---
                              </option>
                              <option value="Created">Created</option>
                              <option value="Deposited">Deposited</option>
                              <option value="Cleared">Cleared</option>

                            </select>
                          </FormGroup> */}

                        </div>
                        <Row className="mt-4">
                            <Col sm="6">
                              
                            </Col>
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
                          </Row>

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

InPaymentsForm.propTypes = {
  match: PropTypes.object,
  labs: PropTypes.array,
  donors: PropTypes.array,
  advertisements: PropTypes.array,
  // units: PropTypes.array,
  inPayments: PropTypes.array,
  className: PropTypes.any,
  onGetlabs: PropTypes.func,
  onGetdonors: PropTypes.func,
  history: PropTypes.object,
  onGetInPayment: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddInPaymentData: PropTypes.func,
  onGetAcceptedLabAdvertisements: PropTypes.func,
  onGetStaffProfile: PropTypes.func,
  staffProfiles: PropTypes.func,
  onGetListDonationAppointment: PropTypes.func,
  listDonation: PropTypes.array,
  onGetListCLabs: PropTypes.func,
  listCLabs: PropTypes.array,

};

const mapStateToProps = ({ inPayments, outPayments }) => ({
  inPayments: inPayments.inPayments,
  labs: inPayments.labs,
  donors: inPayments.donors,
  advertisements: inPayments.advertisements,
  staffProfiles: inPayments.staffProfiles,
  listDonation: outPayments.listDonation,
  listCLabs: outPayments.listCLabs,


  // units: inPayments.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  
  onGetlabs: () => dispatch(getLabs()),
  onGetAcceptedLabAdvertisements: () => dispatch(getAcceptedLabAdvertisements()),
  onGetdonors: () => dispatch(getDonors()),
  onGetInPayment: id => dispatch(getInPayment(id)),
  onGetListDonationAppointment: () => dispatch(getListDonationAppointment()),
  onGetListCLabs: () => dispatch(getListCLabs()),
  onAddInPaymentData: (inPayment, id) =>
    dispatch(addNewInPayment(inPayment, id)),
  onGetStaffProfile: id => dispatch(getStaffProfile(id)),


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InPaymentsForm)); 
