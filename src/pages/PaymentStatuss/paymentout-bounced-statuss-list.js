import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect, createDispatchHook } from "react-redux";
import Select from "react-select";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  FormGroup,
  CardTitle,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

// import {
//   addNewOutPayment,
// } from "store/outpayments/actions";
import {
  getLabs,
  getBankAccounts,

  // addNewOutPayment,
  getBouncedStatuss,
  updatePaymentOutCreatedStatuss,
} from "store/payment-statuss/actions";
import {
  addNewOutPayment,
} from "store/outpayments/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class paymentCreatedList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentBouncedStatuss: [],
      paymentBouncedStatus: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePaymentStatusClicks =
      this.handlePaymentStatusClicks.bind(this);
  }
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

    const { bankAccounts, onGetbankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetbankAccounts();
    }
    this.setState({ bankAccounts });


    const { paymentBouncedStatuss, onGetBouncedStatuss } = this.props;
    onGetBouncedStatuss(this.state.user_id);
    this.setState({ paymentBouncedStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      paymentBouncedStatus: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {

    const { paymentBouncedStatuss } = this.props;
    if (
      !isEmpty(paymentBouncedStatuss) &&
      size(prevProps.paymentBouncedStatuss) !== size(paymentBouncedStatuss)
    ) {
      this.setState({ paymentBouncedStatuss: {}, isEdit: false });
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

  handleSubmitClick = (e, arg) => {
    const paymentBouncedStatus = arg;
    this.setState({
      paymentBouncedStatus: {
        id: paymentBouncedStatus.id,
        deposit_copy: process.env.REACT_APP_BACKENDURL + paymentBouncedStatus.deposit_copy,
        payment_for: paymentBouncedStatus.payment_for,
        lab_id: paymentBouncedStatus.lab_id,
        b2b_id: paymentBouncedStatus.b2b_id,
        bankaccount_id: paymentBouncedStatus.bankaccount_id,
        amount: paymentBouncedStatus.amount,
        payment_at: paymentBouncedStatus.payment_at,
        payment_method: paymentBouncedStatus.payment_method,
        cheque_no: paymentBouncedStatus.cheque_no,
        status: "Pending Clearance",
        comments: paymentBouncedStatus.comments,
      },
      deposit_copy: "",
      isEdit: true,
    });

    this.toggle();
  };

  handleCreateClick = (e, arg) => {
    const paymentBouncedStatus = arg;
    this.setState({
      paymentBouncedStatus: {
        id: paymentBouncedStatus.id,
        deposit_copy: process.env.REACT_APP_BACKENDURL + paymentBouncedStatus.deposit_copy,
        payment_for: paymentBouncedStatus.payment_for,
        lab_id: paymentBouncedStatus.lab_id,
        b2b_id: paymentBouncedStatus.b2b_id,
        bankaccount_id: paymentBouncedStatus.bankaccount_id,
        amount: paymentBouncedStatus.amount,
        payment_at: paymentBouncedStatus.payment_at,
        payment_method: paymentBouncedStatus.payment_method,
        cheque_no: paymentBouncedStatus.cheque_no,
        status: "Created",
        comments: paymentBouncedStatus.comments,
      },
      deposit_copy: "",
      isEdit: true,
    });

    this.toggle();
  };

  handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    // Perform navigation based on the selected value
    if (selectedValue === 'Created') {
      this.props.history.push('/payment-out-created-status');
    }
    if (selectedValue === 'Pending Clearence') {
        this.props.history.push('/payment-out-pending-clearence-status');
    }
    if (selectedValue === 'Cleared') {
    this.props.history.push('/payment-out-clear-status');
    }
    if (selectedValue === 'Bounced') {
    this.props.history.push('/payment-out-bounced-status');
    }
  }

  render() {
   const columns= [
      {
        text: "MOF ID",
        dataField: "id",
        sort: true,
        hidden: false,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>{paymentBouncedStatus.id}</>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "invoice_id",
        text: "Invoice ID",
        sort: true,
        hidden: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <strong>{paymentBouncedStatus.invoice_id}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_method",
        text: "Payment Method",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <strong>{paymentBouncedStatus.payment_method}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      // {
      //   dataField: "payment_for",
      //   text: "Payment To",
      //   sort: true,
      //   formatter: (cellContent, paymentBouncedStatus) => {
      //     const date = new Date(paymentBouncedStatus.payment_for);
      //     const day = date.getDate();
      //     const month = date.getMonth() + 1; // Adding 1 to get the correct month
      //     const year = date.getFullYear();
          
      //     return (
      //         <p className="text-muted mb-0">
      //             {`${day}/${month}/${year}`}
      //         </p>
      //     );
      // },filter: textFilter(),
      // },
      {
        dataField: "lab_name",
        text: "Client Name",
        sort: true,
      formatter: (cellContent, paymentBouncedStatus) => (
        <>
          <span>
            <span>
              {paymentBouncedStatus.lab_name}{" "}
              {paymentBouncedStatus.b2b_id}
            </span>
          </span>
        </>
      ),filter: textFilter(),
      headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_at",
        text: "Payment Date",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <strong>{paymentBouncedStatus.payment_at}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "cheque_no",
        text: "Cheque/Online Ref#",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <span>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentBouncedStatus.deposit_copy,
                }}
                target="_blank"
              >
                              <strong>{paymentBouncedStatus.cheque_no}</strong>

              </Link>

            </span>

          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "amount",
        text: "Payment",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <strong>{Math.abs(paymentBouncedStatus.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
      // {
      //   dataField: "bank",
      //   text: "Bank/Account#",
      //   sort: true,
      //   formatter: (cellContent, paymentBouncedStatus) => (
      //     <>
      //       <span>
      //         <span>
      //           {paymentBouncedStatus.bank_name},{" "}
      //           {paymentBouncedStatus.account_no}
      //         </span>
      //       </span>
      //     </>
      //   ),filter: textFilter(),
      // },
     
      {
        dataField: "is_cleared",
        text: "Cleared",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => (
          <>
            <strong>{paymentBouncedStatus.is_cleared}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "cleared_at",
        text: "Cleared Date",
        sort: true,
        formatter: (cellContent, paymentBouncedStatus) => {
          const date = new Date(paymentBouncedStatus.cleared_at);
          const day = date.getDate();
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
      
          return (
              <p className="text-muted mb-0">
                  {`${day}-${month}-${year}`}
              </p>
          );
      },
      filter: textFilter(),
      headerStyle: { backgroundColor: '#DCDCDC' },
      style: { backgroundColor: '	#F0F0F0' },
      },
      // {
      //   dataField: "deposit_copy",
      //   text: "Deposite Copy",
      //   sort: true,
      //   formatter: (cellContent, paymentBouncedStatus) => (
      //     <>
      //       <Link
      //         to={{
      //           pathname:
      //             process.env.REACT_APP_BACKENDURL + paymentBouncedStatus.deposit_copy,
      //         }}
      //         target="_blank"
      //       >
      //         View
      //       </Link>
      //     </>
      //   ),
      // },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Action",
        formatter: (cellContent, paymentBouncedStatus) => (
          <div className="d-flex gap-1">
           
            
          <button
            type="submit"
            className="btn btn-success save-user"
            onClick={e => this.handleCreateClick(e, paymentBouncedStatus)}

          >
            Edit
          </button>

          <button
            type="submit"
            className="btn btn-success save-user"
            onClick={e => this.handleSubmitClick(e, paymentBouncedStatus)}

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
        formatter: (cellContent, paymentBouncedStatus) => (
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-finance/${paymentBouncedStatus.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
    ];
    const { SearchBar } = Search;
    const { labs } = this.props;

    const { paymentBouncedStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewOutPayment,
      onUpdatePaymentOutCreatedStatuss,
      onGetBouncedStatuss,
    } = this.props;
    const paymentBouncedStatus = this.state.paymentBouncedStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.props.paymentBouncedStatuss.length, // Replace with the actual data length
      custom: true,
    };
    
    // Check if there are items in the paymentBouncedStatuss array
    const hasData = paymentBouncedStatuss && paymentBouncedStatuss.length > 0;

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      let flag = 0;
      // for (let j = 0; j < paymentBouncedStatuss.length; j++) {
      //   if (labs[i].id == paymentBouncedStatuss[j].lab_id) {
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

    const { bankAccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankAccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankaccountList.push({
          label: bankAccounts[i].account_no,
          value: bankAccounts[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>MOF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MOF Bounced"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentBouncedStatusListColumns}
                      data={paymentBouncedStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentBouncedStatusListColumns}
                          data={paymentBouncedStatuss}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                <div>
            <Label for="main_lab_appointments" className="form-label">
                <strong>Money Out Form Statuses</strong>
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
        </div>
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
                                      filter={ filterFactory()}
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
                                          ? "UpdateMOF"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            payment_for:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .payment_for) ||
                                              "",
                                            lab_id:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .lab_id) ||
                                              "",
                                            b2b_id:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .b2b_id) ||
                                              "",
                                            status:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .status) ||
                                              "",
                                            bankaccount_id:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .bankaccount_id) ||
                                              "",
                                              deposit_copy:
                                              (this.state &&
                                                this.state.deposit_copy) ||
                                              "",
                                            amount:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .amount) ||
                                              "",
                                            payment_method:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .payment_method) ||
                                              "",
                                            payment_at: (this.state.paymentBouncedStatus && this.state.paymentBouncedStatus.payment_at) || "",


                                            cheque_no:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .cheque_no) ||
                                              "",
                                            comments:
                                              (this.state.paymentBouncedStatus &&
                                                this.state.paymentBouncedStatus
                                                  .comments) ||
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
                                              if (!this.state.deposit_copy) {
                                                this.toDataURL(
                                                  paymentBouncedStatus.deposit_copy
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      paymentBouncedStatus.deposit_copy
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    deposit_copy: fileData,
                                                  });

                                                  const updatePaymentOutCreatedStatuss = {
                                                    id: paymentBouncedStatus.id,
                                                    deposit_copy: this.state.deposit_copy,
                                                    amount: values.amount,
                                                    payment_at: values.payment_at,
                                                    cheque_no: values.cheque_no,
                                                    comments: values.comments,
                                                    payment_for:
                                                      values.payment_for,
                                                    lab_id:
                                                      values.lab_id,
                                                    b2b_id:
                                                      values.b2b_id,
                                                    bankaccount_id:
                                                      values.bankaccount_id,
                                                    status:
                                                      values.status,
                                                    payment_method:
                                                      values.payment_method,
                                                    // payment_method:
                                                    //   values.payment_method,
                                                  };
                                                  // update QualityCertificate
                                                  onUpdatePaymentOutCreatedStatuss(
                                                    updatePaymentOutCreatedStatuss
                                                  );
                                                  setTimeout(() => {
                                                    onGetBouncedStatuss(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updatePaymentOutCreatedStatuss = {
                                                  id: paymentBouncedStatus.id,
                                                  deposit_copy: this.state.deposit_copy,
                                                  amount: values.amount,
                                                  payment_at: values.payment_at,
                                                  cheque_no: values.cheque_no,
                                                  comments: values.comments,
                                                  payment_for:
                                                    values.payment_for,
                                                  lab_id:
                                                    values.lab_id,
                                                  b2b_id:
                                                    values.b2b_id,
                                                  bankaccount_id:
                                                    values.bankaccount_id,
                                                  status:
                                                    values.status,
                                                  payment_method:
                                                    values.payment_method,
                                                  // payment_method:
                                                  //   values.payment_method,
                                                };

                                                // update Pathologist
                                                onUpdatePaymentOutCreatedStatuss(
                                                  updatePaymentOutCreatedStatuss
                                                );
                                                setTimeout(() => {
                                                  onGetBouncedStatuss(
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

                                                  <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
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
                            paymentBouncedStatus.lab_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  Lab name
                                </Label>
                                <Field
                                  name="lab_id"
                                  as="select"
                                  defaultValue={
                                    paymentBouncedStatus.lab_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      paymentBouncedStatus.lab_id
                                    }
                                    value={
                                      paymentBouncedStatus.lab_id
                                    }
                                  >
                                    {
                                      paymentBouncedStatus.lab_name
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

                          {this.state.payment_for == "B2BClient" ? (
                            paymentBouncedStatus.b2b_id ? (
                              <div className="mb-3">
                                <Label className="form-label">
                                  B2BClient name
                                </Label>
                                <Field
                                  name="b2b_id"
                                  as="select"
                                  defaultValue={
                                    paymentBouncedStatus.b2b_id
                                  }
                                  className="form-control"
                                  readOnly={true}
                                  multiple={false}
                                >
                                  <option
                                    key={
                                      paymentBouncedStatus.b2b_id
                                    }
                                    value={
                                      paymentBouncedStatus.b2b_id
                                    }
                                  >
                                    {
                                      paymentBouncedStatus.donor_name
                                    }
                                  </option>
                                </Field>
                              </div>
                            ) : (
                              <div className="mb-3 select2-container">
                                <Label>B2BClient Name</Label>
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
                                  placeholder="Select Donor..."
                                />

                                <div className="invalid-feedback">
                                  Please select B2BClient
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
                                                          .paymentBouncedStatus.amount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedStatus: {
                                                            id: paymentBouncedStatus.id,
                                                            lab_id:
                                                              paymentBouncedStatus.lab_id,
                                                            b2b_id:
                                                              paymentBouncedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentBouncedStatus.invoice_id,
                                                            amount:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedStatus.payment_for,
                                                            payment_at:
                                                              paymentBouncedStatus.payment_at,
                                                            cheque_no: paymentBouncedStatus.cheque_no,
                                                            bank_id:
                                                              paymentBouncedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentBouncedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentBouncedStatus.is_cleared,
                                                            cleared_at: paymentBouncedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentBouncedStatus.bankaccount_id,
                                                            status: paymentBouncedStatus.status,
                                                            comments:
                                                              paymentBouncedStatus.comments,

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
                                                        this.state.paymentBouncedStatus
                                                          .cheque_no
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedStatus: {
                                                            id: paymentBouncedStatus.id,
                                                            lab_id:
                                                              paymentBouncedStatus.lab_id,
                                                            b2b_id:
                                                              paymentBouncedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentBouncedStatus.invoice_id,
                                                            cheque_no:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedStatus.payment_for,
                                                            payment_at:
                                                              paymentBouncedStatus.payment_at,
                                                            comments: paymentBouncedStatus.comments,
                                                            bank_id:
                                                              paymentBouncedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentBouncedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentBouncedStatus.is_cleared,
                                                            cleared_at: paymentBouncedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentBouncedStatus.bankaccount_id,
                                                            status: paymentBouncedStatus.status,
                                                            amount:
                                                              paymentBouncedStatus.amount,

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
                                                      name="payment_at"
                                                      type="datetime-local"
                                                      value={
                                                        this.state
                                                          .paymentBouncedStatus.payment_at
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedStatus: {
                                                            id: paymentBouncedStatus.id,
                                                            lab_id:
                                                              paymentBouncedStatus.lab_id,
                                                            b2b_id:
                                                              paymentBouncedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentBouncedStatus.invoice_id,
                                                            payment_at:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedStatus.payment_method,
                                                            amount:
                                                              paymentBouncedStatus.amount,
                                                            cheque_no:
                                                              paymentBouncedStatus.cheque_no,
                                                            payment_for: paymentBouncedStatus.payment_for,
                                                            bank_id:
                                                              paymentBouncedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentBouncedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentBouncedStatus.is_cleared,
                                                            cleared_at: paymentBouncedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentBouncedStatus.bankaccount_id,
                                                            status: paymentBouncedStatus.status,
                                                            comments:
                                                              paymentBouncedStatus.comments,

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
                                                    //     payment_at:
                                                    //       e.target.value,
                                                    //   })
                                                    // }
                                                    />
                                                  </div>


                          {paymentBouncedStatus.bankaccount_id &&
                            paymentBouncedStatus.bankaccount_id ? (
                            <div className="mb-3">
                              <Label
                                className="col-form-label"
                              >
                                Bank Account Name</Label>

                              <Field
                                name="bankaccount_id"
                                as="select"
                                defaultValue={
                                  paymentBouncedStatus.bankaccount_id
                                }
                                className="form-control"
                                readOnly={true}
                                multiple={false}
                              >
                                <option
                                  key={
                                    paymentBouncedStatus.bankaccount_id
                                  }
                                  value={
                                    paymentBouncedStatus.bankaccount_id
                                  }
                                >
                                  {
                                    paymentBouncedStatus.account_no

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
                                name="bankaccount_id"
                                component="Select"
                                onChange={selectedGroup =>
                                  this.setState({
                                    bankaccount_id:
                                      selectedGroup.value,
                                  })
                                }
                                className={
                                  "defautSelectParent" +
                                  (!this.state.bankaccount_id
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
                                      .state.bankaccount_id
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
                                                      for="deposit_copy"
                                                      className="form-label"
                                                    >
                                                      Deposite Copy
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="deposit_copy"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,"
                                                      onChange={e =>
                                                        this.setState({
                                                          deposit_copy:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.deposit_copy &&
                                                          touched.deposit_copy
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="deposit_copy"
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
                                                        this.state.paymentBouncedStatus
                                                          .payment_method
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedStatus: {
                                                            id: paymentBouncedStatus.id,
                                                            lab_id:
                                                              paymentBouncedStatus.lab_id,
                                                            b2b_id:
                                                              paymentBouncedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentBouncedStatus.invoice_id,
                                                            payment_method:
                                                              e.target
                                                                .value,

                                                            comments:
                                                              paymentBouncedStatus.comments,
                                                            payment_for:
                                                              paymentBouncedStatus.payment_for,
                                                            payment_at:
                                                              paymentBouncedStatus.payment_at,
                                                            cheque_no: paymentBouncedStatus.cheque_no,
                                                            bank_id:
                                                              paymentBouncedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentBouncedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentBouncedStatus.is_cleared,
                                                            cleared_at: paymentBouncedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentBouncedStatus.bankaccount_id,
                                                            status: paymentBouncedStatus.status,
                                                            amount:
                                                              paymentBouncedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      <option
                                                        value=""
                                                        selected={
                                                          this.state.paymentBouncedStatus
                                                            .payment_method ===
                                                          undefined ||
                                                          this.state.paymentBouncedStatus
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
                                                      Comments
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="comments"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.comments &&
                                                          touched.comments
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.paymentBouncedStatus
                                                          .comments
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentBouncedStatus: {
                                                            id: paymentBouncedStatus.id,
                                                            lab_id:
                                                              paymentBouncedStatus.lab_id,
                                                            b2b_id:
                                                              paymentBouncedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentBouncedStatus.invoice_id,
                                                            comments:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentBouncedStatus.payment_method,
                                                            payment_for:
                                                              paymentBouncedStatus.payment_for,
                                                            payment_at:
                                                              paymentBouncedStatus.payment_at,
                                                            cheque_no: paymentBouncedStatus.cheque_no,
                                                            bank_id:
                                                              paymentBouncedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentBouncedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentBouncedStatus.is_cleared,
                                                            cleared_at: paymentBouncedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentBouncedStatus.bankaccount_id,
                                                            status: paymentBouncedStatus.status,
                                                            amount:
                                                              paymentBouncedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                    <ErrorMessage
                                                      name="comments"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
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

paymentCreatedList.propTypes = {
  match: PropTypes.object,
  labs: PropTypes.array,
  paymentBouncedStatuss: PropTypes.array,
  className: PropTypes.any,
  bankAccounts: PropTypes.array,
  onAddNewOutPayment: PropTypes.func,
  onGetBouncedStatuss: PropTypes.func,
  onUpdatePaymentOutCreatedStatuss: PropTypes.func,
  onGetlabs: PropTypes.func,
  onGetbankAccounts: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentBouncedStatuss: paymentStatuss.paymentBouncedStatuss,
  labs: paymentStatuss.labs,
  bankAccounts: paymentStatuss.bankAccounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetlabs: () => dispatch(getLabs()),
  onGetbankAccounts: () => dispatch(getBankAccounts()),
  onGetBouncedStatuss: id => dispatch(getBouncedStatuss(id)),
  onUpdatePaymentOutCreatedStatuss: paymentOutCreatedStatuss =>
    dispatch(updatePaymentOutCreatedStatuss(paymentOutCreatedStatuss)),
  onAddNewOutPayment: (paymentBouncedStatus, id) =>
    dispatch(addNewOutPayment(paymentBouncedStatus, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(paymentCreatedList));
