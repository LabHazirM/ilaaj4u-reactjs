import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  FormGroup,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getLabs,
  getDonors,
  getBouncedInStatuss,
  updatePaymentStatus,
} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentBouncedInStatuss: [],
      paymentBouncedInStatus: "",
      modal: false,
      payment_status: "Created",
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.handlePaymentStatusClick =
      this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePaymentStatusClicks =
      this.handlePaymentStatusClicks.bind(this);
  }
  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );

  // The code for converting "Base64" to javascript "File Object"
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

  componentDidMount() {

    const { labs, onGetlabs } = this.props;
    if (labs && !labs.length) {
      onGetlabs();
    }
    this.setState({ labs });

    const { donors, onGetdonors } = this.props;
    if (donors && !donors.length) {
      onGetdonors();
    }
    this.setState({ donors });


    const { paymentBouncedInStatuss, onGetBouncedInStatuss } = this.props;
    onGetBouncedInStatuss(this.state.user_id);
    this.setState({ paymentBouncedInStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      paymentBouncedInStatus: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { paymentBouncedInStatuss } = this.props;
    if (
      !isEmpty(paymentBouncedInStatuss) &&
      size(prevProps.paymentBouncedInStatuss) !== size(paymentBouncedInStatuss)
    ) {
      this.setState({ paymentBouncedInStatuss: {}, isEdit: false });
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


  handlePaymentStatusClick = (e, arg) => {
    const paymentBouncedInStatus = arg;
    this.setState({
      paymentBouncedInStatus: {
        id: paymentBouncedInStatus.id,
        cheque_image: process.env.REACT_APP_BACKENDURL + paymentBouncedInStatus.cheque_image,
        payment_for: paymentBouncedInStatus.payment_for,
        lab_id: paymentBouncedInStatus.lab_id,
        donor_id: paymentBouncedInStatus.donor_id,
        recieved_by: paymentBouncedInStatus.recieved_by,
        handover_to: paymentBouncedInStatus.handover_to,
        amount: paymentBouncedInStatus.amount,
        paid_at: paymentBouncedInStatus.paid_at,
        payment_method: paymentBouncedInStatus.payment_method,
        cheque_no: paymentBouncedInStatus.cheque_no,
        refered_no: paymentBouncedInStatus.refered_no,
        cheque_image: paymentBouncedInStatus.cheque_image,
        payment_status: "Created",
      },
      isEdit: true,
    });

    this.toggle();
  };

  handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    // Perform navigation based on the selected value
    if (selectedValue === 'Created') {
      this.props.history.push('/payment-status');
    }
    if (selectedValue === 'Pending Clearence') {
      this.props.history.push('/payment-in-pending-clearence-status');
    }
    if (selectedValue === 'Cleared') {
      this.props.history.push('/clear-status');
    }
    if (selectedValue === 'Bounced') {
      this.props.history.push('/bounced-status');
    }
  }

  render() {
  const columns= [
      {
        text: "id",
        dataField: "id",
        sort: true,
        hidden: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>{paymentBouncedInStatus.id}</>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        text: "MIF ID",
        dataField: "id",
        sort: true,
        hidden: false,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>{paymentBouncedInStatus.id}</>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "invoice_id",
        text: "invoice ID",
        sort: true,
        hidden: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <strong>{paymentBouncedInStatus.invoice_id}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      // {
      //   dataField: "payment_for",
      //   text: "Payment From",
      //   sort: true,
      //   formatter: (cellContent, paymentBouncedInStatus) => (
      //     <>
      //       <strong>{paymentBouncedInStatus.payment_for}</strong>
      //     </>
      //   ), filter: textFilter(),
      // },
      {
        dataField: "lab_name",
        text: "Client Name",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <span>
              <span>
                {paymentBouncedInStatus.lab_name}{" "}
                {paymentBouncedInStatus.donor_name}
                {paymentBouncedInStatus.advertisement_title}
              </span>
            </span>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_method",
        text: "Payment Method",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <strong>{paymentBouncedInStatus.payment_method}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "cheque_no",
        text: "Cheque/Ref#",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            {paymentBouncedInStatus.deposit_slip && paymentBouncedInStatus.cheque_no
              ? <span><Link
              to={{
                pathname:
                    process.env.REACT_APP_BACKENDURL + paymentBouncedInStatus.cheque_image,
            }}
                target="_blank"
              >
                {paymentBouncedInStatus.cheque_no && (
                  <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {paymentBouncedInStatus.cheque_no}
                  </span>
                )}
              </Link></span>
              : paymentBouncedInStatus.deposit_slip && paymentBouncedInStatus.refered_no
                ? <span><Link
                to={{
                  pathname:
                      process.env.REACT_APP_BACKENDURL + paymentBouncedInStatus.cheque_image,
              }}
                  target="_blank"
                >
                  {paymentBouncedInStatus.refered_no && (
                    <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                      {paymentBouncedInStatus.refered_no}
                    </span>
                  )}
                </Link></span>
                : <span>--</span>
            }
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "amount",
        text: "Amount",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <div className="text-end">
              <strong>{paymentBouncedInStatus.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
      {
        dataField: "bank",
        text: "Bank/Account#",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <span>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentBouncedInStatus.deposit_slip,
                }}
                target="_blank"
              >
                <span>
                  {paymentBouncedInStatus.bank_name},{" "}
                  {paymentBouncedInStatus.account_no}
                </span>
              </Link>

            </span>

          </>
        ),
        filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "verified_by",
        text: "Deposited By",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => (
          <>
            <strong>{paymentBouncedInStatus.verified_by}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },

      {
        dataField: "deposited_at",
        text: "Deposited Date",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => {
          // const date = new Date(paymentBouncedInStatus.deposited_at);
          // const day = date.getDate();
          // const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          // const month = monthNames[date.getMonth()];
          // const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year

          return (
            <p className="text-muted mb-0">
                {moment(paymentBouncedInStatus.deposited_at).format("DD MMM YYYY, h:mm A")}
            </p>
          );
        },
        filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
     
     
      // {
      //   dataField: "is_settled",
      //   text: "Is Settled",
      //   sort: true,
      // },
     
      {
        dataField: "cleared_at",
        text: "Bounced Date",
        sort: true,
        formatter: (cellContent, paymentBouncedInStatus) => {
          // const date = new Date(paymentBouncedInStatus.cleared_at);
          // const day = date.getDate();
          // const month = date.getMonth() + 1; // Adding 1 to get the correct month
          // const year = date.getFullYear();

          return (
            <p className="text-muted mb-0">
              { moment(paymentBouncedInStatus.cleared_at).format("DD MMM YYYY, h:mm A")}
            </p>
          );
        },
        filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
     
      
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Action",
        formatter: (cellContent, paymentBouncedInStatus) => (
          <div className="d-flex gap-1">
            <button
              type="submit"
              className="btn btn-success save-user"
              onClick={e => this.handlePaymentStatusClick(e, paymentBouncedInStatus)}

            >
              Update
            </button>

          </div>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Comments",
        formatter: (cellContent, paymentBouncedInStatus) => (
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-finance/${paymentBouncedInStatus.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
    ];
    const { SearchBar } = Search;

    const { paymentBouncedInStatuss } = this.props;

    const { labs } = this.props;
    const { donors } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdatePaymentStatus,
      onGetBouncedInStatuss,
    } = this.props;
    const paymentBouncedInStatus = this.state.paymentBouncedInStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.props.paymentBouncedInStatuss.length, // Replace with the actual data length
      custom: true,
    };
    
    // Check if there are items in the paymentBouncedInStatuss array
    const hasData = paymentBouncedInStatuss && paymentBouncedInStatuss.length > 0;

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      let flag = 0;
      // for (let j = 0; j < inPayments.length; j++) {
      //   if (labs[i].id == inPayments[j].lab_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        labList.push({
          label: labs[i].name,
          value: labs[i].id,
        });
      }
    }

    const donorList = [];
    for (let i = 0; i < donors.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in labList
      // for (let j = 0; j < inPayments.length; j++) {
      //   if (donors[i].id == inPayments[j].donor_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
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
            <title>MIF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MIF Bounced"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentBouncedInStatusListColumns}
                      data={paymentBouncedInStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentBouncedInStatusListColumns}
                          data={paymentBouncedInStatuss}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="ms-2 mb-4">
                                    <div>
                                      <Label for="main_lab_appointments" className="form-label">
                                        <strong>Money In Form Statuss</strong>
                                      </Label>
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleSelectChange}

                                      >
                                        <option value="Bounced">Bounced</option>
                                        <option value="Created">Created</option>
                                        <option value="Pending Clearence">Pending Clearence</option>
                                        <option value="Cleared">Cleared</option>
                                      </select>
                                    </div></div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle"}
                                      bordered={false}
                                      // striped={true}
                                      columns={columns}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "UpdateMIF"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            payment_for:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .payment_for) ||
                                              "",
                                            lab_id:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .lab_id) ||
                                              "",
                                            donor_id:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .donor_id) ||
                                              "",
                                            payment_status:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .payment_status) ||
                                              "",
                                            recieved_by:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .recieved_by) ||
                                              "",
                                            cheque_image:
                                              (this.state &&
                                                this.state.cheque_image) ||
                                              "",
                                            amount:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .amount) ||
                                              "",
                                            payment_method:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .payment_method) ||
                                              "",
                                            paid_at: (this.state.paymentBouncedInStatus && this.state.paymentBouncedInStatus.paid_at) || "",


                                            cheque_no:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .cheque_no) ||
                                              "",
                                            handover_to:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .handover_to) ||
                                              "",
                                            refered_no:
                                              (this.state.paymentBouncedInStatus &&
                                                this.state.paymentBouncedInStatus
                                                  .refered_no) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),

                                            //   deposit_slip: Yup.string().required(
                                            //   "Please upload the file of payment slip"
                                            // ),


                                            // deposit_slip: Yup.string().when(
                                            //   "hiddenEditFlag",
                                            //   {
                                            //     is: hiddenEditFlag =>
                                            //       hiddenEditFlag == false, //just an e.g. you can return a function
                                            //     then: Yup.string().required(
                                            //       "Please upload Payment Slip"
                                            //     ),
                                            //   }
                                            // ),
                                            // Validation for logo based on type value
                                            // type: Yup.string(),
                                            // logo: Yup.mixed().test(
                                            //   "required",
                                            //   "Please upload logo",
                                            // ),


                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (!this.state.cheque_image) {
                                                this.toDataURL(
                                                  paymentBouncedInStatus.cheque_image
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      paymentBouncedInStatus.cheque_image
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    cheque_image: fileData,
                                                  });

                                                  const updatePaymentStatus = {
                                                    id: paymentBouncedInStatus.id,
                                                    cheque_image: this.state.cheque_image,
                                                    amount: values.amount,
                                                    paid_at: values.paid_at,
                                                    cheque_no: values.cheque_no,
                                                    handover_to: values.handover_to,
                                                    payment_for:
                                                      values.payment_for,
                                                    lab_id:
                                                      values.lab_id,
                                                    donor_id:
                                                      values.donor_id,
                                                    recieved_by:
                                                      values.recieved_by,
                                                    payment_status:
                                                      values.payment_status,
                                                    payment_method:
                                                      values.payment_method,
                                                    refered_no:
                                                      values.refered_no,
                                                  };
                                                  // update QualityCertificate
                                                  onUpdatePaymentStatus(
                                                    updatePaymentStatus
                                                  );
                                                  setTimeout(() => {
                                                    onGetBouncedInStatuss(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updatePaymentStatus = {
                                                  id: paymentBouncedInStatus.id,
                                                  cheque_image: this.state.cheque_image,
                                                  amount: values.amount,
                                                  paid_at: values.paid_at,
                                                  cheque_no: values.cheque_no,
                                                  handover_to: values.handover_to,
                                                  payment_for:
                                                    values.payment_for,
                                                  lab_id:
                                                    values.lab_id,
                                                  donor_id:
                                                    values.donor_id,
                                                  recieved_by:
                                                    values.recieved_by,
                                                  payment_status:
                                                    values.payment_status,
                                                  payment_method:
                                                    values.payment_method,
                                                  refered_no:
                                                    values.refered_no,
                                                };

                                                // update Pathologist
                                                onUpdatePaymentStatus(
                                                  updatePaymentStatus
                                                );
                                                setTimeout(() => {
                                                  onGetBouncedInStatuss(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            }

                                            this.setState({
                                              // selectedPathologist: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  {/* <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Payment For
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
                              <option value="Donor">B2b</option>
                            </select>

                          </FormGroup>

                          {this.state.payment_for == "Lab" ? (
                            paymentBouncedInStatus.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    paymentBouncedInStatus.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      paymentBouncedInStatus.lab_id
                                    }
                                    value={
                                      paymentBouncedInStatus.lab_id
                                    }
                                  >
                                    {
                                      paymentBouncedInStatus.lab_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>Lab Name</Label>
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
                            paymentBouncedInStatus.donor_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Donor name
                                </Label>
                                <Field
                                  name="donor_id"
                                  as="select"
                                  defaultValue={
                                    paymentBouncedInStatus.donor_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      paymentBouncedInStatus.donor_id
                                    }
                                    value={
                                      paymentBouncedInStatus.donor_id
                                    }
                                  >
                                    {
                                      paymentBouncedInStatus.donor_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>Donor Name</Label>
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
                                  options={b2bList}
                                  placeholder="Select Donor..."
                                />

                                <div className="invalid-feedback">
                                  Please select Donor
                                </div>
                              </div>
                            )

                          ) : null}

<div className="mb-3">
                                                    <Label className="form-label">
                                                      Amount
                                                    </Label>
                                                    <Field
                                                      name="amount"
                                                      type="number"
                                                      value={
                                                        this.state
                                                          .paymentBouncedInStatus.amount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedInStatus: {
                                                            id: paymentBouncedInStatus.id,
                                                            lab_id:
                                                              paymentBouncedInStatus.lab_id,
                                                            donor_id:
                                                              paymentBouncedInStatus.donor_id,
                                                            invoice_id:
                                                              paymentBouncedInStatus.invoice_id,
                                                            amount:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedInStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedInStatus.payment_for,
                                                            paid_at:
                                                              paymentBouncedInStatus.paid_at,
                                                            cheque_no: paymentBouncedInStatus.cheque_no,
                                                           
                                                            cheque_image:
                                                              paymentBouncedInStatus.cheque_image,
                                                            is_cleared:
                                                              paymentBouncedInStatus.is_cleared,
                                                            cleared_at: paymentBouncedInStatus.cleared_at,
                                                            recieved_by:
                                                              paymentBouncedInStatus.recieved_by,
                                                            status: paymentBouncedInStatus.status,
                                                            handover_to:
                                                              paymentBouncedInStatus.handover_to,

                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.amount &&
                                                          touched.amount
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="amount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Cheque/Online Ref#
                                                    </Label>
                                                    <Field
                                                      name="cheque_no"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.cheque_no &&
                                                      //   touched.cheque_no
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.paymentBouncedInStatus
                                                          .cheque_no
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedInStatus: {
                                                            id: paymentBouncedInStatus.id,
                                                            lab_id:
                                                              paymentBouncedInStatus.lab_id,
                                                            donor_id:
                                                              paymentBouncedInStatus.donor_id,
                                                            invoice_id:
                                                              paymentBouncedInStatus.invoice_id,
                                                            cheque_no:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedInStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedInStatus.payment_for,
                                                            paid_at:
                                                              paymentBouncedInStatus.paid_at,
                                                            handover_to: paymentBouncedInStatus.handover_to,
                                                            cheque_image:
                                                              paymentBouncedInStatus.cheque_image,
                                                            is_cleared:
                                                              paymentBouncedInStatus.is_cleared,
                                                            cleared_at: paymentBouncedInStatus.cleared_at,
                                                            recieved_by:
                                                              paymentBouncedInStatus.recieved_by,
                                                            status: paymentBouncedInStatus.status,
                                                            amount:
                                                              paymentBouncedInStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label
                                                      for="Estimated sample
                                                      collection at"
                                                    >
                                                      Payment Date
                                                    </Label>
                                                    <input
                                                      name="paid_at"
                                                      type="datetime-local"
                                                      value={
                                                        this.state
                                                          .paymentBouncedInStatus.paid_at
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedInStatus: {
                                                            id: paymentBouncedInStatus.id,
                                                            lab_id:
                                                              paymentBouncedInStatus.lab_id,
                                                            donor_id:
                                                              paymentBouncedInStatus.donor_id,
                                                            invoice_id:
                                                              paymentBouncedInStatus.invoice_id,
                                                            paid_at:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedInStatus.payment_method,
                                                            amount:
                                                              paymentBouncedInStatus.amount,
                                                            cheque_no:
                                                              paymentBouncedInStatus.cheque_no,
                                                            payment_for: paymentBouncedInStatus.payment_for,
                                                            cheque_image:
                                                              paymentBouncedInStatus.cheque_image,
                                                            is_cleared:
                                                              paymentBouncedInStatus.is_cleared,
                                                            cleared_at: paymentBouncedInStatus.cleared_at,
                                                            recieved_by:
                                                              paymentBouncedInStatus.recieved_by,
                                                            status: paymentBouncedInStatus.status,
                                                            handover_to:
                                                              paymentBouncedInStatus.handover_to,

                                                          },
                                                        });
                                                      }}
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                        " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                    // onChange={e =>
                                                    //   this.setState({
                                                    //     paid_at:
                                                    //       e.target.value,
                                                    //   })
                                                    // }
                                                    />
                                                  </div>


                          {/* {paymentBouncedInStatus.recieved_by &&
                            paymentBouncedInStatus.recieved_by ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Field
                                name="recieved_by"
                                as="select"
                                defaultValue={
                                  paymentBouncedInStatus.recieved_by
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    paymentBouncedInStatus.recieved_by
                                  }
                                  value={
                                    paymentBouncedInStatus.recieved_by
                                  }
                                >
                                  {
                                    paymentBouncedInStatus.account_no

                                  }
                                </option>
                              </Field>
                            </div>
                          ) : (
                            <div className="mb-3 select2-container">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Select
                                name="recieved_by"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    recieved_by:
                                      selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.recieved_by
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
                                      .state.recieved_by
                                      ? "#f46a6a"
                                      : "#ced4da",
                                  }),
                                }}
                                options={bankaccountList}
                                placeholder="Select Bank Account..."
                              />
                              <div className="invalid-feedback">
                                Please select your Bank Account
                              </div>
                            </div>
                          )} 

<div className="mb-3">
                                                    <Label
                                                      for="cheque_image"
                                                      className="form-label"
                                                    >
                                                      Cheque Image
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="cheque_image"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,"
                                                      onChange={e =>
                                                        this.setState({
                                                          cheque_image:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.cheque_image &&
                                                          touched.cheque_image
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="cheque_image"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                          <div className="mb-3">
                                                    <Label className="form-label">
                                                      Payment Type
                                                    </Label>
                                                    <Field
                                                      name="payment_method"
                                                      as="select"
                                                      className="form-control"
                                                      multiple={false}
                                                      value={
                                                        this.state.paymentBouncedInStatus
                                                          .payment_method
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedInStatus: {
                                                            id: paymentBouncedInStatus.id,
                                                            lab_id:
                                                              paymentBouncedInStatus.lab_id,
                                                            donor_id:
                                                              paymentBouncedInStatus.donor_id,
                                                            invoice_id:
                                                              paymentBouncedInStatus.invoice_id,
                                                            payment_method:
                                                              e.target
                                                                .value,

                                                            handover_to:
                                                              paymentBouncedInStatus.handover_to,
                                                            payment_for:
                                                              paymentBouncedInStatus.payment_for,
                                                            paid_at:
                                                              paymentBouncedInStatus.paid_at,
                                                            cheque_no: paymentBouncedInStatus.cheque_no,
                                                            cheque_image:
                                                              paymentBouncedInStatus.cheque_image,
                                                            is_cleared:
                                                              paymentBouncedInStatus.is_cleared,
                                                            cleared_at: paymentBouncedInStatus.cleared_at,
                                                            recieved_by:
                                                              paymentBouncedInStatus.recieved_by,
                                                            status: paymentBouncedInStatus.status,
                                                            amount:
                                                              paymentBouncedInStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      <option
                                                        value=""
                                                        selected={
                                                          this.state.paymentBouncedInStatus
                                                            .payment_method ===
                                                          undefined ||
                                                          this.state.paymentBouncedInStatus
                                                            .payment_method ===
                                                          ""
                                                        }
                                                      >
                                                        ----- Please select
                                                        Type -----
                                                      </option>
                                                      <option value="Cheque">
                                                        Cheque
                                                      </option>
                                                      <option value="Card">
                                                        Online
                                                      </option>
                                                    </Field>
                                                  </div>

                        

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Ha
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="handover_to"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.handover_to &&
                                                          touched.handover_to
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.paymentBouncedInStatus
                                                          .handover_to
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedInStatus: {
                                                            id: paymentBouncedInStatus.id,
                                                            lab_id:
                                                              paymentBouncedInStatus.lab_id,
                                                            donor_id:
                                                              paymentBouncedInStatus.donor_id,
                                                            invoice_id:
                                                              paymentBouncedInStatus.invoice_id,
                                                            handover_to:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedInStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedInStatus.payment_for,
                                                            paid_at:
                                                              paymentBouncedInStatus.paid_at,
                                                            cheque_no: paymentBouncedInStatus.cheque_no,
                                                            cheque_image:
                                                              paymentBouncedInStatus.cheque_image,
                                                            is_cleared:
                                                              paymentBouncedInStatus.is_cleared,
                                                            cleared_at: paymentBouncedInStatus.cleared_at,
                                                            recieved_by:
                                                              paymentBouncedInStatus.recieved_by,
                                                            status: paymentBouncedInStatus.status,
                                                            amount:
                                                              paymentBouncedInStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                    <ErrorMessage
                                                      name="handover_to"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                        </div> */}

                                                  <div>
                                                    {/* <CardTitle className="h4">
                            Payment information
                          </CardTitle>
                          <p className="card-title-desc">
                            Fill the Cheque payment only if your payment method
                            is Cheque
                          </p> */}
                                                    {/* <FormGroup className="mb-0">
                                                      <Label htmlFor="cardnumberInput">
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
                                                        <option value="Donor">Donor</option>
                                                      </select>

                                                    </FormGroup> */}

                                                    {/* {this.state.payment_for == "Lab" ? (
                                                      paymentBouncedInStatus.lab_id ? (
                                                        <div className="mb-3">
                                                          <Label className="form-label">
                                                            Lab name
                                                          </Label>
                                                          <Field
                                                            name="lab_id"
                                                            as="select"
                                                            defaultValue={
                                                              paymentBouncedInStatus.lab_id
                                                            }
                                                            className="form-control"
                                                            readOnly={true}
                                                            multiple={false}
                                                          >
                                                            <option
                                                              key={
                                                                paymentBouncedInStatus.lab_id
                                                              }
                                                              value={
                                                                paymentBouncedInStatus.lab_id
                                                              }
                                                            >
                                                              {
                                                                paymentBouncedInStatus.lab_name
                                                              }
                                                            </option>
                                                          </Field>
                                                        </div>
                                                      ) : (
                                                        <div className="mb-3 select2-container">
                                                          <Label>Lab Name</Label>
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
                                                    ) : null} */}

                                                    {/* {this.state.payment_for == "Donor" ? (
                                                      paymentBouncedInStatus.donor_id ? (
                                                        <div className="mb-3">
                                                          <Label className="form-label">
                                                            Donor name
                                                          </Label>
                                                          <Field
                                                            name="donor_id"
                                                            as="select"
                                                            defaultValue={
                                                              paymentBouncedInStatus.donor_id
                                                            }
                                                            className="form-control"
                                                            readOnly={true}
                                                            multiple={false}
                                                          >
                                                            <option
                                                              key={
                                                                paymentBouncedInStatus.donor_id
                                                              }
                                                              value={
                                                                paymentBouncedInStatus.donor_id
                                                              }
                                                            >
                                                              {
                                                                paymentBouncedInStatus.donor_name
                                                              }
                                                            </option>
                                                          </Field>
                                                        </div>
                                                      ) : (
                                                        <div className="mb-3 select2-container">
                                                          <Label>Donor Name</Label>
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

                                                    ) : null} */}

                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Amount
                                                      </Label>
                                                      <Field
                                                        name="amount"
                                                        type="number"
                                                        value={
                                                          this.state
                                                            .paymentBouncedInStatus.amount
                                                        }
                                                        onChange={e => {
                                                          this.setState({
                                                            paymentBouncedInStatus: {
                                                              id: paymentBouncedInStatus.id,
                                                              lab_id:
                                                                paymentBouncedInStatus.lab_id,
                                                              donor_id:
                                                                paymentBouncedInStatus.donor_id,
                                                              invoice_id:
                                                                paymentBouncedInStatus.invoice_id,
                                                              amount:
                                                                e.target
                                                                  .value,

                                                              payment_method:
                                                                paymentBouncedInStatus.payment_method,
                                                              payment_for:
                                                                paymentBouncedInStatus.payment_for,
                                                              paid_at:
                                                                paymentBouncedInStatus.paid_at,
                                                              cheque_no: paymentBouncedInStatus.cheque_no,

                                                              cheque_image:
                                                                paymentBouncedInStatus.cheque_image,
                                                              is_cleared:
                                                                paymentBouncedInStatus.is_cleared,
                                                              cleared_at: paymentBouncedInStatus.cleared_at,
                                                              recieved_by:
                                                                paymentBouncedInStatus.recieved_by,
                                                              payment_status: paymentBouncedInStatus.payment_status,
                                                              handover_to:
                                                                paymentBouncedInStatus.handover_to,

                                                            },
                                                          });
                                                        }}
                                                        className={
                                                          "form-control" +
                                                          (errors.amount &&
                                                            touched.amount
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="amount"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                    <div>
                                                      <Label htmlFor="cardnumberInput">
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
                                                            <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
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
                                                            <i className="far fa-money-bill-alt me-1 font-size-20 align-top" />{" "}
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
                                                            <i className="fab fa-cc-mastercard me-1 font-size-20 align-top" />{" "}
                                                            Online
                                                          </Label>
                                                        </div>
                                                      </div>

                                                      {this.state.payment_method == "Cash" ? (
                                                        <div>
                                                          <h5 className="mt-5 mb-3 font-size-15">
                                                            For Cash Payment
                                                          </h5>
                                                          <div className="p-4 border">
                                                            <Form>
                                                              <FormGroup className="mb-0">
                                                                <Label htmlFor="cardnumberInput">
                                                                  Paid At
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
                                                                  min={new Date(
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

                                                              <div className="mb-3">
                                                                <Label className="form-label">
                                                                  Handover To
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                                <Input
                                                                  name="handover_to"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.handover_to &&
                                                                      touched.handover_to
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  value={
                                                                    this.state.paymentBouncedInStatus
                                                                      .handover_to
                                                                  }
                                                                  onChange={e => {
                                                                    this.setState({
                                                                      paymentBouncedInStatus: {
                                                                        id: paymentBouncedInStatus.id,
                                                                        lab_id:
                                                                          paymentBouncedInStatus.lab_id,
                                                                        donor_id:
                                                                          paymentBouncedInStatus.donor_id,
                                                                        invoice_id:
                                                                          paymentBouncedInStatus.invoice_id,
                                                                        handover_to:
                                                                          e.target
                                                                            .value,

                                                                        payment_method:
                                                                          paymentBouncedInStatus.payment_method,
                                                                        payment_for:
                                                                          paymentBouncedInStatus.payment_for,
                                                                        paid_at:
                                                                          paymentBouncedInStatus.paid_at,
                                                                        cheque_no: paymentBouncedInStatus.cheque_no,
                                                                        cheque_image:
                                                                          paymentBouncedInStatus.cheque_image,
                                                                        is_cleared:
                                                                          paymentBouncedInStatus.is_cleared,
                                                                        cleared_at: paymentBouncedInStatus.cleared_at,
                                                                        recieved_by:
                                                                          paymentBouncedInStatus.recieved_by,
                                                                        payment_status: paymentBouncedInStatus.payment_status,
                                                                        amount:
                                                                          paymentBouncedInStatus.amount,

                                                                      },
                                                                    });
                                                                  }}
                                                                />
                                                                <ErrorMessage
                                                                  name="handover_to"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </div>

                                                              <div className="mb-3">
                                                                <Label className="form-label">
                                                                  Recieved By
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                                <Input
                                                                  name="recieved_by"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.recieved_by &&
                                                                      touched.recieved_by
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  value={
                                                                    this.state.paymentBouncedInStatus
                                                                      .recieved_by
                                                                  }
                                                                  onChange={e => {
                                                                    this.setState({
                                                                      paymentBouncedInStatus: {
                                                                        id: paymentBouncedInStatus.id,
                                                                        lab_id:
                                                                          paymentBouncedInStatus.lab_id,
                                                                        donor_id:
                                                                          paymentBouncedInStatus.donor_id,
                                                                        invoice_id:
                                                                          paymentBouncedInStatus.invoice_id,
                                                                        recieved_by:
                                                                          e.target
                                                                            .value,

                                                                        payment_method:
                                                                          paymentBouncedInStatus.payment_method,
                                                                        payment_for:
                                                                          paymentBouncedInStatus.payment_for,
                                                                        paid_at:
                                                                          paymentBouncedInStatus.paid_at,
                                                                        cheque_no: paymentBouncedInStatus.cheque_no,
                                                                        cheque_image:
                                                                          paymentBouncedInStatus.cheque_image,
                                                                        is_cleared:
                                                                          paymentBouncedInStatus.is_cleared,
                                                                        cleared_at: paymentBouncedInStatus.cleared_at,
                                                                        handover_to:
                                                                          paymentBouncedInStatus.handover_to,
                                                                        payment_status: paymentBouncedInStatus.payment_status,
                                                                        amount:
                                                                          paymentBouncedInStatus.amount,

                                                                      },
                                                                    });
                                                                  }}
                                                                />
                                                                <ErrorMessage
                                                                  name="recieved_by"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </div>

                                                            </Form>
                                                          </div>
                                                        </div>
                                                      ) : null}

                                                      {this.state.payment_method == "Cheque" ? (
                                                        <div>
                                                          <h5 className="mt-5 mb-3 font-size-15">
                                                            For Cheque Payment
                                                          </h5>
                                                          <div className="p-4 border">
                                                            <Form>
                                                              <FormGroup className="mb-0">
                                                                <Label htmlFor="cardnumberInput">
                                                                  Paid At
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
                                                                  min={new Date(
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
                                                              <div className="mb-3">
                                                                <Label className="form-label">
                                                                  Cheque No
                                                                </Label>
                                                                <Field
                                                                  name="cheque_no"
                                                                  type="text"
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.cheque_no &&
                                                                      touched.cheque_no
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                  value={
                                                                    this.state.paymentBouncedInStatus
                                                                      .cheque_no
                                                                  }
                                                                  onChange={e => {
                                                                    this.setState({
                                                                      paymentBouncedInStatus: {
                                                                        id: paymentBouncedInStatus.id,
                                                                        lab_id:
                                                                          paymentBouncedInStatus.lab_id,
                                                                        donor_id:
                                                                          paymentBouncedInStatus.donor_id,
                                                                        invoice_id:
                                                                          paymentBouncedInStatus.invoice_id,
                                                                        cheque_no:
                                                                          e.target
                                                                            .value,

                                                                        payment_method:
                                                                          paymentBouncedInStatus.payment_method,
                                                                        payment_for:
                                                                          paymentBouncedInStatus.payment_for,
                                                                        paid_at:
                                                                          paymentBouncedInStatus.paid_at,
                                                                        handover_to: paymentBouncedInStatus.handover_to,
                                                                        cheque_image:
                                                                          paymentBouncedInStatus.cheque_image,
                                                                        is_cleared:
                                                                          paymentBouncedInStatus.is_cleared,
                                                                        cleared_at: paymentBouncedInStatus.cleared_at,
                                                                        recieved_by:
                                                                          paymentBouncedInStatus.recieved_by,
                                                                        payment_status: paymentBouncedInStatus.payment_status,
                                                                        amount:
                                                                          paymentBouncedInStatus.amount,

                                                                      },
                                                                    });
                                                                  }}
                                                                />
                                                              </div>
                                                              <div className="mb-3">
                                                                <Label
                                                                  for="cheque_image"
                                                                  className="form-label"
                                                                >
                                                                  Cheque Image
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                                <Input
                                                                  id="formFile"
                                                                  name="cheque_image"
                                                                  placeholder="Choose image"
                                                                  type="file"
                                                                  multiple={false}
                                                                  accept=".jpg,.jpeg,.png,"
                                                                  onChange={e =>
                                                                    this.setState({
                                                                      cheque_image:
                                                                        e.target.files[0],
                                                                    })
                                                                  }
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.cheque_image &&
                                                                      touched.cheque_image
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />

                                                                <ErrorMessage
                                                                  name="cheque_image"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </div>

                                                            </Form>
                                                          </div>
                                                        </div>
                                                      ) : null}

                                                      {this.state.payment_method == "Card" ? (
                                                        <div>
                                                          <h5 className="mt-5 mb-3 font-size-15">
                                                            For Online Payment
                                                          </h5>
                                                          <div className="p-4 border">
                                                            <Form>
                                                              <FormGroup className="mb-0">
                                                                <Label htmlFor="cardnumberInput">
                                                                  Paid  At
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
                                                                  min={new Date(
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
                                                              <div className="mb-3">
                                                                <Label className="form-label">
                                                                  Refered No
                                                                </Label>
                                                                <Field
                                                                  name="refered_no"
                                                                  type="text"
                                                                  value={
                                                                    this.state.paymentBouncedInStatus
                                                                      .refered_no
                                                                  }

                                                                  onChange={e => {
                                                                    this.setState({
                                                                      paymentBouncedInStatus: {
                                                                        id: paymentBouncedInStatus.id,
                                                                        lab_id:
                                                                          paymentBouncedInStatus.lab_id,
                                                                        donor_id:
                                                                          paymentBouncedInStatus.donor_id,
                                                                        invoice_id:
                                                                          paymentBouncedInStatus.invoice_id,
                                                                        refered_no:
                                                                          e.target
                                                                            .value,

                                                                        payment_method:
                                                                          paymentBouncedInStatus.payment_method,
                                                                        payment_for:
                                                                          paymentBouncedInStatus.payment_for,
                                                                        paid_at:
                                                                          paymentBouncedInStatus.paid_at,
                                                                        handover_to: paymentBouncedInStatus.handover_to,
                                                                        cheque_image:
                                                                          paymentBouncedInStatus.cheque_image,
                                                                        is_cleared:
                                                                          paymentBouncedInStatus.is_cleared,
                                                                        cleared_at: paymentBouncedInStatus.cleared_at,
                                                                        recieved_by:
                                                                          paymentBouncedInStatus.recieved_by,
                                                                        payment_status: paymentBouncedInStatus.payment_status,
                                                                        amount:
                                                                          paymentBouncedInStatus.amount,

                                                                      },
                                                                    });
                                                                  }}
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.refered_no &&
                                                                      touched.refered_no
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }

                                                                />
                                                              </div>

                                                              <div className="mb-3">
                                                                <Label
                                                                  for="cheque_image"
                                                                  className="form-label"
                                                                >
                                                                  Ref Copy
                                                                  <span className="text-danger">
                                                                    *
                                                                  </span>
                                                                </Label>
                                                                <Input
                                                                  id="formFile"
                                                                  name="cheque_image"
                                                                  placeholder="Choose image"
                                                                  type="file"
                                                                  multiple={false}
                                                                  accept=".jpg,.jpeg,.png,"
                                                                  onChange={e =>
                                                                    this.setState({
                                                                      cheque_image:
                                                                        e.target.files[0],
                                                                    })
                                                                  }
                                                                  className={
                                                                    "form-control" +
                                                                    (errors.cheque_image &&
                                                                      touched.cheque_image
                                                                      ? " is-invalid"
                                                                      : "")
                                                                  }
                                                                />

                                                                <ErrorMessage
                                                                  name="cheque_image"
                                                                  component="div"
                                                                  className="invalid-feedback"
                                                                />
                                                              </div>
                                                            </Form>
                                                          </div>
                                                        </div>
                                                      ) : null}

                                                    </div>

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
                                      </ModalBody>
                                    </Modal>
                                  </div>
                                </Col>
                              </Row>
                              {hasData && (
                                <Row className="align-items-md-center mt-30">
                                  <Col className="pagination pagination-rounded justify-content-end mb-2">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </Col>
                                </Row>
                              )}
                            </React.Fragment>
                          )}
                        </ToolkitProvider>
                      )}
                    </PaginationProvider>
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

PaymentStatussList.propTypes = {
  match: PropTypes.object,
  paymentBouncedInStatuss: PropTypes.array,
  labs: PropTypes.array,
  donors: PropTypes.array,
  className: PropTypes.any,
  onGetBouncedInStatuss: PropTypes.func,
  onUpdatePaymentStatus: PropTypes.func,
  onGetlabs: PropTypes.func,
  onGetdonors: PropTypes.func,
  onGetInPayment: PropTypes.func,
  history: PropTypes.any,


};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentBouncedInStatuss: paymentStatuss.paymentBouncedInStatuss,
  bankAccounts: paymentStatuss.bankAccounts,
  labs: paymentStatuss.labs,
  donors: paymentStatuss.donors,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetlabs: () => dispatch(getLabs()),
  onGetdonors: () => dispatch(getDonors()),
  onGetBouncedInStatuss: id => dispatch(getBouncedInStatuss(id)),
  onUpdatePaymentStatus: paymentBouncedInStatus =>
    dispatch(updatePaymentStatus(paymentBouncedInStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
