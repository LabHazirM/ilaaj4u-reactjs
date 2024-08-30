import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import moment from 'moment';

import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup
} from "reactstrap";

import Flatpickr from 'react-flatpickr';
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
  getTestAppointmentsInProcessList,
  updateTestAppointment,
  addNewCollectionPointTestAppointment,
  getLabProfile

} from "store/test-appointments/actions";

import { updatePaymentInfo } from "store/invoices/actions";

import { getSampleCollectors } from "store/sample-collectors/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class TestAppointmentsInProcessList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    const now = moment();
    this.state = {
      labs: [],
      testAppointments: [],
      labProfiles: [],
      patient: [],
      sampleCollectors: [],
      main_lab_appointments: "Main",
      end_date: now.clone().endOf('month').format('DD MMM YYYY'),
      start_date: now.clone().startOf('month').format('DD MMM YYYY'),
      sampleCollector: "",
      btnText: "Copy",
      resultFile: "",
      testAppointment: "",
      modal: false,
      PaymentModal: false,
      ReshedualModal: false,
      reasonModal: false,
      isRescheduled: false,
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
              {testAppointment.order_id}
              {/* <strong>
                {testAppointment.type}{" ("}
                {testAppointment.address}{")"}
              </strong> */}
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "address",
          text: "Lab Address",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',
            
              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
                            {testAppointment.address}

            </span>
          ), filter: textFilter(),
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
        // {
        //   dataField: "booked_at",
        //   text: "Booked at",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         {new Date(testAppointment.booked_at).toLocaleString("en-US")}
        //       </span>
        //     </>
        //   ),
        // },
        
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.is_home_sampling_availed == true || testAppointment.is_state_sampling_availed == true ? (
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'true': 'Yes',
              'false': 'No',
            },
            defaultValue: 'All',
          }),
        },

        // {
        //   dataField: "estimated_sample_collection_at",
        //   text: "Sampling time by Lab",
        //   sort: true,
        //   formatter: (cellContent, patientTestAppointment) => (
        //     <>
        //       {patientTestAppointment.status == "Pending" ? (
        //         <span>Not available yet</span>
        //       ) : (
        //         <span>
        //           {/* {new Date(
        //             patientTestAppointment.estimated_sample_collection_at
        //           ).toLocaleString("en-US")} */}
        //            {patientTestAppointment.estimated_sample_collection_at
        //           ? moment(patientTestAppointment.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
        //           : "--"}
        //         </span>
        //       )}
        //     </>
        //   ), filter: textFilter(),
        // },
        {
          dataField: "estimated_result_uploading_at",
          text: "Reporting Time by Lab",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {testAppointment.status != "Pending" ? (
                <span>
                  {/* {new Date(
                    testAppointment.estimated_result_uploading_at
                  ).toLocaleString("en-US")} */}
                  {testAppointment.estimated_result_uploading_at
                  ? moment(testAppointment.estimated_result_uploading_at).format("DD MMM YYYY, h:mm A")
                  : "--"}
                </span>
              ) : null}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "sample_collected_at",
          text: "Sampling Time",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Pending" ||
                patientTestAppointment.status == "Confirmed" ||
                // patientTestAppointment.status == "Sample Collected" ||
                patientTestAppointment.status == "Rescheduled" ? (
                <span>{moment(patientTestAppointment.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")}
                </span>
              ) : (
                <span>
                  {/* {new Date(
                    patientTestAppointment.sample_collected_at
                  ).toLocaleString("en-US")} */}
                  {patientTestAppointment.sample_collected_at
                  ? moment(patientTestAppointment.sample_collected_at).format("DD MMM YYYY, h:mm A")
                  : "--"}
\                </span>
              )}
            </>
          ), filter: textFilter(),
        },
        
        // {
        //   dataField: "sample_collector",
        //   text: "Sample Collector",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         <span>
        //           {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collector_name && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Not assigned
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collector_name && (
        //               <span>{testAppointment.collector_name}</span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )}
        //            {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collection_status && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Pending
        //               </span>
        //             )} 


        //         </span>
        //       </span>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "collection status",
        //   text: "Sample Collection Status",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //         <span>
        //           {/* {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collector_name && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Not assigned
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collector_name && (
        //               <span>{testAppointment.collector_name}</span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )} */}
        //           {/* {testAppointment.is_home_sampling_availed &&
        //             !testAppointment.collection_status && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 Pending
        //               </span>
        //             )} */}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Assigned" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "On way" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Reached" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Patient Unavailable" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}
        //               {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Sample+Payment Collected" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {testAppointment.is_home_sampling_availed &&
        //             testAppointment.collection_status == "Sample+Payment Delivered" && (
        //               <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
        //                 {testAppointment.collection_status}
        //               </span>
        //             )}

        //           {!testAppointment.is_home_sampling_availed && (
        //             <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //               Not availed
        //             </span>
        //           )}
        //         </span>
        //       </span>
        //     </>
        //   ),
        // },
        {
          dataField: "collection_status",
          text: "Sample Collector",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <span>
                  {(testAppointment.is_home_sampling_availed || testAppointment.is_state_sampling_availed) &&
                    !testAppointment.collector_name ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Not assigned
                      </span>
                    ):(
                      <span>{testAppointment.collector_name}</span>
                    )}
                  {(testAppointment.is_home_sampling_availed || testAppointment.is_state_sampling_availed) &&
                    !testAppointment.collection_status ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Pending
                      </span>
                    ): testAppointment.collection_status == "Assigned" ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
                        {testAppointment.collection_status}
                      </span>
                    ): testAppointment.collection_status == "On way" ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                        {testAppointment.collection_status}
                      </span>
                    ): testAppointment.collection_status == "Reached" ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                        {testAppointment.collection_status}
                      </span>
                    ): testAppointment.collection_status == "Patient Unavailable" ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        {testAppointment.collection_status}
                      </span>
                    ): testAppointment.collection_status == "Sample+Payment Collected" ? (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    ): testAppointment.collection_status == "Sample+Payment Delivered" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {!testAppointment.is_home_sampling_availed &&
                   !testAppointment.is_state_sampling_availed && (
                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                      Not availed
                    </span>
                  )}
                </span>
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: 'status',
          text: 'Appointment Status',
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
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
          filter: selectFilter({
            options: {
              '': 'All',
              'Pending': 'Pending',
              'Confirmed': 'Confirmed',
              'Sample Collected': 'Sample Collected',
              'Rescheduled': 'Rescheduled',
              'Result Uploaded': 'Result Uploaded',
            },
            defaultValue: 'All',
          }),
        },

        //         {
        //           dataField: "reschedule_count",
        //           text: "Rescheduling",
        //           sort: true,
        //           formatter: (cellContent, testAppointment) => (
        //             <>
        //               <span>
        //                 <span>
        //                   {testAppointment.reschedule_count > 1 && (
        //                     <span className="text-danger">
        //                       {testAppointment.reschedule_count} Used, Limit Reached
        //                     </span>
        //                   )}

        //                   {(!testAppointment.reschedule_reason ||
        //                     testAppointment.reschedule_count < 2) && (
        //                       <span className="text-info">
        //                         {testAppointment.reschedule_count} Used,{" "}
        //                         {2 - testAppointment.reschedule_count} Left
        //                       </span>
        //                     )}
        //                   {testAppointment.reschedule_reason &&
        //                     testAppointment.reschedule_reason == "Other" && (
        //                       <Link
        //                         className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger"
        //                         to="#"
        //                         onClick={e => this.openReasonModal(e, testAppointment)}
        //                       >
        //                         {testAppointment.reason.slice(0, 10) + "..."}
        //                       </Link>
        //                     )}

        //                   {testAppointment.reschedule_reason &&
        //                     testAppointment.reschedule_reason != "Other" && (
        //                       <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
        //                         {testAppointment.reschedule_reason}
        //                       </span>
        //                     )}

        //                   {!testAppointment.reschedule_reason && (
        //                     <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
        //                       Not Rescheduled
        //                     </span>
        //                   )}
        //                   {/* <Link
        // to="#"
        // onClick={e => this.openMessageModal(e, testAppointment)}
        // >
        // {testAppointment.reschedule_reason.slice(0, 10) + "..."}
        // </Link>{" "} */}
        //                 </span>
        //               </span>
        //             </>
        //           ),
        //         },
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
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {testAppointment.payment_method},{" "}
                  {testAppointment.payment_status}
                </span>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'Paid': 'Paid',
              'Not Paid': 'Not Paid',
              'Allocate': 'Allocate',
            },
            defaultValue: 'All',
          }),
        },

        // {
        //   dataField: "invoice",
        //   text: "Invoice",
        //   isDummyField: true,
        //   editable: false,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <Link
        //         className="btn btn-primary btn-rounded font-size-10"
        //         to={`/lab-invoice-detail/${testAppointment.id}`}
        //       >
        //         Invoice
        //       </Link>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "payment",
        //   text: "Payment",
        //   isDummyField: true,
        //   editable: false,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <Link
        //         className="btn btn-primary btn-rounded font-size-10"
        //         to={`/lab-payments/${testAppointment.id}`}
        //       >
        //         Payment
        //       </Link>
        //     </>
        //   ),
        // },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Menu",
          formatter: (cellContent, testAppointment) => (


            <div className="d-flex gap-2">
              {testAppointment.payment_status == "Not Paid" && (
                <Tooltip title="Payment">
                  <Link
                    className="far fa-money-bill-alt font-size-18"
                    to={`/lab-payments/${testAppointment.id}`}
                  >
                  </Link>
                </Tooltip>

              )}
              <Link className="text-success" to="#">
                <Tooltip title="Reschedual Appoitment Info">
                  <i
                    className="mdi mdi-calendar-clock font-size-18"
                    id="edittooltip"
                    onClick={e => this.openReshedualModal(e, testAppointment)
                    }
                  ></i>
                </Tooltip>

              </Link>
              {testAppointment.payment_status === "Not Paid" ? (
                  <Tooltip title="Appointment Detail">
                    <Link
                      className="mdi mdi-receipt font-size-18"
                      to={`/lab-appointment-detail/${testAppointment.id}`}
                    ></Link>
                  </Tooltip>
                ) : (
                  <Tooltip title="Invoice Detail">
                    <Link
                      className="mdi mdi-receipt font-size-18"
                      to={`/lab-invoice-detail/${testAppointment.id}`}
                    ></Link>
                  </Tooltip>
                )}
            </div>
          ),
        },

        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, testAppointment) => (


            <div className="d-flex gap-2">
              <Link className="text-success" to="#">
                <Tooltip title="Update">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() =>
                      this.handleTestAppointmentClick(testAppointment)
                    }
                  ></i>
                </Tooltip>
              </Link>
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

    // this.openPaymentModal =
    // this.openPaymentModal.bind(this);        
    this.handleTestAppointmentClick =
      this.handleTestAppointmentClick.bind(this);
    this.toggleReasonModal = this.toggleReasonModal.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTestAppointmentClicks =
      this.handleTestAppointmentClicks.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleReshedualModal = this.toggleReshedualModal.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { testAppointments, onAddNewCollectionPointTestAppointment, onGetTestAppointmentsInProcessList, onGetLabProfile } = this.props;
    const user_id = this.state.user_id; // Use state to get user_id

    // Fetch the test appointments
    onGetTestAppointmentsInProcessList(user_id);

    // Fetch lab profiles
    onGetLabProfile(user_id);
  }
  componentDidUpdate(prevProps) {
    // Check if labProfiles.type has changed
    if (prevProps.labProfiles.type !== this.props.labProfiles.type) {
      // Update the state based on the new labProfiles.type
      // const newLabType = this.props.labProfiles.type === "Collection Point" ? "Collection" : "Main";
      // this.setState({ main_lab_appointments: newLabType }, () => {
        const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsInProcessList } = this.props;
        const { start_date, end_date, main_lab_appointments, user_id } = this.state;
        const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
        
        // API call with updated dates and lab type
        onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
        setTimeout(() => {
          onGetTestAppointmentsInProcessList(this.state.user_id);
        }, 1000);

      // });
    }
  }


  
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  openReasonModal = (e, arg) => {
    this.setState({ reasonModal: true, reason: arg.reason });
  };

  toggleReasonModal = () => {
    this.setState(prevState => ({
      reasonModal: !prevState.reasonModal,
    }));
  };

  handleTestAppointmentClicks = () => {
    this.setState({ testAppointment: "", resultFile: "" });
    this.toggle();
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

    console.log("payment_status: ");

    this.setState({
      testAppointment: {
        id: testAppointment.id,
        payment_status: testAppointment.payment_status,
        patient_unique_id: testAppointment.patient_unique_id,
        status: testAppointment.status,
        reschedule_reason: testAppointment.reschedule_reason,
        estimated_sample_collection_at:
              testAppointment.estimated_sample_collection_at,
        reason: testAppointment.reason,
        reschedule_count: testAppointment.reschedule_count,
        rescheduled_at: testAppointment.rescheduled_at,
        is_home_sampling_availed: testAppointment.is_home_sampling_availed,
        is_state_sampling_availed: testAppointment.is_state_sampling_availed,
        result_type: "File",
        url: "",
        result: "",
        collector_name: testAppointment.collector_name,
        assigned_to: testAppointment.assigned_to,
      },
      resultFile: "",
      isRescheduled: false,
    });

    this.toggle();
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      appointment_requested_at: arg.appointment_requested_at,
      patient_unique_id: arg.patient_unique_id,
      patient_gender: arg.patient_gender,
      patient_age: arg.patient_age,
      ageFormat: arg.ageFormat,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
      booked_at: arg.booked_at,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     isHovered: false,
    
  //   });
  // };
  openReshedualModal = (e, arg) => {
    this.setState({
      ReshedualModal: true,
      reschedule_reason: arg.reschedule_reason,
      reason: arg.reason,
      reschedule_count: arg.reschedule_count,
      rescheduled_at: arg.rescheduled_at,
    });
  };



  handleAPICall = () => {
    const { onGetTestAppointmentsInProcessList, onUpdatePaymentInfo } =
      this.props;

    if (this.state.testAppointment) {
      onUpdatePaymentInfo(this.state.testAppointment);

      setTimeout(() => {
        onGetTestAppointmentsInProcessList(this.state.user_id);
      }, 1000);
    }
  };

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
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

  // openPaymentModal = (e, arg) => {
  //   this.setState({
  //     // patient_id: testAppointment.patient_id,
  //     amount_received: arg.amount_received,
  //     conflict_reason: arg.conflict_reason,

  //   });
  //   this.togglePaymentModal();
  // };

  // togglePaymentModal = () => {
  //   this.setState(prevState => ({
  //     PaymentModal: !prevState.PaymentModal,
  //   }));
  // };
  handleDateChange(date, field) {
    this.setState({ [field]: moment(date).format('DD MMM YYYY') }, () => {
      // Make the API call after the state has been updated
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsInProcessList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      
      // API call with updated dates and lab type
      onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
      setTimeout(() => {
        onGetTestAppointmentsInProcessList(this.state.user_id);
      }, 1000);
    });
  }

  handleTestAppointmentType = e => {
    const { value } = e.target;
    this.setState({ main_lab_appointments: value }, () => {
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsInProcessList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      setTimeout(() => {
        console.log(onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id));
      });
      setTimeout(() => {
        onGetTestAppointmentsInProcessList(this.state.user_id);
      }, 1000);

    });
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

    const { onGetLabProfile, onAddNewCollectionPointTestAppointment, onUpdateTestAppointment, onGetTestAppointmentsInProcessList } =
      this.props;
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

    const sampleCollectorList = [];
    for (let i = 0; i < this.props.sampleCollectors.length; i++) {
      sampleCollectorList.push({
        label: this.props.sampleCollectors[i].name,
        value: this.props.sampleCollectors[i].id,
      });
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Test Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Test Appointments"
              breadcrumbItem="In Process Appointments List"
            />
            <Row>
              <p className="text-danger">NOte: Sampling Time shows test appointment time by lab before sample collection and once the sample is collected the same column shows the Sample Collected Time.</p>
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
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
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
                                                      Patient Unique Id
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.patient_unique_id
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
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
                                                ): null}

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
                                                      Sampling Time by Patient
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        // this.state.appointment_requested_at
                                                        moment(this.state.appointment_requested_at).format("DD MMM YYYY, h:mm A")
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Booked At
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        // this.state.booked_at
                                                        moment(this.state.booked_at).format("DD MMM YYYY, h:mm A")

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
                                        <span></span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Reschedule Reason
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
                                                {this.state.testAppointment
                                                    .reschedule_reason ==
                                                    "Other" &&
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
                                                      value={
                                                        this.state.rescheduled_at !== null
                                                          ? new Date(this.state.rescheduled_at).toLocaleString('en-US')
                                                          : null
                                                      }
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
                                            patient_id:
                                              (testAppointment &&
                                                testAppointment.patient_id) ||
                                              "",
                                            estimated_sample_collection_at:
                                              (testAppointment &&
                                                testAppointment.estimated_sample_collection_at) ||
                                              "",
                                            patient_unique_id:
                                              (testAppointment &&
                                                testAppointment.patient_unique_id) ||
                                              "",
                                            status:
                                              (testAppointment &&
                                                testAppointment.status) ||
                                              "",
                                            reschedule_reason:
                                              (testAppointment &&
                                                testAppointment.reschedule_reason) ||
                                              "",
                                            reason:
                                              (testAppointment &&
                                                testAppointment.reason) ||
                                              "",
                                            result_type:
                                              (testAppointment &&
                                                testAppointment.result_type) ||
                                              "File",
                                            url:
                                              (testAppointment &&
                                                testAppointment.url) ||
                                              "",
                                            result:
                                              (this.state &&
                                                this.state.resultFile) ||
                                              "",
                                            assigned_to:
                                              (testAppointment &&
                                                testAppointment.assigned_to) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            url: Yup.string()
                                              .url("Please enter a valid url")
                                              .when(["status", "result_type"], {
                                                is: (status, result_type) =>
                                                  status ===
                                                  "Result Uploaded" &&
                                                  result_type === "Link",
                                                then: Yup.string().required(
                                                  "Please enter url to the patient's result"
                                                ),
                                              }),
                                            reschedule_reason:
                                              Yup.string().when("status", {
                                                is: status =>
                                                  status === "Rescheduled",
                                                then: Yup.string().required(
                                                  "Please select rescheduling reason"
                                                ),
                                              }),
                                            reason: Yup.string().when(
                                              "reschedule_reason",
                                              {
                                                is: reschedule_reason =>
                                                  reschedule_reason === "Other",
                                                then: Yup.string().required(
                                                  "Please enter rescheduling reason"
                                                ),
                                              }
                                            ),
                                            result: Yup.string().when(
                                              ["status", "result_type"],
                                              {
                                                is: (status, result_type) =>
                                                  status ===
                                                  "Result Uploaded" &&
                                                  result_type === "File",
                                                then: Yup.string().required(
                                                  "Please upload the file of patient's result"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (this.state.isRescheduled) {
                                              const data = {
                                                id: testAppointment.id,
                                                reschedule_reason:
                                                  values.reschedule_reason,
                                                estimated_sample_collection_at:
                                                  values.estimated_sample_collection_at,
                                                reason: values.reason,
                                                rescheduledBy: "Lab",
                                                status: "Rescheduled",
                                                process: "rescheduling",
                                                assigned_to:
                                                  values.assigned_to,
                                              };

                                              // update TestAppointment
                                              onUpdateTestAppointment(data);
                                            } else {
                                              const updateTestAppointment = {
                                                id: testAppointment.id,
                                                patient_unique_id:
                                                  values.patient_unique_id,
                                                status: values.status,
                                                // reschedule_reason:
                                                //   values.reschedule_reason,
                                                // reason: values.reason,
                                                result_type: values.result_type,
                                                url: values.url,
                                                result: this.state.resultFile,
                                                assigned_to:
                                                  values.assigned_to,
                                                process: "inprocess",
                                              };

                                              // update TestAppointment
                                              onUpdateTestAppointment(
                                                updateTestAppointment
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetTestAppointmentsInProcessList(
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
                                                  {testAppointment.reschedule_count >=
                                                    2 && (
                                                      <Alert color="info mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          rescheduling option
                                                        </strong>{" "}
                                                        from this appointment as
                                                        you reached the{" "}
                                                        <strong>
                                                          maximum limit
                                                        </strong>{" "}
                                                        of rescheduling that is 2.
                                                      </Alert>
                                                    )}

                                                  {testAppointment.payment_status ==
                                                    "Not Paid" &&
                                                    testAppointment.status ==
                                                    "Sample Collected" &&
                                                    (
                                                      <Alert color="warning mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          result uploading
                                                        </strong>{" "}
                                                        option from this
                                                        appointment as
                                                        patient&#39;s payment
                                                        status is{" "}
                                                        <strong>
                                                          Not Paid
                                                        </strong>
                                                        .
                                                      </Alert>
                                                    )}
                                                  {/* {testAppointment.payment_status ==
                                                    "Paid" &&
                                                    testAppointment.status ==
                                                  // "Sample Collected" && 
                                                    "rescheduling" && (
                                                      <Alert color="warning mb-3">
                                                        We&#39;ve disabled{" "}
                                                        <strong>
                                                          result uploading
                                                        </strong>{" "}
                                                        option from this
                                                        appointment as
                                                        patient&#39;s payment
                                                        status is{" "}
                                                        <strong>
                                                          Paid
                                                        </strong>
                                                        .
                                                      </Alert>
                                                  )} */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
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
                                                    ></Field>
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
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Estimated sample
                                                      collection at
                                                    </Label>
                                                    <input
                                                      name="estimated_sample_collection_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.estimated_sample_collection_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Estimated result uploading
                                                      at
                                                    </Label>
                                                    <input
                                                      name="estimated_result_uploading_at"
                                                      type="datetime-local"
                                                      readOnly={true}
                                                      defaultValue={this.state.testAppointment.estimated_result_uploading_at.slice(
                                                        0,
                                                        -9
                                                      )}
                                                      className="form-control"
                                                    />
                                                  </div> */}

                                                  {/* <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="reschedule_count"
                                                    value={
                                                      testAppointment.reschedule_count
                                                    }
                                                  /> */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Patient Unique ID
                                                      (optional)
                                                    </Label>
                                                    <input
                                                      name="patient_unique_id"
                                                      type="text"
                                                      // readOnly={true}
                                                      value={
                                                        testAppointment.patient_unique_id
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          testAppointment: {
                                                            id: testAppointment.id,
                                                            payment_status:
                                                              testAppointment.payment_status,
                                                            patient_unique_id:
                                                              e.target.value,
                                                            is_home_sampling_availed:
                                                              testAppointment.is_home_sampling_availed,
                                                            is_state_sampling_availed:
                                                              testAppointment.is_state_sampling_availed,
                                                            status:
                                                              testAppointment.status,
                                                            reschedule_reason:
                                                              testAppointment.reschedule_reason,
                                                            estimated_sample_collection_at:
                                                                testAppointment.estimated_sample_collection_at,
                                                            reschedule_count:
                                                              testAppointment.reschedule_count,
                                                            reason:
                                                              testAppointment.reason,
                                                            result_type:
                                                              testAppointment.result_type,
                                                            url: testAppointment.url,
                                                            result:
                                                              this.state
                                                                .resultFile,
                                                            assigned_to:
                                                              testAppointment.assigned_to,
                                                          },
                                                        });
                                                      }}
                                                      className="form-control"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Update Status
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      value={
                                                        testAppointment.status
                                                      }
                                                      onChange={e => {
                                                        if (
                                                          e.target.value ==
                                                          "Rescheduled"
                                                        ) {
                                                          this.setState({
                                                            isRescheduled: true,
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status:
                                                                testAppointment.payment_status,
                                                              patient_unique_id:
                                                                testAppointment.patient_unique_id,
                                                              is_home_sampling_availed:
                                                                testAppointment.is_home_sampling_availed,
                                                              is_state_sampling_availed:
                                                                testAppointment.is_state_sampling_availed,
                                                              status:
                                                                e.target.value,
                                                              reschedule_reason:
                                                                testAppointment.reschedule_reason,
                                                              estimated_sample_collection_at:
                                                                testAppointment.estimated_sample_collection_at,
                                                              reschedule_count:
                                                                testAppointment.reschedule_count,
                                                              reason:
                                                                testAppointment.reason,
                                                              result_type:
                                                                testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result:
                                                                this.state
                                                                  .resultFile,
                                                              assigned_to:
                                                                testAppointment.assigned_to,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            isRescheduled: false,
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status:
                                                                testAppointment.payment_status,
                                                              patient_unique_id:
                                                                testAppointment.patient_unique_id,
                                                              is_home_sampling_availed:
                                                                testAppointment.is_home_sampling_availed,
                                                              is_state_sampling_availed:
                                                                testAppointment.is_state_sampling_availed,
                                                              status:
                                                                e.target.value,
                                                              estimated_sample_collection_at:
                                                                testAppointment.estimated_sample_collection_at,
                                                              reschedule_reason:
                                                                testAppointment.reschedule_reason,
                                                              reschedule_count:
                                                                testAppointment.reschedule_count,
                                                              reason:
                                                                testAppointment.reason,
                                                              result_type:
                                                                testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result:
                                                                this.state
                                                                  .resultFile,
                                                              assigned_to:
                                                                testAppointment.assigned_to,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className="form-control"
                                                      readOnly={false}
                                                      multiple={false}
                                                    >
                                                      {/* <option value="Confirmed">
                                                        Confirmed
                                                      </option> */}

                                                      <option value="Confirmed">
                                                        Confirmed 
                                                      </option>

                                                      <option value="Sample Collected">
                                                        Sample Collected
                                                      </option>

                                                      {testAppointment.reschedule_count <
                                                        2 && (
                                                          <option value="Rescheduled">
                                                            To Reschedule
                                                          </option>
                                                        )}

                                                      {testAppointment.payment_status !== "Not Paid" && testAppointment.status !== "Rescheduled" && (
                                                      <option value="Result Uploaded">
                                                          To Upload Result
                                                      </option> )}

                                                    </Field>
                                                  </div>

                                                  {this.state.testAppointment
                                                    .status == "Rescheduled" &&
                                                    testAppointment.reschedule_count <
                                                    2 && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Rescheduling Reason
                                                        </Label>
                                                        <Field
                                                          name="reschedule_reason"
                                                          as="select"
                                                          value={
                                                            testAppointment.reschedule_reason
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              isRescheduled: true,
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                payment_status:
                                                                  testAppointment.payment_status,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                is_state_sampling_availed:
                                                                  testAppointment.is_state_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  e.target
                                                                    .value,
                                                                estimated_sample_collection_at:
                                                                  testAppointment.estimated_sample_collection_at,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.reschedule_reason &&
                                                              touched.reschedule_reason
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          readOnly={false}
                                                          multiple={false}
                                                        >
                                                          <option value="">
                                                            ---- Please select
                                                            appointment
                                                            rescheduling reason
                                                            ----
                                                          </option>
                                                          <option value="Sample Declined">
                                                            Sample Declined
                                                          </option>
                                                          <option value="Sample Insufficient">
                                                            Sample Insufficient
                                                          </option>
                                                          <option value="Sample Spilled">
                                                            Sample Spilled
                                                          </option>
                                                          <option value="Other">
                                                            Other
                                                          </option>
                                                        </Field>

                                                        <ErrorMessage
                                                          name="reschedule_reason"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}
                                                   {this.state.testAppointment
                                                    .status == "Rescheduled" &&
                                                    testAppointment.reschedule_count <
                                                    2 && (
                                                      <div className="mb-3">
                                                    <Label
                                                      for="estimated_sample_collection_at"
                                                    >
                                                      Please select date and time for sample collection
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="estimated_sample_collection_at"
                                                      name="estimated_sample_collection_at"
                                                      value={
                                                        testAppointment.estimated_sample_collection_at
                                                      }
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
                                                            isRescheduled: true,
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status:
                                                                testAppointment.payment_status,
                                                              patient_unique_id:
                                                                testAppointment.patient_unique_id,
                                                              is_home_sampling_availed:
                                                                testAppointment.is_home_sampling_availed,
                                                              is_state_sampling_availed:
                                                                testAppointment.is_state_sampling_availed,
                                                              status:
                                                                testAppointment.status,
                                                              reschedule_reason:
                                                                testAppointment.reschedule_reason,
                                                              estimated_sample_collection_at:
                                                                e.target
                                                                  .value,
                                                              reschedule_count:
                                                                testAppointment.reschedule_count,
                                                              reason:
                                                                testAppointment.reason,
                                                              result_type:
                                                                testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result:
                                                                this.state
                                                                  .resultFile,
                                                              assigned_to:
                                                                testAppointment.assigned_to,
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
                                                        readOnly={false}
                                                        multiple={false}
                                                    />
                                                    <ErrorMessage
                                                      name="estimated_sample_collection_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                    )}
                                                    
                                                  {this.state.testAppointment
                                                    .reschedule_reason ==
                                                    "Other" &&
                                                    this.state.testAppointment
                                                      .reschedule_count < 2 && (
                                                      <div className="mb-3">
                                                        <Label for="reason">
                                                          Reason for
                                                          Rescheduling
                                                        </Label>
                                                        <textarea
                                                          name="reason"
                                                          id="reason"
                                                          rows="2"
                                                          cols="5"
                                                          placeholder="Enter your reason"
                                                          value={
                                                            testAppointment.reason
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                payment_status:
                                                                  testAppointment.payment_status,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                is_state_sampling_availed:
                                                                  testAppointment.is_state_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  e.target
                                                                    .value,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.reason &&
                                                              touched.reason
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="reason"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}

                                                  {(this.state.testAppointment.is_state_sampling_availed || this.state.testAppointment.is_home_sampling_availed) &&
                                                    (this.state.testAppointment.status === "Sample Collected" ||
                                                      this.state.testAppointment.status === "Confirmed" ||
                                                      this.state.testAppointment.status === "Rescheduled") ? (
                                                    <div className="mb-3">
                                                      <Label>
                                                        Assigned to (Sample Collector)
                                                      </Label>
                                                      <Select
                                                        name="assigned_to"
                                                        component="Select"
                                                        placeholder="Select home sample collector..."
                                                        onChange={selectedGroup => {
                                                          this.setState({
                                                            testAppointment: {
                                                              id: testAppointment.id,
                                                              payment_status: testAppointment.payment_status,
                                                              patient_unique_id: testAppointment.patient_unique_id,
                                                              is_state_sampling_availed: testAppointment.is_state_sampling_availed,
                                                              is_home_sampling_availed: testAppointment.is_home_sampling_availed,
                                                              status: testAppointment.status,
                                                              reschedule_reason: testAppointment.reschedule_reason,
                                                              estimated_sample_collection_at:
                                                                  testAppointment.estimated_sample_collection_at,
                                                              reschedule_count: testAppointment.reschedule_count,
                                                              reason: testAppointment.reason,
                                                              result_type: testAppointment.result_type,
                                                              url: testAppointment.url,
                                                              result: this.state.resultFile,
                                                              assigned_to: selectedGroup.value,
                                                            },
                                                          });
                                                        }}
                                                        className="defautSelectParent"
                                                        options={sampleCollectorList}
                                                        defaultValue={{
                                                          label: testAppointment.collector_name,
                                                          value: testAppointment.assigned_to,
                                                        }}
                                                      />
                                                    </div>
                                                  ) : null}

                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Result type
                                                        </Label>
                                                        <Field
                                                          name="result_type"
                                                          as="select"
                                                          value={
                                                            testAppointment.result_type
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                is_state_sampling_availed:
                                                                  testAppointment.is_state_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                estimated_sample_collection_at:
                                                                  testAppointment.estimated_sample_collection_at,
                                                                result_type:
                                                                  e.target.value,
                                                                url: testAppointment.url,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                          className="form-control"
                                                          readOnly={false}
                                                          multiple={false}
                                                        >
                                                          <option value="File">
                                                            File
                                                          </option>
                                                          <option value="Link">
                                                            Link
                                                          </option>
                                                        </Field>
                                                      </div>
                                                    )}
                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" &&
                                                    this.state.testAppointment
                                                      .result_type ===
                                                    "Link" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          URL
                                                        </Label>
                                                        <input
                                                          type="text"
                                                          className={
                                                            "form-control" +
                                                            (errors.url &&
                                                              touched.url
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          value={
                                                            testAppointment.url
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              testAppointment: {
                                                                id: testAppointment.id,
                                                                patient_unique_id:
                                                                  testAppointment.patient_unique_id,
                                                                is_home_sampling_availed:
                                                                  testAppointment.is_home_sampling_availed,
                                                                is_state_sampling_availed:
                                                                  testAppointment.is_state_sampling_availed,
                                                                status:
                                                                  testAppointment.status,
                                                                reschedule_reason:
                                                                  testAppointment.reschedule_reason,
                                                                reschedule_count:
                                                                  testAppointment.reschedule_count,
                                                                reason:
                                                                  testAppointment.reason,
                                                                estimated_sample_collection_at:
                                                                  testAppointment.estimated_sample_collection_at,
                                                                result_type:
                                                                  testAppointment.result_type,
                                                                url: e.target
                                                                  .value,
                                                                result:
                                                                  this.state
                                                                    .resultFile,
                                                                assigned_to:
                                                                  testAppointment.assigned_to,
                                                              },
                                                            });
                                                          }}
                                                        />
                                                        <ErrorMessage
                                                          name="url"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}
                                                  {/* Display current image in edit form only */}
                                                  {this.state.testAppointment
                                                    .status ===
                                                    "Result Uploaded" &&
                                                    this.state.testAppointment
                                                      .result_type ===
                                                    "File" && (
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Result File
                                                        </Label>
                                                        <Input
                                                          id="formFile"
                                                          name="result"
                                                          placeholder="Choose file"
                                                          type="file"
                                                          multiple={false}
                                                          accept=".jpg,.jpeg,.png,.word,.pdf"
                                                          onChange={e => {
                                                            this.setState({
                                                              resultFile:
                                                                e.target
                                                                  .files[0],
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.result &&
                                                              touched.result
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="result"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                    )}
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

TestAppointmentsInProcessList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsInProcessList: PropTypes.func,
  onGetSampleCollectors: PropTypes.func,
  onUpdateTestAppointment: PropTypes.func,
  onUpdatePaymentInfo: PropTypes.func,
  labProfiles: PropTypes.array,
  onAddNewCollectionPointTestAppointment: PropTypes.func,
  onGetLabProfile: PropTypes.func,
};

const mapStateToProps = ({ testAppointments, sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
  testAppointments: testAppointments.testAppointmentsInProcessList,
  labProfiles: testAppointments.labProfiles,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabProfile: id => dispatch(getLabProfile(id)),
  onAddNewCollectionPointTestAppointment: (testAppointment, id) =>
    dispatch(addNewCollectionPointTestAppointment(testAppointment, id)),
  onGetTestAppointmentsInProcessList: id =>
    dispatch(getTestAppointmentsInProcessList(id)),
  onGetSampleCollectors: id => dispatch(getSampleCollectors(id)),
  onUpdateTestAppointment: testAppointment =>
    dispatch(updateTestAppointment(testAppointment)),
  onUpdatePaymentInfo: id => dispatch(updatePaymentInfo(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsInProcessList));