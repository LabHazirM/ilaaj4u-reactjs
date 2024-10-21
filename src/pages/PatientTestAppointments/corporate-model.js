import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";
import { isEmpty, size } from "lodash";
import moment from 'moment';

import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Tooltip from "@material-ui/core/Tooltip";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import RatingTooltip from "react-rating-tooltip";
import { getPatientTestAppointmentsList } from "store/patient-test-appointments/actions";
import { addNewPatientFeedback } from "store/patient-feedback/actions";
import { updateTestAppointment } from "store/test-appointments/actions";
import { getPatientProfile } from "store/labmarket/actions";
import DeleteModal from "components/Common/DeleteModal";


import "assets/scss/table.scss";

class TestAppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patientTestAppointments: [],
      btnText: "Copy",
      id: "",
      reschedule_reason: "",
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      patientTestAppointment: "",
      patientProfile: [],
      PermissionModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      patientTestAppointmentListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>{patientTestAppointment.id}</>
          ),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,

          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
                <Link
                  to="#"
                  onClick={e => this.openPatientModal(e, patientTestAppointment)}
                // onMouseEnter={e => this.openPatientModal(e, patientTestAppointment)}
                // onPointerLeave={this.handleMouseExit()}
                >
                  {patientTestAppointment.order_id}
                </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "patient_unique_id",
        //   text: "Patient ID",
        //   sort: true,
        // },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <Link
                  to="#"
                  onClick={e => this.openPatientModal2(e, testAppointment)}
                // onMouseEnter={e => this.openPatientModal2(e, testAppointment)}
                // onPointerLeave={this.handleMouseExit()}
                >
                  {testAppointment.patient_name}
                </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "lab_name",
        //   text: "Lab Name",
        //   sort: true,
        // },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <Link to="#"
                  //  onClick={e => this.openLabModal(e, testAppointment)}
                  onMouseEnter={e => this.openLabModal(e, testAppointment)}
                >
                  {testAppointment.lab_name}
                </Link>
              </span>
            </>
          ),
        },
        // {
        //   dataField: "patient_district",
        //   text: "District",
        //   sort: true,
        // },
        // {
        //   dataField: "booked_at",
        //   text: "Booked at",
        //   sort: true,
        //   formatter: (cellContent, patientTestAppointment) => (
        //     <>
        //       <span>
        //         {new Date(patientTestAppointment.booked_at).toLocaleString(
        //           "en-US"
        //         )}
        //       </span>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "appointment_requested_at",
        //   text: "Schedule time by Patient",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         {new Date(
        //           testAppointment.appointment_requested_at
        //         ).toLocaleString("en-US")}
        //       </span>
        //     </>
        //   ),
        // },
        {
          dataField: "is_home_sampling_availed",
          text: "Home Sampling",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed == true || testAppointment.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
              {/* {testAppointment.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )} */}
            </>
          ),
          // filter: selectFilter({
          //   options: {
          //     '': 'All',
          //     'true': 'Yes',
          //     'false': 'No',
          //   },
          //   defaultValue: 'All',
          // }),
        },
        {
          dataField: "estimated_sample_collection_at",
          text: "Sampling time by Lab",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>--</span>
              ) : (
                <span>
                  {/* {new Date(
                    patientTestAppointment.estimated_sample_collection_at
                  ).toLocaleString("en-US")} */}
                  {patientTestAppointment.estimated_sample_collection_at
                    ? moment(patientTestAppointment.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
                    : "--"}
                </span>
              )}
            </>
          ),
        },

        // {
        //   dataField: "sample_collected_at",
        //   text: "Sample collected at",
        //   sort: true,
        //   formatter: (cellContent, patientTestAppointment) => (
        //     <>
        //       {patientTestAppointment.status == "Pending" ||
        //       patientTestAppointment.status == "Confirmed" ||
        //       patientTestAppointment.status == "Rescheduled" ? (
        //         <span>Not available yet</span>
        //       ) : (
        //         <span>
        //           {new Date(
        //             patientTestAppointment.sample_collected_at
        //           ).toLocaleString("en-US")}
        //         </span>
        //       )}
        //     </>
        //   ),
        // },

        {
          dataField: "collection_status",
          text: "Sampling Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {(testAppointment.is_home_sampling_availed || testAppointment.is_state_sampling_availed) &&
                  !testAppointment.collector_name ? (
                  <span >

                  </span>
                ) : (
                  <span>{testAppointment.collector_name}</span>
                )}
                {(testAppointment.is_home_sampling_availed || testAppointment.is_state_sampling_availed) &&
                  !testAppointment.collection_status ? (
                  <span>
                    --
                  </span>
                ) : testAppointment.collection_status == "Assigned" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
                    {testAppointment.collection_status}
                  </span>
                ) : testAppointment.collection_status == "On way" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                    {testAppointment.collection_status}
                  </span>
                ) : testAppointment.collection_status == "Reached" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                    {testAppointment.collection_status}
                  </span>
                ) : testAppointment.collection_status == "Patient Unavailable" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {testAppointment.collection_status}
                  </span>
                ) : testAppointment.collection_status == "Sample+Payment Collected" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                    {testAppointment.collection_status}
                  </span>
                ) : testAppointment.collection_status == "Sample+Payment Delivered" && (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                    {testAppointment.collection_status}
                  </span>
                )}

                {!testAppointment.is_home_sampling_availed &&
                  !testAppointment.is_state_sampling_availed && (
                    <span>
                      --
                    </span>
                  )}
              </span>
            </>
          ),
        },

        // {
        //   dataField: "reschedule_count",
        //   text: "Reschedule Limit",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.reschedule_count > 1 && (
        //         <span className="text-danger">
        //           {testAppointment.reschedule_count} Used, Limit Reached
        //         </span>
        //       )}

        //       {(!testAppointment.reschedule_reason ||
        //         testAppointment.reschedule_count < 2) && (
        //         <span className="text-info">
        //           {testAppointment.reschedule_count} Used,{" "}
        //           {2 - testAppointment.reschedule_count} Left
        //         </span>
        //       )}
        //     </>
        //   ),
        // },
        // {
        //   dataField: "reschedule_reason",
        //   text: "Rescheduling Reason",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.reschedule_reason &&
        //         testAppointment.reschedule_reason == "Other" && (
        //           <Link
        //             className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger"
        //             to="#"
        //             onClick={e => this.openReasonModal(e, testAppointment)}
        //           >
        //             {testAppointment.reason.slice(0, 10) + "..."}
        //           </Link>
        //         )}

        //       {testAppointment.reschedule_reason &&
        //         testAppointment.reschedule_reason != "Other" && (
        //           <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
        //             {testAppointment.reschedule_reason}
        //           </span>
        //         )}

        //       {!testAppointment.reschedule_reason && (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
        //           Not Rescheduled
        //         </span>
        //       )}
        //       {/* <Link
        //         to="#"
        //         onClick={e => this.openMessageModal(e, testAppointment)}
        //       >
        //         {testAppointment.reschedule_reason.slice(0, 10) + "..."}
        //       </Link>{" "} */}
        //     </>
        //   ),
        // },
        // {
        //   dataField: "reschedule",
        //   text: "Rescheduling option",
        //   isDummyField: true,
        //   editable: false,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.reschedule_count < 2 &&
        //         testAppointment.is_home_sampling_availed &&
        //         testAppointment.collection_status == "Patient Unavailable" && (
        //           <Link
        //             className="btn btn-primary btn-rounded font-size-10"
        //             to="#"
        //             onClick={e =>
        //               this.handleReschedulingClick(e, testAppointment.id)
        //             }
        //           >
        //             Reschedule
        //           </Link>
        //         )}

        //       {testAppointment.reschedule_count >= 2 &&
        //         testAppointment.is_home_sampling_availed && (
        //           <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
        //             Limit Exceeded
        //           </span>
        //         )}

        //       {(!testAppointment.is_home_sampling_availed ||
        //         (testAppointment.reschedule_count < 2 &&
        //           testAppointment.is_home_sampling_availed &&
        //           testAppointment.collection_status !=
        //             "Patient Unavailable")) && (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //           Not available
        //         </span>
        //       )}
        //     </>
        //   ),
        // },

        {
          dataField: "status",
          text: "Appointment Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-primary">
                  {testAppointment.status}
                </span>
              )}
              {testAppointment.status == "Cancel" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {testAppointment.status}
                </span>
              )}
               {testAppointment.status == "Pending Cancel" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {testAppointment.status}
                </span>
              )}
              {testAppointment.status == "Confirmed" && (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Sample Collected" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {testAppointment.status}
                </span>
              )}

              {testAppointment.status == "Rescheduled" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {testAppointment.status}

                </span>
              )}

              {testAppointment.status == "Result Uploaded" && (
                <span className="badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {testAppointment.status}
                </span>
              )}
            </>
          ),
        },
        // {
        //   dataField: "result_uploaded_at",
        //   text: "Result uploaded at",
        //   sort: true,
        //   formatter: (cellContent, patientTestAppointment) => (
        //     <>
        //       {patientTestAppointment.status != "Result Uploaded" ? (
        //         <span>Not available yet</span>
        //       ) : (
        //         <span>
        //           {new Date(
        //             patientTestAppointment.result_uploaded_at
        //           ).toLocaleString("en-US")}
        //         </span>
        //       )}
        //     </>
        //   ),
        // },
        // {
        //   dataField: "dues",
        //   text: "Dues",
        //   sort: true,
        // },
        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.payment_status == "Not Paid" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              ) : (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "estimated_result_uploading_at",
          text: "Reporting Time by Lab",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ? (
                <span>--</span>
              ) : (
                <span>
                  {/* {new Date(
                    patientTestAppointment.estimated_result_uploading_at
                  ).toLocaleString("en-US")} */}
                  {patientTestAppointment.estimated_result_uploading_at
                    ? moment(patientTestAppointment.estimated_result_uploading_at).format("DD MMM YYYY, h:mm A")
                    : "--"}
                </span>
              )}
            </>
          ),
        },
        {
          dataField: process.env.REACT_APP_BACKENDURL + "result",
          text: "Report",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status === "Result Uploaded" &&
                (patientTestAppointment.result_type === "File" || patientTestAppointment.result_type === "Link") ? (
                <button
                  className="btn btn-link"
                  onClick={() => this.downloadFile(process.env.REACT_APP_BACKENDURL + patientTestAppointment.result)}
                >
                  <i className="mdi mdi-download font-size-14" id="edittooltip"></i> Report
                </button>
              ) : (
                <span>--</span>
              )}
            </>
          ),
        },

        {
          dataField: "collector_name",
          text: "Collector Detail",
          sort: true,
          formatter: (cellContent, testAppointment, patientTestAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed &&
                !testAppointment.collector_name && (
                  <span>
                    --
                  </span>
                )}

              {testAppointment.is_home_sampling_availed &&
                testAppointment.collector_name && (
                  <Tooltip title="Sample Collector Details">

                    <Link
                      to="#"
                      onClick={e => this.openCollectorModal(e, testAppointment)}
                    >
                      <i className="mdi mdi-eye font-size-14"></i> View
                    </Link>
                  </Tooltip>
                )}

              {!testAppointment.is_home_sampling_availed && (
                <span>
                  --
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "invoice",
          text: "Actions",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, patientTestAppointment, testAppointment) => (
            <>
              <div>
                <Tooltip title="Feedback">
                  {patientTestAppointment.status == "Result Uploaded" &&
                    !patientTestAppointment.does_feedback_exist ? (
                    <Link
                      className="text-warning font-size-12"
                      to="#"
                      onClick={e =>
                        this.handlePatientFeedbackClick(
                          e,
                          patientTestAppointment.id
                        )
                      }
                    >
                      <i className="bx bxs-star font-size-14"></i>
                    </Link>
                  ) : patientTestAppointment.status == "Result Uploaded" &&
                    patientTestAppointment.does_feedback_exist ? (
                    <span className="text-success font-size-12">
                      <i className="bx bxs-happy-alt font-size-14"></i>
                    </span>
                  ) : (
                    <span className="text-secondary font-size-12">
                      {/* <i className="bx bxs-star font-size-14"></i>  */}
                    </span>
                  )}
                </Tooltip>
                <Tooltip title="Reschedual Appoitment Info">

                  {patientTestAppointment.reschedule_count == 0 ? (
                    <span className="text-secondary font-size-12">
                    </span>
                  ) : <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-calendar-clock font-size-18"
                      id="edittooltip"
                      onClick={e => this.openReshedualModal(e, patientTestAppointment)
                      }
                    ></i>
                  </Link>}
                </Tooltip>

                {patientTestAppointment.payment_status === "Not Paid" ? (
                  <Tooltip title="Appointment Detail">
                    <Link
                      className="mdi mdi-receipt font-size-18"
                      to={`/patient-appointment-detail/${patientTestAppointment.id}`}
                    ></Link>
                  </Tooltip>
                ) : (
                  <Tooltip title="Invoice Detail">
                    <Link
                      className="mdi mdi-receipt font-size-18"
                      to={`/invoice-detail/${patientTestAppointment.id}`}
                    ></Link>
                  </Tooltip>
                )}
                <Tooltip title="Add Comment">
                  <Link
                    className="fas fa-comment font-size-18"
                    to={`/csr-patient-notes-list/${patientTestAppointment.id}`}
                  ></Link>
                </Tooltip>


              </div>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleCollectorModal = this.toggleCollectorModal.bind(this);
    this.toggleReschedulingModal = this.toggleReschedulingModal.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.togglePatientModal2 = this.togglePatientModal2.bind(this);
    this.togglecancelModal = this.togglecancelModal.bind(this);
    this.toggleReshedualModal = this.toggleReshedualModal.bind(this);
    this.toggleLabModal = this.toggleLabModal.bind(this);
    this.togglePermissionModal = this.togglePermissionModal.bind(this);

    // this.handlePatientFeedbackClicks = this.handlePatientFeedbackClicks.bind(this);
  }

  componentDidMount() {
    const { patientTestAppointments, onGetPatientTestAppointmentsList } = this.props;
    
    // Fetch patient test appointments
    onGetPatientTestAppointmentsList(this.state.user_id);
    
    // Set patientTestAppointments to state
    this.setState({ patientTestAppointments });
    const { patientProfile, onGetPatientProfile } = this.props;
    onGetPatientProfile(this.state.user_id);
    this.setState({
      patientProfile
    });
    console.log("state", patientProfile);
    
    // Check if patientTestAppointments exists and has the required properties
    if (this.props.patientProfile &&
        this.props.patientProfile.is_assosiatewith_anycorporate &&
        this.props.patientProfile.employee_id_card) {
      this.setState({ PermissionModal: true }); // Show the modal for error
    }
    console.log("corporate info", this.props.patientProfile, this.props.patientProfile.is_assosiatewith_anycorporate, this.props.patientProfile.employee_id_card)
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { patientTestAppointments } = this.props;
    if (
      !isEmpty(patientTestAppointments) &&
      size(prevProps.patientTestAppointments) !== size(patientTestAppointments)
    ) {
      this.setState({ patientTestAppointments: {}, isEdit: false });
    }
  }
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,

      lab_phone: arg.lab_phone,
      lab_city: arg.lab_city,
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
  toggleReshedualModal = () => {
    this.setState(prevState => ({
      ReshedualModal: !prevState.ReshedualModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      // relationsip_with_patient: arg.relationsip_with_patient,
      booked_at: arg.booked_at,
      appointment_requested_at: arg.appointment_requested_at,
      // patient_city: arg.patient_city,
      // patient_phone: arg.patient_phone,
    });
  };
  // Add this method to your class component
  downloadFile = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'report';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  opencancelModal = (e, arg) => {
    this.setState({
      cancelModal: true,
    });
  };

  togglecancelModal = () => {
    this.setState(prevState => ({
      cancelModal: !prevState.cancelModal,
    }));
  };

  openPatientModal2 = (e, arg) => {
    this.setState({
      PatientModal2: true,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      ageFormat: arg.ageFormat,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     PatientModal2: false,
  //     isHovered: false,

  //   });
  // };
  togglePatientModal2 = () => {
    this.setState(prevState => ({
      PatientModal2: !prevState.PatientModal2,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  openReshedualModal = (e, arg) => {
    this.setState({
      ReshedualModal: true,
      reschedule_reason: arg.reschedule_reason,
      reason: arg.reason,
      reschedule_count: arg.reschedule_count,
      rescheduled_at: arg.rescheduled_at,
    });
  };

  openCollectorModal = (e, arg) => {
    this.setState({
      collectorModal: true,
      lab_name: arg.lab_name,
      collector_name: arg.collector_name,
      collector_cnic: arg.collector_cnic,
      collector_phone: arg.collector_phone,
      collector_photo: arg.collector_photo,
      sample_collected_at: arg.sample_collected_at,
      collection_status: arg.collection_status,
    });
  };

  toggleCollectorModal = () => {
    this.setState(prevState => ({
      collectorModal: !prevState.collectorModal,
    }));

    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  openReasonModal = (e, arg) => {
    this.setState({ reasonModal: true, reason: arg.reason });
  };

  toggleReasonModal = () => {
    this.setState(prevState => ({
      reasonModal: !prevState.reasonModal,
    }));
  };

  toggleReschedulingModal = () => {
    this.setState(prevState => ({
      reschedulingModal: !prevState.reschedulingModal,
    }));
  };

  handlePatientFeedbackClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  handleReschedulingClick = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggleReschedulingModal();
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
  togglePermissionModal = () => {
    this.setState(prevState => ({
      PermissionModal: !prevState.PermissionModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  render() {
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;

    const { patientProfile } = this.props;
    const isSmallScreen = window.innerWidth <490;

    const { patientTestAppointments } = this.props;
    const feedback = this.state.feedback;
    const { onAddNewPatientFeedback, onGetPatientTestAppointmentsList } =
      this.props;

      const pageOptions = {
        sizePerPage: 100,
        totalSize: patientTestAppointments ? patientTestAppointments.length : 0,
        custom: true,
      };
      

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const backdropStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.88)', // or any value between 0 and 1
      zIndex: 9999,
      display: this.state.PermissionModal ? 'block' : 'none',
    };

    const modalStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      width: '500px', // Increase width
      height: '400px', // Increase height
      zIndex: 10000,
      display: this.state.PermissionModal ? 'block' : 'none',
    };

    const modalmobileStyle = {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '10px',
      width: '90%', // Increase width
      height: 'auto', // Increase height
      zIndex: 10000,
      display: this.state.PermissionModal ? 'block' : 'none',
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Test Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Test Appointments" breadcrumbItem="Test Appointments List" />
            <Row>
            <div>
                <div style={backdropStyle}></div>
                {!isSmallScreen?(
                  <div style={modalStyle}>
                  <Col className="col-12 text-center">
                    <div
                      style={{
                        width: "100%",
                        height: "60px",
                        // borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // border: "2px solid green",
                        margin: "0 auto", // Center the circle
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{ color: "green", fontSize: "24px", fontWeight: "bold" }}
                      >
                        Welcome to the Labhazir!
                      </span>
                    </div>
                    <strong className="font-size-15 font-weight-bold mb-3">
                      We would like to inform you that,
                    </strong><br></br>
                    <p style={{ fontSize: "14px", color: "gray", margin: "0 auto", textAlign: "center", width: "90%", }}>
                      since you are affiliated with a corporate entity, you will only be shown the specific tests offered by your corporation. If you wish to view different tests, you will need to create a separate regular account.</p><br></br>
                    <span className="font-size-15 mb-3">
                      Click on <strong>&lsquo;Use Another Account&lsquo;</strong> for that, or click <strong>&lsquo;Continue&lsquo;</strong> to proceed.
                    </span><br></br>
                    <strong className="font-size-15 font-weight-bold mb-3 text-danger">
                      Thank You For Choosing Labhazir!
                    </strong><br></br>
                  </Col>

                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/register"
                      className="btn mt-2 me-1"
                      onClick={() => this.setState({ PermissionModal: false })}
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        // backgroundColor: "white",
                      }}
                    >
                      Use another Account
                    </Link>

                    <Link
                      to="#" // Use a dummy link or remove this prop, as it will be replaced by the onClick event
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                      onClick={() => {
                        this.setState({ PermissionModal: true });
                        setTimeout(() => {
                          this.props.history.push("/corporate-labs");
                        }, 1000);
                      }}
                    >
                      Continue
                    </Link>

                  </div>
                </div>
                ):null}
                {isSmallScreen?(
                  <div style={modalmobileStyle}>
                  <Col className="col-12 text-center">
                    <div
                      style={{
                        width: "100%",
                        height: "60px",
                        // borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        // border: "2px solid green",
                        margin: "0 auto", // Center the circle
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{ color: "green", fontSize: "24px", fontWeight: "bold" }}
                      >
                        Welcome to the Labhazir!
                      </span>
                    </div>
                    <strong className="font-size-15 font-weight-bold mb-3">
                      We would like to inform you that,
                    </strong><br></br>
                    <p style={{ fontSize: "14px", color: "gray", margin: "0 auto", textAlign: "center", width: "90%", }}>
                      since you are affiliated with a corporate entity, you will only be shown the specific tests offered by your corporation. If you wish to view different tests, you will need to create a separate regular account.</p><br></br>
                    <span className="font-size-15 mb-3">
                      Click on <strong>&lsquo;Use Another Account&lsquo;</strong> for that, or click <strong>&lsquo;Continue&lsquo;</strong> to proceed.
                    </span><br></br>
                    <strong className="font-size-15 font-weight-bold mb-3 text-danger">
                      Thank You For Choosing Labhazir!
                    </strong><br></br>
                  </Col>

                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/register"
                      className="btn mt-2 me-1"
                      onClick={() => this.setState({ PermissionModal: false })}
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        // backgroundColor: "white",
                      }}
                    >
                      Use another Account
                    </Link>

                    <Link
                      to="#" // Use a dummy link or remove this prop, as it will be replaced by the onClick event
                      className="btn mt-2 me-1"
                      style={{
                        color: "black",
                        border: "2px solid blue",
                        backgroundColor: "white",
                      }}
                      onClick={() => {
                        this.setState({ PermissionModal: true });
                        setTimeout(() => {
                          this.props.history.push("/corporate-labs");
                        }, 1000);
                      }}
                    >
                      Continue
                    </Link>

                  </div>
                </div>
                ):null}
              </div>
              <div> <span className="text-danger font-size-12">
                <strong>
                  Note: If you want to reschedule your appointment, please call the Lab.
                </strong>
              </span>
              </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.patientTestAppointmentListColumns}
                      data={patientTestAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.patientTestAppointmentListColumns}
                          data={patientTestAppointments}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />

                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                    // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span>Requested by Patient</span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Booked for
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .relationsip_with_patient
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Booked at
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.booked_at
                                                        ? moment(this.state.booked_at).format("DD MMM YYYY, h:mm A")
                                                        : "--"}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Schedule time
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.appointment_requested_at
                                                        ? moment(this.state.appointment_requested_at).format("DD MMM YYYY, h:mm A")
                                                        : "--"}

                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      className={this.props.className}
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
                                      isOpen={this.state.ReshedualModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleReshedualModal}
                                        tag="h4"
                                      >
                                        <span>To be Done By Lab</span>
                                      </ModalHeader>

                                      <ModalBody>

                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Reason
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.reschedule_reason
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                {this.state
                                                  .reschedule_reason ==
                                                  "Other" &&
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Comment
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.reason
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>}

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Reschedule Count
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.reschedule_count
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Reschedule time
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={this.state.rescheduled_at
                                                        ? moment(this.state.rescheduled_at).format("DD MMM YYYY, h:mm A")
                                                        : "--"}

                                                      className="form-control"
                                                      readOnly={true}
                                                    />
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
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            rating:
                                              (this.state &&
                                                this.state.rating) ||
                                              "",
                                            review:
                                              (this.state &&
                                                this.state.review) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            rating: Yup.number().required(
                                              "Please select rating"
                                            ),
                                            review: Yup.string().required(
                                              "Please enter rescheduling reason"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const newPatientFeedback = {
                                              id: this.state.id,
                                              rating: this.state.rating,
                                              review: values.review,
                                            };

                                            // save new Feedback
                                            onAddNewPatientFeedback(
                                              newPatientFeedback
                                            );

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPatientTestAppointmentsList(
                                                this.state.user_id
                                              );
                                            }, 2000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Rate your experience
                                                    </Label>
                                                    <p className="text-danger font-size-10">
                                                      {errors.rating}
                                                    </p>
                                                    <RatingTooltip
                                                      className="justify-content-between d-flex"
                                                      max={5}
                                                      name="rating"
                                                      tooltipContent={
                                                        this.state
                                                          .tooltipContent
                                                      }
                                                      onChange={rating =>
                                                        this.setState({
                                                          rating: rating,
                                                        })
                                                      }
                                                      value={this.state.rating}
                                                      ActiveComponent={
                                                        <i
                                                          key={"active_6"}
                                                          className="mdi mdi-star text-primary"
                                                          style={
                                                            this.state.starStyle
                                                          }
                                                        />
                                                      }
                                                      InActiveComponent={
                                                        <i
                                                          key={"active_06"}
                                                          className="mdi mdi-star-outline text-muted"
                                                          style={
                                                            this.state.starStyle
                                                          }
                                                        />
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="rating"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      What is your feedback?
                                                    </Label>
                                                    <Field
                                                      name="review"
                                                      as="textarea"
                                                      rows="4"
                                                      cols="50"
                                                      className={
                                                        "form-control" +
                                                        (errors.review &&
                                                          touched.review
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={this.state.review}
                                                      onChange={e =>
                                                        this.setState({
                                                          review:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="review"
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
                                    <Modal
                                      isOpen={this.state.cancelModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.togglecancelModal}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Pending Appointment"
                                          : "Cancel Appointment"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            appointment_option:
                                              (this.state &&
                                                this.state
                                                  .appointment_option) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              appointment_option:
                                                values.appointment_option,
                                            };

                                            // update PaymentStatus
                                            this.ptops.onUpdateTestAppointment(
                                              data
                                            );
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
                                                      <option value="Cancel">
                                                        Cancel
                                                      </option>
                                                    </Field>
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

                                    <Modal
                                      isOpen={this.state.PatientModal2}
                                      className={this.props.className}
                                    // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal2}
                                        tag="h4"
                                      >
                                        <span>Patient Details</span>
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

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Gender
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_gender
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                {this.state.patient_address && this.state.patient_address !== "undefined" ? (
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
                                      isOpen={this.state.collectorModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleCollectorModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3">
                                                  <center>
                                                    <img
                                                      src={
                                                        process.env
                                                          .REACT_APP_BACKENDURL +
                                                        "/media/" +
                                                        this.state
                                                          .collector_photo
                                                      }
                                                      alt="Photo"
                                                      width="50%"
                                                      height="50%"
                                                      className="img-thumbnail mx-auto rounded"
                                                    />
                                                  </center>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Name
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .collector_name
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .collector_cnic
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                {this.state.sample_collected_at != null ? (
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Sample Collected At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.sample_collected_at
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                ) : null}
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
                                                        this.state
                                                          .collector_phone
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
                                                            .collector_phone
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
                                      isOpen={this.state.reschedulingModal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleReschedulingModal}
                                        tag="h4"
                                      >
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            reschedule_reason:
                                              (this.state &&
                                                this.state.reschedule_reason) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            reschedule_reason:
                                              Yup.string().required(
                                                "Please enter rescheduling reason"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              reschedule_reason:
                                                values.reschedule_reason,
                                              rescheduledBy: "Patient",
                                              status: "Rescheduled",
                                              process: "rescheduling",
                                            };

                                            // save new Feedback
                                            console.log(
                                              this.props.onUpdateTestAppointment(
                                                data
                                              )
                                            );

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetPatientTestAppointmentsList(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.toggleReschedulingModal();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      What is rescheduling
                                                      reason?
                                                    </Label>
                                                    <Field
                                                      name="reschedule_reason"
                                                      as="textarea"
                                                      rows="4"
                                                      cols="50"
                                                      className={
                                                        "form-control" +
                                                        (errors.reschedule_reason &&
                                                          touched.reschedule_reason
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="reschedule_reason"
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

                                    <Modal
                                      isOpen={this.state.reasonModal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
                                      centered
                                      toggle={this.toggleReasonModal}
                                    >
                                      <div className="modal-content">
                                        <div className="modal-header border-bottom-0">
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                reasonModal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="text-center mb-4">
                                            {/* <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light rounded-circle text-primary h3">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div> */}

                                            <div className="row justify-content-center">
                                              <div className="col-xl-10">
                                                <h4 className="text-danger">
                                                  Rescheduling Reason
                                                </h4>
                                                <p className="text-muted font-size-14 mb-4">
                                                  {this.state.reason}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
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

TestAppointmentsList.propTypes = {
  match: PropTypes.object,
  patientTestAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetPatientTestAppointmentsList: PropTypes.func,
  onAddNewPatientFeedback: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
  history: PropTypes.object,
  onGetPatientProfile: PropTypes.func,
  patientProfile: PropTypes.array,

};
const mapStateToProps = state  => ({
  patientTestAppointments: state.patientTestAppointments.patientTestAppointmentsList,
  patientProfile: state.LabMarket.patientProfile,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAddNewPatientFeedback: feedback =>
    dispatch(addNewPatientFeedback(feedback)),
  onGetPatientTestAppointmentsList: id =>
    dispatch(getPatientTestAppointmentsList(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
    onGetPatientProfile: id => dispatch(getPatientProfile(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsList));
