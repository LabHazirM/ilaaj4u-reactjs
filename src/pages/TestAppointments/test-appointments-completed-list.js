import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Modal, Label, ModalBody, ModalHeader, FormGroup, } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getTestAppointmentsCompletedList,
  updateTestAppointment,
  addNewCollectionPointTestAppointment,
  getLabProfile
} from "store/test-appointments/actions";

import "assets/scss/table.scss";

class TestAppointmentsCompletedList extends Component {
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
      btnText: "Copy",
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
        //          {patientTestAppointment.estimated_sample_collection_at
        //           ? moment(patientTestAppointment.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
        //           : "--"}
        //         </span>
        //       )}
        //     </>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "sample_collected_at",
        //   text: "Sample collected at",
        //   sort: true,
        //   formatter: (cellContent, patientTestAppointment) => (
        //     <>
        //       {patientTestAppointment.status == "Pending" ||
        //         patientTestAppointment.status == "Confirmed" ||
        //         // patientTestAppointment.status == "Sample Collected" ||
        //         patientTestAppointment.status == "Rescheduled" ? (
        //         <span>----</span>
        //       ) : (
        //         <span>
        //           {/* {new Date(
        //             patientTestAppointment.sample_collected_at
        //           ).toLocaleString("en-US")} */}
        //           {patientTestAppointment.sample_collected_at
        //           ? moment(patientTestAppointment.sample_collected_at).format("DD MMM YYYY, h:mm A")
        //           : "--"}

        //         </span>
        //       )}
        //     </>
        //   ), filter: textFilter(),
        // },
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
               </span>
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
          dataField: "collection_status",
          text: "Sample Collector",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <span>
                  {testAppointment.is_home_sampling_availed &&
                    !testAppointment.collector_name && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Not assigned
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collector_name && (
                      <span>{testAppointment.collector_name}</span>
                    )}

