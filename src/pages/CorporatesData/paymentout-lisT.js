import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect, createDispatchHook } from "react-redux";
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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getCCreatedOutStatuss,
  updatePaymentOutCreatedStatuss,
  deletePaymentout,
} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PathologistsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentCreatedStatuss: [],
      paymentCreatedStatus: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.handleCreateClick = this.handleCreateClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
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
    const { paymentCreatedStatuss, onGetCCreatedOutStatuss } = this.props;
    onGetCCreatedOutStatuss(this.state.user_id);
    this.setState({ paymentCreatedStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { paymentCreatedStatuss } = this.props;
    if (
      !isEmpty(paymentCreatedStatuss) &&
      size(prevProps.paymentCreatedStatuss) !== size(paymentCreatedStatuss)
    ) {
      this.setState({ paymentCreatedStatuss: {}, isEdit: false });
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

  onClickDelete = paymentCreatedStatuss => {
    this.setState({ paymentCreatedStatuss: paymentCreatedStatuss });
    this.setState({ deleteModal: true });
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

  handleDeletePathologist = () => {
    const { onDeletePaymentout, onGetCCreatedOutStatuss } = this.props;
    const { paymentCreatedStatuss } = this.state;
    if (paymentCreatedStatuss.id !== undefined) {
      onDeletePaymentout(paymentCreatedStatuss);
      setTimeout(() => {
        onGetCCreatedOutStatuss(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };
  handleSubmitClick = (e, arg) => {
    const paymentCreatedStatus = arg;
    this.setState({
      paymentCreatedStatus: {
        id: paymentCreatedStatus.id,
        deposit_copy: process.env.REACT_APP_BACKENDURL + paymentCreatedStatus.deposit_copy,
        payment_for: paymentCreatedStatus.payment_for,
        lab_id: paymentCreatedStatus.lab_id,
        b2b_id: paymentCreatedStatus.b2b_id,
        bankaccount_id: paymentCreatedStatus.bankaccount_id,
        amount: paymentCreatedStatus.amount,
        payment_at: paymentCreatedStatus.payment_at,
        payment_method: paymentCreatedStatus.payment_method,
        cheque_no: paymentCreatedStatus.cheque_no,
        status: "Pending Clearance",
        comments: paymentCreatedStatus.comments,
      },
      deposit_copy: "",
      isEdit: true,
    });

    this.toggle();
  };

  handleCreateClick = (e, arg) => {
    const paymentCreatedStatus = arg;
    this.setState({
      paymentCreatedStatus: {
        id: paymentCreatedStatus.id,
        deposit_copy: process.env.REACT_APP_BACKENDURL + paymentCreatedStatus.deposit_copy,
        payment_for: paymentCreatedStatus.payment_for,
        lab_id: paymentCreatedStatus.lab_id,
        b2b_id: paymentCreatedStatus.b2b_id,
        bankaccount_id: paymentCreatedStatus.bankaccount_id,
        amount: paymentCreatedStatus.amount,
        payment_at: paymentCreatedStatus.payment_at,
        payment_method: paymentCreatedStatus.payment_method,
        cheque_no: paymentCreatedStatus.cheque_no,
        status: "Created",
        comments: paymentCreatedStatus.comments,
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
        dataField: "order_id",
        sort: true,
        hidden: false,
        formatter: (cellContent, paymentCreatedStatus) => (
        <>
        <span>{paymentCreatedStatus.order_id}</span>
        </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_for",
        text: "Payment From",
        sort: true,
        formatter: (cellContent, paymentCreatedStatus) => (
          <>
          <span>{paymentCreatedStatus.payment_for}</span>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
   
      {
        dataField: "lab_name",
        text: "Client Name",
        sort: true,
      formatter: (cellContent, paymentCreatedStatus) => (
        <>
          <span>
            <span>
              {paymentCreatedStatus.lab_name}{" "}
              {paymentCreatedStatus.business_name}
            </span>
          </span>
        </>
      ),filter: textFilter(),
      headerStyle: { backgroundColor: '#DCDCDC' },
      },
      // {
      //   dataField: "b2b_id",
      //   text: "B2b Name",
      //   sort: true,
      // },
      {
        dataField: "payment_method",
        text: "Payment Type.",
        sort: true,
        formatter: (cellContent, paymentCreatedStatus) => (
          <>
          <span>{paymentCreatedStatus.payment_method}</span>
          </>
          ),filter: textFilter(),
          headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "cheque_no",
        text: "Cheque/Online Ref#",
        sort: true,
        formatter: (cellContent, paymentOutStatus) => (
          <>
            <span>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentOutStatus.deposit_copy,
                }}
                target="_blank"
              >
                              <strong>{paymentOutStatus.cheque_no}</strong>

              </Link>

            </span>

          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_at",
        text: "Deposite Date",
        sort: true,
        formatter: (cellContent, paymentCreatedStatus) => {
          const date = new Date(paymentCreatedStatus.payment_at);
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
      {
        dataField: "amount",
        text: "Payment",
        sort: true,
        formatter: (cellContent, paymentCreatedStatus) => (
          <>
            <div className="text-end">
              {paymentCreatedStatus && typeof paymentCreatedStatus.amount !== 'undefined' ? (
                <strong>{Math.abs(paymentCreatedStatus.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
              ) : (
                <span>N/A</span> // or any default value you want to display when amount is undefined
              )}
            </div>
          </>
        ),filter: textFilter(),
          headerStyle: { backgroundColor: '#DCDCDC' },
          style: { backgroundColor: '	#F0F0F0' },
      },
      {
        dataField: "bank",
        text: "Bank/Account#",
        sort: true,
        formatter: (cellContent, paymentCreatedStatus) => (
          <>
            <span>
              <span>
                {paymentCreatedStatus.bank_name},{" "}
                {paymentCreatedStatus.bank_account_no}
              </span>
            </span>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
     
      // {
      //   dataField: "status",
      //   text: "Status",
      //   sort: true,
      // },
      // {
      //   dataField: "deposit_copy",
      //   text: "Deposite Copy",
      //   sort: true,
      //   formatter: (cellContent, paymentCreatedStatus) => (
      //     <>
      //       <Link
      //         to={{
      //           pathname:
      //             process.env.REACT_APP_BACKENDURL + paymentCreatedStatus.deposit_copy,
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
        formatter: (cellContent, paymentCreatedStatus) => (
          <div className="d-flex gap-1">
            <button
              type="submit"
              className="btn btn-success save-user"
              onClick={e => this.handleCreateClick(e, paymentCreatedStatus)}

            >
              Edit
            </button>

            <button
              type="submit"
              className="btn btn-success save-user"
              onClick={e => this.handleSubmitClick(e, paymentCreatedStatus)}

            >
              Update
            </button>
            <button
              type="submit"
              className="btn btn-danger save-user"
              onClick={() => this.onClickDelete(paymentCreatedStatus)}

            >
              Delete
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
        formatter: (cellContent, paymentCreatedStatus) => (
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-finance/${paymentCreatedStatus.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
    ];
    const { SearchBar } = Search;

    const { paymentCreatedStatuss } = this.props;

    const { isEdit, deleteModal, status } = this.state;


    const { onUpdatePaymentOutCreatedStatuss, onGetCCreatedOutStatuss } =
      this.props;
    const paymentCreatedStatus = this.state.paymentCreatedStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.props.paymentCreatedStatuss.length, // Replace with the actual data length
      custom: true,
    };
    
    // Check if there are items in the paymentCreatedStatuss array
    const hasData = paymentCreatedStatuss && paymentCreatedStatuss.length > 0;

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>MOF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MOF Created"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentCreatedStatusListColumns}
                      data={paymentCreatedStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentCreatedStatusListColumns}
                          data={paymentCreatedStatuss}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                <div className="ms-2 mb-4">
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
                <option value="Created">Created</option>
                <option value="Pending Clearence">Pending Clearence</option>
                <option value="Cleared">Cleared</option>
                <option value="Bounced">Bounced</option>
            </select>
        </div>
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
                                          : "Add Pathologist"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            deposit_copy:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.deposit_copy) ||
                                              "",
                                            amount:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.amount) ||
                                              "",
                                            payment_method:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_method) ||
                                              "",
                                            deposit_copy:
                                              (this.state &&
                                                this.state.deposit_copy) ||
                                              "",
                                            payment_at:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_at) ||
                                              "",
                                            cheque_no:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.cheque_no) ||
                                              "",
                                            comments:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.comments) ||
                                              "",
                                            lab_id:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.lab_id) ||
                                              "",
                                            payment_for:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_for) ||
                                              "",
                                            b2b_id:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.b2b_id) ||
                                              "",
                                            bankaccount_id:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.bankaccount_id) ||
                                              "",
                                            status:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.status) ||
                                              "",
                                            // payment_method:
                                            //   (paymentCreatedStatus &&
                                            //     paymentCreatedStatus.payment_method) ||
                                            //   "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            // name: Yup.string()
                                            //   .trim()
                                            //   .matches(
                                            //     /^[a-zA-Z][a-zA-Z ]+$/,
                                            //     "Please enter only alphabets and spaces"
                                            //   )
                                            //   .required("Please enter name"),
                                            // comments: Yup.string()
                                            //   .required("Please enter comments")
                                            //   .comments(
                                            //     "Please enter valid comments"
                                            //   ),
                                            // amount: Yup.string()
                                            //   .required("Please enter amount")
                                            //   .matches(
                                            //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                            //     "Please enter a valid Pakistani amount number e.g. 03123456789"
                                            //   ),
                                            // cheque_no: Yup.string()
                                            //   .required("Please enter amount")
                                            //   .matches(
                                            //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                                            //     "Please enter a valid Pakistani cheque_no number e.g. 0512345678"
                                            //   ),
                                            // qualification: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your qualification"
                                            //   ),
                                            // speciality: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your speciality"
                                            //   ),
                                            // pmdc_reg_no: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your pmdc reg no."
                                            //   ),
                                            // // designation: Yup.string()
                                            // //   .trim()
                                            // //   .required(
                                            // //     "Please enter your designation"
                                            // //   ),
                                            // payment_for:
                                            //   Yup.string()
                                            //     .trim()
                                            //     .required(
                                            //       "Please select one option from dropdown"
                                            //     ),
                                            // is_available_on_whatsapp:
                                            //   Yup.string()
                                            //     .trim()
                                            //     .required(
                                            //       "Please select one option from dropdown"
                                            //     ),
                                            // deposit_copy: Yup.string().when(
                                            //   "hiddenEditFlag",
                                            //   {
                                            //     is: hiddenEditFlag =>
                                            //       hiddenEditFlag == false, //just an e.g. you can return a function
                                            //     then: Yup.string().required(
                                            //       "Please upload deposit_copy"
                                            //     ),
                                            //   }
                                            // ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (!this.state.deposit_copy) {
                                                this.toDataURL(
                                                  paymentCreatedStatus.deposit_copy
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      paymentCreatedStatus.deposit_copy
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    deposit_copy: fileData,
                                                  });

                                                  const updatePaymentOutCreatedStatuss = {
                                                    id: paymentCreatedStatus.id,
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
                                                    onGetCCreatedOutStatuss(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updatePaymentOutCreatedStatuss = {
                                                  id: paymentCreatedStatus.id,
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
                                                  onGetCCreatedOutStatuss(
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


                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Payment To
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="payment_for"
                                                      as="select"
                                                      // className="form-control"
                                                      multiple={false}
                                                      className={
                                                        "form-control" +
                                                        (errors.payment_for &&
                                                          touched.payment_for
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.paymentCreatedStatus
                                                          .payment_for
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_for:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            amount:
                                                              paymentCreatedStatus.amount,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      <option value="">
                                                        ----- Please select
                                                        Type-----
                                                      </option>
                                                      <option value="Lab">
                                                        Lab
                                                      </option>
                                                      <option value="B2BClient">
                                                        B2BClient
                                                      </option>
                                                    </Field>

                                                    <ErrorMessage
                                                      name="payment_for"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />

                                                    {/* <span className="text-primary font-size-12 text-bold">
                                                      <strong>
                                                        Note: Your contact
                                                        information will be
                                                        shared publicly for
                                                        consultation of the
                                                        patients with you if you
                                                        select YES.
                                                      </strong>
                                                    </span> */}
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Amount
                                                    </Label>
                                                    <Field
                                                      name="amount"
                                                      type="number"
                                                      value={
                                                        this.state
                                                          .paymentCreatedStatus.amount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            amount:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

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
                                                          .paymentCreatedStatus.payment_at
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_at:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            amount:
                                                              paymentCreatedStatus.amount,
                                                            cheque_no:
                                                              paymentCreatedStatus.cheque_no,
                                                            payment_for: paymentCreatedStatus.payment_for,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

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
                                                        this.state.paymentCreatedStatus
                                                          .cheque_no
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            cheque_no:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            comments: paymentCreatedStatus.comments,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                  </div>

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
                                                        this.state.paymentCreatedStatus
                                                          .payment_method
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_method:
                                                              e.target
                                                                .value,

                                                            comments:
                                                              paymentCreatedStatus.comments,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      <option
                                                        value=""
                                                        selected={
                                                          this.state.paymentCreatedStatus
                                                            .payment_method ===
                                                          undefined ||
                                                          this.state.paymentCreatedStatus
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
                                                        this.state.paymentCreatedStatus
                                                          .comments
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            b2b_id:
                                                              paymentCreatedStatus.b2b_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            comments:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            bank_id:
                                                              paymentCreatedStatus.bank_id,
                                                            deposit_copy:
                                                              paymentCreatedStatus.deposit_copy,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            bankaccount_id:
                                                              paymentCreatedStatus.bankaccount_id,
                                                            status: paymentCreatedStatus.status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

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

PathologistsList.propTypes = {
  match: PropTypes.object,
  className: PropTypes.any,
  onGetCCreatedOutStatuss: PropTypes.func,
  paymentCreatedStatuss: PropTypes.array,
  onDeletePaymentout: PropTypes.func,
  onUpdatePaymentOutCreatedStatuss: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentCreatedStatuss: paymentStatuss.paymentCreatedStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCCreatedOutStatuss: id => dispatch(getCCreatedOutStatuss(id)),
  onUpdatePaymentOutCreatedStatuss: paymentCreatedStatus => dispatch(updatePaymentOutCreatedStatuss(paymentCreatedStatus)),
  onDeletePaymentout: paymentCreatedStatus => dispatch(deletePaymentout(paymentCreatedStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PathologistsList));
