import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from "moment";
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
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import Tooltip from "@material-ui/core/Tooltip";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getCsrComplaints,
  updateCsrComplaints,
} from "store/csr-complaints/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class csrComplaints extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();

    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this.state = {
      csrComplaints: [],
      csrComplaint: "",
      modal: false,
      startDate: oneMonthAgo, // Default to one month ago
      endDate: today, // Default to today
      btnText: "Copy",
      btnText1: "Copy",
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentOutStatusListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, csrComplaint) => <>{csrComplaint.id}</>,
          filter: textFilter(),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, csrComplaint) => (
            <>
              <strong>{csrComplaint.order_id}</strong>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
          formatter: (cellContent, csrComplaint) => (
            <>
              <span>
                <Link
                  to="#"
                  // onClick={e => this.openPatientModal(e, csrComplaint)}
                  onMouseEnter={e => this.openPatientModal(e, csrComplaint)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {csrComplaint.patient_name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, csrComplaint) => (
            <>
              <span>
                <Link
                  to="#"
                  //  onClick={e => this.openLabModal(e, csrComplaint)}
                  onMouseEnter={e => this.openLabModal(e, csrComplaint)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {csrComplaint.lab_name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              {labsList.is_home_sampling_availed == true ||
              labsList.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              "": "All",
              true: "Yes",
              false: "No",
            },
            defaultValue: "All",
          }),
        },

        {
          dataField: "status",
          text: "Status",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "appointment_requested_at",
          text: "Appointment Requested at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {moment(complaint.appointment_requested_at).format(
                  "DD MMM YYYY, h:mm A"
                )}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "estimated_sample_collection_at",
          text: "Schedule time by lab",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              {complaint.appointment_requested_at >
              complaint.estimated_sample_collection_at ? (
                <span className="text-danger">
                  {complaint.estimated_sample_collection_at
                    ? moment(complaint.estimated_sample_collection_at).format(
                        "DD MMM YYYY, h:mm A"
                      )
                    : "--"}
                </span>
              ) : (
                <span>
                  {complaint.estimated_sample_collection_at
                    ? moment(complaint.estimated_sample_collection_at).format(
                        "DD MMM YYYY, h:mm A"
                      )
                    : "--"}
                </span>
              )}
            </>
          ),
          filter: textFilter(),
        },

        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, csrComplaint) => (
            <div className="d-flex gap-3 float-end">
              <Tooltip title="Appointment Detail">
                <Link
                  className="mdi mdi-receipt font-size-18"
                  to={`/appointment-detail/${csrComplaint.id}`}
                ></Link>
              </Tooltip>
              {csrComplaint.status !== "Cancel" &&
              csrComplaint.status !== "Pending Cancel" ? (
                <Link className="text-success" to="#">
                  <Tooltip title="Update">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={e =>
                        this.handlePaymentStatusClick(e, csrComplaint)
                      }
                    ></i>
                  </Tooltip>
                </Link>
              ) : null}

              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/csr-notes-list/${csrComplaint.id}`}
                ></Link>
              </Tooltip>
              {csrComplaint.payment_method == "Cash" &&
              csrComplaint.payment_status == "Not Paid" ? (
              <Tooltip title="Edit Appointments">
                <Link
                  className="mdi mdi-pencil font-size-18"
                  to={`/reduce-tests/${csrComplaint.id}`}
                ></Link>
              </Tooltip>
               ) : null}
            </div>
          ),
        },
      ],
    };
    this.handlePaymentStatusClick = this.handlePaymentStatusClick.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleLabModal = this.toggleLabModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  // componentDidMount() {
  //   const { onGetCsrComplaints,csrComplaints } = this.props;
  //   const { startDate, endDate, user_id } = this.state;
  //   // Ensure dates are properly formatted before sending
  //   onGetCsrComplaints(user_id, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  //   // this.setState({ csrComplaints });
  //   console.log("datassss", startDate,endDate, csrComplaints)
  // }
  componentDidMount() {
    const { onGetCsrComplaints, csrComplaints } = this.props;
    const { startDate, endDate, user_id } = this.state;
  
    console.log("Formatted Dates:", startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
  
    if (startDate && endDate) {
      onGetCsrComplaints(user_id, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    } else {
      console.error('StartDate or EndDate is undefined');
    }
    
    this.setState({ csrComplaints });
    console.log("datassss", startDate, endDate, csrComplaints);
  }
  

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,

      patient_phone: arg.patient_phone,
      patient_city: arg.City,
    });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText1 === "Copy"
      ? this.setState({ btnText1: "Copied" })
      : this.setState({ btnText1: "Copy" });
  };
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,

      lab_phone: arg.lab_phone,
      lab_city: arg.lab_city,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      LabModal: false,
      isHovered: false,
    });
  };
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  componentDidUpdate(prevProps, prevState) {
    const { onGetCsrComplaints, csrComplaints } = this.props;
    const { startDate, endDate, user_id } = this.state;
  
    // Fetch data if dates change
    if (prevState.startDate !== startDate || prevState.endDate !== endDate) {
      onGetCsrComplaints(user_id, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]);
    }
  
    // Update state if the csrComplaints data has changed
    if (!isEmpty(csrComplaints) && size(prevProps.csrComplaints) !== size(csrComplaints)) {
      this.setState({ csrComplaints });
    }
  }
  handleDateChange = (date, field) => {
    this.setState({ [field]: date });
  };
  
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
    this.setState({
      csrComplaint: {
        id: arg.id,
        // cleared_at: arg.cleared_at,
        appointment_requested_at: arg.appointment_requested_at,
        status: arg.status,
        payment_status: arg.payment_status,
        payment_method: arg.payment_method,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { startDate, endDate } = this.state;
    
    const { SearchBar } = Search;

    const { csrComplaints } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCsrComplaints, onGetCsrComplaints } = this.props;
    const csrComplaint = this.state.csrComplaint;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: csrComplaints.length, // replace later with size(csrComplaints),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
 // Ensure csrComplaints is an array and has data

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>All Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="All Appointments" />
            <Row>
              <p className="text-danger">
                Note: This page will show all Complaints within the selected date range.
              </p>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={date => this.handleDateChange(date, 'startDate')}
                    className="form-control"
                    dateFormat="d MMM yyyy"
                  />
                </div>
              </Col>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={date => this.handleDateChange(date, 'endDate')}
                    className="form-control"
                    dateFormat="d MMM yyyy"
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentOutStatusListColumns}
                      data={csrComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentOutStatusListColumns}
                          data={csrComplaints}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleLabModal}
                                        tag="h4"
                                      >
                                        <span>Lab Details: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state.lab_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span>Patient Details: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state
                                                            .patient_phone
                                                        );
                                                        this.setState({
                                                          btnText1: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText1}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Appointment"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            appointment_requested_at:
                                              (this.state.csrComplaint &&
                                                this.state.csrComplaint
                                                  .appointment_requested_at) ||
                                              "",
                                            status:
                                              (this.state.csrComplaint &&
                                                this.state.csrComplaint
                                                  .status) ||
                                              "",
                                            payment_status:
                                              (this.state.csrComplaint &&
                                                this.state.csrComplaint
                                                  .payment_status) ||
                                              "",
                                            payment_method:
                                              (this.state.csrComplaint &&
                                                this.state.csrComplaint
                                                  .payment_method) ||
                                              "",
                                            appointment_option:
                                              (this.state &&
                                                this.state
                                                  .appointment_option) ||
                                              "",
                                            comments:
                                              (this.state &&
                                                this.state.comments) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                          })}
                                          onSubmit={values => {
                                            const updateCsrComplaints = {
                                              id: csrComplaint.id,
                                              appointment_requested_at:
                                                values.appointment_requested_at,
                                              appointment_option:
                                                values.appointment_option,
                                              comments: values.comments,
                                              staff: this.state.user_id,
                                            };

                                            // update PaymentStatus
                                            onUpdateCsrComplaints(
                                              updateCsrComplaints
                                            );
                                            setTimeout(() => {
                                              onGetCsrComplaints(
                                                this.state.user_id, 
                                                this.state.startDate.toISOString().split('T')[0], 
                                                this.state.endDate.toISOString().split('T')[0]
                                              );
                                            }, 1000);
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
                                                  {this.state
                                                    .appointment_option ==
                                                    "Cancel" &&
                                                  csrComplaint.status ===
                                                    "Confirmed" &&
                                                  csrComplaint.payment_method ===
                                                    "Cash" &&
                                                  csrComplaint.payment_status ===
                                                    "Paid" ? (
                                                    <p>
                                                      <span className="text-danger bold">
                                                        Alert: The appointment
                                                        is confirmed, and the
                                                        cash has been received
                                                        by the lab. Before
                                                        canceling the
                                                        appointment, please make
                                                        sure to confirm the
                                                        refund payment with the
                                                        patient.
                                                      </span>
                                                    </p>
                                                  ) : null}
                                                  {(csrComplaint.status ===
                                                    "Pending" ||
                                                    csrComplaint.status ===
                                                      "Confirmed") &&
                                                  (csrComplaint.payment_status ===
                                                    "Not Paid" ||
                                                    csrComplaint.payment_status ===
                                                      "Allocate" ||
                                                    csrComplaint.payment_status ===
                                                      "Paid") ? (
                                                    <div className="mb-3">
                                                      <Label
                                                        for="appointment_option"
                                                        className="form-label"
                                                      >
                                                        Select
                                                      </Label>
                                                      <Field
                                                        name="appointment_option"
                                                        component="select"
                                                        onChange={e =>
                                                          this.setState({
                                                            appointment_option:
                                                              e.target.value,
                                                          })
                                                        }
                                                        value={
                                                          this.state
                                                            .appointment_option
                                                        }
                                                        className="form-select"
                                                      >
                                                        <option value="">
                                                          --- Please Select---
                                                        </option>
                                                        <option value="Change">
                                                          Appointment Request
                                                          Time by Patient
                                                        </option>
                                                        <option value="Cancel">
                                                          Appointment
                                                          Cancellation Request
                                                        </option>
                                                      </Field>
                                                    </div>
                                                  ) : csrComplaint.status ===
                                                      "Confirmed" &&
                                                    csrComplaint.payment_method ===
                                                      "Cash" &&
                                                    csrComplaint.payment_status ===
                                                      "Paid" ? (
                                                    <div className="mb-3">
                                                      {/* <p><span className="text-danger">Note: The appointment is confirmed, and the cash has been received by the lab. Before canceling the appointment, please make sure to confirm the refund payment with the patient.</span></p> */}

                                                      <Label
                                                        for="appointment_option"
                                                        className="form-label"
                                                      >
                                                        Select
                                                      </Label>
                                                      <Field
                                                        name="appointment_option"
                                                        component="select"
                                                        onChange={e =>
                                                          this.setState({
                                                            appointment_option:
                                                              e.target.value,
                                                          })
                                                        }
                                                        value={
                                                          this.state
                                                            .appointment_option
                                                        }
                                                        className="form-select"
                                                      >
                                                        <option value="">
                                                          --- Please Select---
                                                        </option>
                                                        <option value="Change">
                                                          Appointment Request
                                                          Time by Patient
                                                        </option>
                                                        <option
                                                          value="Cancel"
                                                          className="text-danger"
                                                        >
                                                          Appointment
                                                          Cancellation Request
                                                        </option>
                                                      </Field>
                                                    </div>
                                                  ) : (
                                                    <div className="mb-3">
                                                      <Label
                                                        for="appointment_option"
                                                        className="form-label"
                                                      >
                                                        Select
                                                      </Label>
                                                      <Field
                                                        name="appointment_option"
                                                        component="select"
                                                        onChange={e =>
                                                          this.setState({
                                                            appointment_option:
                                                              e.target.value,
                                                          })
                                                        }
                                                        value={
                                                          this.state
                                                            .appointment_option
                                                        }
                                                        className="form-select"
                                                      >
                                                        {/* <option value="">
                                                        --- Please Select---
                                                      </option> */}
                                                        <option value="Change">
                                                          Appointment Request
                                                          Time by Patient
                                                        </option>
                                                        {/* <option value="Cancel">
                                                        Appointment Cancellation Request
                                                      </option> */}
                                                      </Field>
                                                    </div>
                                                  )}
                                                  {/* payments out pending clearence field */}
                                                  {this.state
                                                    .appointment_option ==
                                                  "Change" ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Appointment Requesed
                                                        Time
                                                      </Label>
                                                      <input
                                                        name="appointment_requested_at"
                                                        type="datetime-local"
                                                        min={new Date(
                                                          new Date()
                                                            .toString()
                                                            .split("GMT")[0] +
                                                            " UTC"
                                                        )
                                                          .toISOString()
                                                          .slice(0, -8)}
                                                        className="form-control"
                                                        onChange={e => {
                                                          this.setState({
                                                            csrComplaint: {
                                                              id: csrComplaint.id,
                                                              appointment_requested_at:
                                                                e.target.value,
                                                            },
                                                          });
                                                        }}
                                                      />
                                                    </div>
                                                  ) : null}

                                                  {this.state
                                                    .appointment_option ==
                                                  "Cancel" ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        <b>Comment</b>
                                                      </Label>
                                                      <Field
                                                        name="comments"
                                                        as="textarea"
                                                        rows="2"
                                                        cols="20"
                                                        className={
                                                          "form-control" +
                                                          (errors.comments &&
                                                          touched.comments
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.comments
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            comments:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="comments"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  ) : null}
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
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row>
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

csrComplaints.propTypes = {
  match: PropTypes.object,
  csrComplaints: PropTypes.array,
  className: PropTypes.any,
  onGetCsrComplaints: PropTypes.func,
  onUpdateCsrComplaints: PropTypes.func,
};

const mapStateToProps = ({ csrcomplaints }) => ({
  csrComplaints: csrcomplaints.csrComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // onGetCsrComplaints: id => dispatch(getCsrComplaints(id)),
  onGetCsrComplaints: (id, startDate, endDate) => dispatch(getCsrComplaints(id, startDate, endDate)),
  onUpdateCsrComplaints: csrComplaint =>
    dispatch(updateCsrComplaints(csrComplaint)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(csrComplaints));