                  {!testAppointment.is_home_sampling_availed && (
                    <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                      Not availed
                    </span>
                  )}
                  {testAppointment.is_home_sampling_availed &&
                    !testAppointment.collection_status && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        Pending
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Assigned" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "On way" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Reached" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Patient Unavailable" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Sample+Payment Collected" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    )}
                  {testAppointment.is_home_sampling_availed &&
                    testAppointment.collection_status == "Sample+Payment Delivered" && (
                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                        {testAppointment.collection_status}
                      </span>
                    )}

                  {!testAppointment.is_home_sampling_availed && (
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
              {testAppointment.status == "Pending Cancel" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {testAppointment.status}
                </span>

              )}
              {testAppointment.status == "Cancel" && (
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
              'Cancel': 'Cancel',
              'Pending Cancel': 'Pending Cancel',
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
          // filter: selectFilter({
          //   options: {
          //     '': 'All',
          //     'Paid': 'Paid',
          //     'Not Paid': 'Not Paid',
          //     'Allocate': 'Allocate',
          //   },
          //   defaultValue: 'All',
          // }),
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
          dataField: process.env.REACT_APP_BACKENDURL + "result",
          text: "Actions",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <div className="d-flex gap-3">
                <Link className="text-success" to="#">
                  <Tooltip title="Reschedual Appoitment Info">
                    <i
                      className="mdi mdi-calendar-clock font-size-18"
                      id="edittooltip"
                      onClick={e => this.openReshedualModal(e, testAppointment)
                      }
                    ></i>
                  </Tooltip>
                  <Tooltip title="Invoice">
                    <Link
                      className="mdi mdi-receipt font-size-18"
                      to={`/lab-invoice-detail/${testAppointment.id}`}
                    >
                    </Link>
                  </Tooltip>
                  <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/lab-note-list/${testAppointment.id}`}
                ></Link>
              </Tooltip>

                </Link>
                {testAppointment.status !== "Pending Cancel" && testAppointment.status !== "Cancel" && (
                  testAppointment.result_type === "File" ? (
                    <Link
                      to={{
                        pathname: process.env.REACT_APP_BACKENDURL + testAppointment.result,
                      }}
                      target="_blank"
                    >
                      Report
                    </Link>
                  ) : (
                    <Link
                      to={{
                        pathname: testAppointment.url,
                      }}
                      target="_blank"
                    >
                      View
                    </Link>
                  )
                )}
   
              </div>
            </>
          ),
        },


      ],
    };
    // this.toggle = this.toggle.bind(this);
    this.toggleReasonModal = this.toggleReasonModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleReshedualModal = this.toggleReshedualModal.bind(this);

  }

  componentDidMount() {
    const { testAppointments, onAddNewCollectionPointTestAppointment, onGetTestAppointmentsCompletedList, onGetLabProfile } = this.props;
    const user_id = this.state.user_id; // Use state to get user_id

    // Fetch the test appointments
    onGetTestAppointmentsCompletedList(user_id);

    // Fetch lab profiles
    onGetLabProfile(user_id);
  }
  componentDidUpdate(prevProps) {
    // Check if labProfiles.type has changed
    if (prevProps.labProfiles.type !== this.props.labProfiles.type) {
      // Update the state based on the new labProfiles.type
      // const newLabType = this.props.labProfiles.type === "Collection Point" ? "Collection" : "Main";
      // this.setState({ main_lab_appointments: newLabType }, () => {
        const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsCompletedList } = this.props;
        const { start_date, end_date, main_lab_appointments, user_id } = this.state;
        const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
        
        // API call with updated dates and lab type
        onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
        setTimeout(() => {
          onGetTestAppointmentsCompletedList(this.state.user_id);
        }, 1000);

      // });
    }
  }

  // toggle() {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  // }
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
  openReasonModal = (e, arg) => {
    this.setState({ reasonModal: true, reason: arg.reason });
  };

  toggleReasonModal = () => {
    this.setState(prevState => ({
      reasonModal: !prevState.reasonModal,
    }));
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
  handleDateChange(date, field) {
    this.setState({ [field]: moment(date).format('DD MMM YYYY') }, () => {
      // Make the API call after the state has been updated
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsCompletedList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      
      // API call with updated dates and lab type
      onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
      setTimeout(() => {
        onGetTestAppointmentsCompletedList(this.state.user_id);
      }, 1000);
    });
  }

  handleTestAppointmentType = e => {
    const { value } = e.target;
    this.setState({ main_lab_appointments: value }, () => {
      const { onAddNewCollectionPointTestAppointment, onGetTestAppointmentsCompletedList } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      setTimeout(() => {
        console.log(onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id));
      });
      setTimeout(() => {
        onGetTestAppointmentsCompletedList(this.state.user_id);
      }, 1000);

    });
  };

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;
    const { onGetLabProfile, onAddNewCollectionPointTestAppointment, onGetTestAppointmentsCompletedList } =
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
              breadcrumbItem="Completed Appointments List"
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
                                      filter={ filterFactory() }
                                    />
                                  </div>
                                  <Modal
                                    isOpen={this.state.PatientModal}
                                    className={this.props.className}
                                    // onPointerLeave={this.handleMouseExit}

                                  >
                                    <ModalHeader
                                      toggle={this.togglePatientModal}
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
                                                    Schedule time by Patient
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
                                              {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                    reschedule_reason
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
                                                </div> */}
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

TestAppointmentsCompletedList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsCompletedList: PropTypes.func,
  labProfiles: PropTypes.array,
  onAddNewCollectionPointTestAppointment: PropTypes.func,
  onGetLabProfile: PropTypes.func,

  // onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ testAppointments }) => ({
  testAppointments: testAppointments.testAppointmentsCompletedList,
  labProfiles: testAppointments.labProfiles,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabProfile: id => dispatch(getLabProfile(id)),
  onAddNewCollectionPointTestAppointment: (testAppointment, id) =>
  dispatch(addNewCollectionPointTestAppointment(testAppointment, id)),
  onGetTestAppointmentsCompletedList: id =>
    dispatch(getTestAppointmentsCompletedList(id)),
  // onUpdateTestAppointment: testAppointment =>
  //   dispatch(updateTestAppointment(testAppointment)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsCompletedList));