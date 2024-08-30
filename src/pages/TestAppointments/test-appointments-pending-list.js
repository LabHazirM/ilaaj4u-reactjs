import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  FormGroup,
} from "reactstrap";
import Flatpickr from 'react-flatpickr';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import Tooltip from "@material-ui/core/Tooltip";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getTestAppointmentsPendingList,
  updateTestAppointment,
  addNewCollectionPointTestAppointment,
  getLabProfile,
} from "store/test-appointments/actions";

import { updatePaymentInfo } from "store/invoices/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class TestAppointmentsPendingList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    const now = moment();

    this.state = {
      testAppointments: [],
      labProfiles: [],
      testAppointment: "",
      main_lab_appointments: "Main",
      end_date: now.clone().endOf('month').format('DD MMM YYYY'),
      start_date: now.clone().startOf('month').format('DD MMM YYYY'),
      modal: false,
      btnText: "Copy",
      confirmModal: false,
      appointmentmodal: false,
      appointmentId: "",
      type: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, testAppointment) => (
            <>{testAppointment.id}</>
          ),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <strong>{testAppointment.order_id}</strong>
              <br></br>
              {/* <strong>
                {testAppointment.type}{" ("}
                {testAppointment.address}{")"}
              </strong> */}
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "address",
          text: "Lab Address",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <span
              style={{
                width: "200px", // Set your desired width here
                fontSize: "14px",

                textOverflow: "ellipsis",
                whiteSpace: "prewrap",
                textAlign: "left", // Align text to the left
                display: "block",
              }}
            >
              {testAppointment.address}
            </span>
          ),
          filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Patient name",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <Tooltip title="Patient Info">
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, testAppointment)}
                    // onMouseEnter={e => this.openPatientModal(e, testAppointment)}
                    // onPointerLeave={this.handleMouseExit()}
                  >
                    {testAppointment.patient_name}
                  </Link>
                </Tooltip>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "booked_at",
          text: "Booked at",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {/* {new Date(testAppointment.booked_at).toLocaleString("en-US")} */}
                {moment(testAppointment.booked_at).format(
                  "DD MMM YYYY, h:mm A"
                )}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "appointment_requested_at",
          text: "Sampling time by Patient",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {/* {new Date(
                  testAppointment.appointment_requested_at
                ).toLocaleString("en-US")} */}
                {moment(testAppointment.appointment_requested_at).format(
                  "DD MMM YYYY, h:mm A"
                )}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed == true ||
              testAppointment.is_state_sampling_availed == true ? (
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
        // {
        //   dataField: "is_state_sampling_availed",
        //   text: "Urgent sampling",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.is_state_sampling_availed == true ? (
        //         <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning blinking-text">Yes</span>
        //       ) : (
        //         <span>No</span>
        //       )}
        //       <style>
        //   {`
        //     .blinking-text {
        //       animation: blinking 1s infinite;
        //     }

        //     @keyframes blinking {
        //       0% {
        //         opacity: 1;
        //       }
        //       50% {
        //         opacity: 0;
        //       }
        //       100% {
        //         opacity: 1;
        //       }
        //     }
        //   `}
        // </style>
        //     </>
        //   ),
        //   filter: selectFilter({
        //     options: {
        //       '': 'All',
        //       'true': 'Yes',
        //       'false': 'No',
        //     },
        //     defaultValue: 'All',
        //   }),
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, testAppointment) => (
            <div className="d-flex gap-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() =>
                      this.handleTestAppointmentClick(testAppointment)
                    }
                  ></i>
                </Link>
              </Tooltip>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/lab-note-list/${testAppointment.id}`}
                ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.handleTestAppointmentClick =
      this.handleTestAppointmentClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTestAppointmentClicks =
      this.handleTestAppointmentClicks.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleappointmentmodal = this.toggleappointmentmodal.bind(this);
  }
  
  componentDidMount() {
    const { testAppointments, onAddNewCollectionPointTestAppointment, onGetTestAppointmentsPendingList, onGetLabProfile } = this.props;
    const user_id = this.state.user_id; // Use state to get user_id

    // Fetch the test appointments
    onGetTestAppointmentsPendingList(user_id);

    // Fetch lab profiles
    onGetLabProfile(user_id);
  }
  componentDidUpdate(prevProps) {
    // Check if labProfiles.type has changed
    if (prevProps.labProfiles.type !== this.props.labProfiles.type) {
      // Update the state based on the new labProfiles.type
      // const newLabType = this.props.labProfiles.type === "Collection Point" ? "Collection" : "Main";
      // this.setState({ main_lab_appointments: newLabType }, () => {
        const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsPendingList } = this.props;
        const { start_date, end_date, main_lab_appointments, user_id } = this.state;
        const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
        
        // API call with updated dates and lab type
        onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
        setTimeout(() => {
          onGetTestAppointmentsPendingList(user_id);
        }, 1000);
      // });
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  toggleappointmentmodal = () => {
    this.setState(prevState => ({
      appointmentmodal: !prevState.appointmentmodal,
    }));
  };
  rowStyleFormat = (row, rowIdx) => {
    if (row.is_state_sampling_availed === true) {
      return { color: "red" };
    }
  };
  toggleConfirmModal = () => {
    this.setState(prevState => ({
      confirmModal: !prevState.confirmModal,
    }));
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_age: arg.patient_age,
      ageFormat: arg.ageFormat,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     isHovered: false,

  //   });
  // };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  handleTestAppointmentClicks = () => {
    this.setState({ testAppointment: "" });
    this.toggle();
  };

  onClickAccept = id => {
    this.setState({ appointmentId: id });
    this.setState({ confirmModal: true });
  };

  handeAcceptPayment = () => {
    const { onGetTestAppointmentsPendingList, onUpdatePaymentInfo } =
      this.props;

    onUpdatePaymentInfo(this.state.appointmentId); // Calling Payment API to update the payment info when payment is accepted by lab

    setTimeout(() => {
      onGetTestAppointmentsPendingList(this.state.user_id);
    }, 1000);

    this.setState({ confirmModal: false });
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
  handleTestAppointmentClick = arg => {
    const testAppointment = arg;

    this.setState({
      testAppointment: {
        id: testAppointment.id,
        estimated_sample_collection_at:
          testAppointment.estimated_sample_collection_at,
        appointment_requested_at: testAppointment.appointment_requested_at,
      },
    });

    this.toggle();
  };


  handleDateChange(date, field) {
    this.setState({ [field]: moment(date).format('DD MMM YYYY') }, () => {
      // Make the API call after the state has been updated
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsPendingList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      
      // API call with updated dates and lab type
      onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
      setTimeout(() => {
        onGetTestAppointmentsPendingList(this.state.user_id);
      }, 1000);
    });
  }

  handleTestAppointmentType = e => {
    const { value } = e.target;
    this.setState({ main_lab_appointments: value }, () => {
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsPendingList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
      setTimeout(() => {
        onGetTestAppointmentsPendingList(this.state.user_id);
      }, 1000);

    });
  };
  

  render() {
    const { SearchBar } = Search;
    const { start_date, end_date } = this.state.testAppointments;
    const { testAppointments, labProfiles } = this.props;
    const { confirmModal } = this.state;

    const {
      onGetLabProfile,
      onAddNewCollectionPointTestAppointment,
      onUpdateTestAppointment,
      onGetTestAppointmentsPendingList,
    } = this.props;
    const testAppointment = this.state.testAppointment;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: testAppointments.length, // replace later with size(testAppointments),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Test Appointments List</title>
          </MetaTags>
          <ConfirmModal
            show={this.state.confirmModal}
            onConfirmClick={this.handeAcceptPayment}
            onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="Pending Appointments List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testAppointmentListColumns}
                      data={testAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testAppointmentListColumns}
                          data={testAppointments}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              <Row>
                              <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>Start Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.start_date
                            }}
                            onChange={date => this.handleDateChange(date[0], 'start_date')}
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>End Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.end_date
                            }}
                            onChange={date => this.handleDateChange(date[0], 'end_date')}
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="4">
                                <div className="ms-2 mb-4">
                                    <div className="position-relative">
                                    {this.props.labProfiles.type === "Main Lab" && (
                                    <div>
                                      <Label for="main_lab_appointments" className="form-label">
                                      <strong>Search By Lab Type</strong>
                                      </Label>
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleTestAppointmentType}
                                        
                                      >
                                        <option value="Main">Main</option>
                                        <option value="Collection">Collection</option>
                                        <option value="Both">Both</option>
                                      </select>
                                      <p className="text-danger font-size-10">Filter all completed appointments at your collection points.</p>

                                    </div>
                                  )}
                                    </div>
                                  </div>
                                  {/* {this.props.labProfiles.type === "Collection Point" && (
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>)} */}
                                </Col>
      </Row>
      </Row>
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
                                      rowStyle={this.rowStyleFormat}
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.appointmentmodal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
                                      centered
                                      // onPointerLeave={this.handleMouseExit}

                                      toggle={this.toggleappointmentmodal}
                                    >
                                      <div className="modal-content">
                                        <div className="modal-header border-bottom-0">
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                appointmentmodal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="text-center mb-4">
                                            <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light  rounded-circle text-primary h1">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div>

                                            <div className="row justify-content-center">
                                              <div className="col-xl-10">
                                                <h4 className="text-primary">
                                                  New Orders !
                                                </h4>
                                                <p className="text-muted font-size-14 mb-4">
                                                  You have new orders, Kindly
                                                  Check the Pending Appointment
                                                  list..
                                                </p>

                                                {/* <div className="input-group  rounded bg-light"  >
                      <Input type="email" className="form-control bg-transparent border-0" placeholder="Enter Email address" />
                      <Button color="primary" type="button" id="button-addon2">
                        <i className="bx bxs-paper-plane"></i>
                      </Button>

                    </div> */}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span>Patient Information</span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Age
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={`${this.state.patient_age} ${this.state.ageFormat}`}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                {this.state.patient_address &&
                                                this.state.patient_address !==
                                                  "undefined" ? (
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Address
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .patient_address
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                ) : null}

                                                {/* <div className="mb-3 row">
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
                                                </div> */}

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
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        <span>Appointment Confirmation</span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            patient_id:
                                              (testAppointment &&
                                                testAppointment.patient_id) ||
                                              "",
                                            patient_name:
                                              (testAppointment &&
                                                testAppointment.patient_name) ||
                                              "",
                                            patient_age:
                                              (testAppointment &&
                                                testAppointment.patient_age) ||
                                              "",
                                            patient_gender:
                                              (testAppointment &&
                                                testAppointment.patient_gender) ||
                                              "",
                                            booked_at:
                                              (testAppointment &&
                                                testAppointment.booked_at) ||
                                              "",
                                            appointment_requested_at:
                                              (testAppointment &&
                                                testAppointment.appointment_requested_at) ||
                                              "",
                                            estimated_sample_collection_at:
                                              (testAppointment &&
                                                testAppointment.estimated_sample_collection_at) ||
                                              "",
                                            // estimated_result_uploading_at:
                                            //   (testAppointment &&
                                            //     testAppointment.estimated_result_uploading_at) ||
                                            //   "",
                                            // patient_unique_id:
                                            //   (testAppointment &&
                                            //     testAppointment.patient_unique_id) ||
                                            //   "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            estimated_sample_collection_at:
                                              Yup.string().required(
                                                "Please select sample collection date time"
                                              ),
                                            // estimated_result_uploading_at:
                                            //   Yup.string().required(
                                            //     "Please select result upload date time"
                                            //   ),
                                            // patient_unique_id:
                                            //   Yup.string().required(
                                            //     "Please enter patient unique id"
                                            //   ),
                                          })}
                                          onSubmit={values => {
                                            const updateTestAppointment = {
                                              id: testAppointment.id,
                                              estimated_sample_collection_at:
                                                values.estimated_sample_collection_at,
                                              // estimated_result_uploading_at:
                                              //   values.estimated_result_uploading_at,
                                              status: "Confirmed",
                                              process: "pending",
                                            };

                                            // update TestAppointment
                                            onUpdateTestAppointment(
                                              updateTestAppointment
                                            );

                                            setTimeout(() => {
                                              onGetTestAppointmentsPendingList(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient name
                                                    </Label>
                                                    <Field
                                                      name="patient_name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient age
                                                    </Label>
                                                    <Field
                                                      name="patient_age"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_age
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient gender
                                                    </Label>
                                                    <Field
                                                      name="patient_gender"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .testAppointment
                                                          .patient_gender
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Booked at
                                                    </Label>
                                                    <input
                                                      name="booked_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.booked_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Booked for
                                                    </Label>
                                                    <input
                                                      name="appointment_requested_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.appointment_requested_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  <div className="mb-3">
                                                    <Label for="estimated_sample_collection_at">
                                                      Please select date and
                                                      time for sample collection
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="estimated_sample_collection_at"
                                                      name="estimated_sample_collection_at"
                                                      min={
                                                        testAppointment.appointment_requested_at
                                                          ? testAppointment.appointment_requested_at.slice(
                                                              0,
                                                              16
                                                            )
                                                          : ""
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            estimated_sample_collection_at:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.estimated_sample_collection_at &&
                                                        touched.estimated_sample_collection_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="estimated_sample_collection_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* <div className="mb-3">
                                                    <Label
                                                      for="Estimated result uploading
                                                      at"
                                                    >
                                                      Estimated result uploading
                                                      at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Estimated result uploading
                                                      at"
                                                      name="Estimated result uploading
                                                      at"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            estimated_sample_collection_at:
                                                              testAppointment.estimated_sample_collection_at,
                                                            estimated_result_uploading_at:
                                                              e.target.value +
                                                              ":00Z",
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.estimated_result_uploading_at &&
                                                        touched.estimated_result_uploading_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="estimated_result_uploading_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient Unique ID
                                                      (optional)
                                                    </Label>
                                                    <input
                                                      name="patient_unique_id"
                                                      type="text"
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            patient_id:
                                                              testAppointment.patient_id,
                                                            patient_name:
                                                              testAppointment.patient_name,
                                                            patient_age:
                                                              testAppointment.patient_age,
                                                            patient_gender:
                                                              testAppointment.patient_gender,
                                                            booked_at:
                                                              testAppointment.booked_at,
                                                            appointment_requested_at:
                                                              testAppointment.appointment_requested_at,
                                                            estimated_sample_collection_at:
                                                              testAppointment.estimated_sample_collection_at,
                                                            estimated_result_uploading_at:
                                                              testAppointment.estimated_result_uploading_at,
                                                            patient_unique_id:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.patient_unique_id &&
                                                        touched.patient_unique_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="patient_unique_id"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}
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

TestAppointmentsPendingList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  labProfiles: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsPendingList: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
  onUpdatePaymentInfo: PropTypes.func,
  onAddNewCollectionPointTestAppointment: PropTypes.func,
  onGetLabProfile: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointmentsPendingList,
  labProfiles: testAppointments.labProfiles,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsPendingList: id =>
    dispatch(getTestAppointmentsPendingList(id)),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
  onAddNewCollectionPointTestAppointment: (testAppointment, id) =>
    dispatch(addNewCollectionPointTestAppointment(testAppointment, id)),
  onUpdatePaymentInfo: id => dispatch(updatePaymentInfo(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsPendingList));
