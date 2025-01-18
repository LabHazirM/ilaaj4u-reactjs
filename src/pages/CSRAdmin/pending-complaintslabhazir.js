// import React, { Component, useState } from "react";
// import Select from "react-select";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import MetaTags from "react-meta-tags";
// import { withRouter, Link } from "react-router-dom";
// import { Tooltip } from "@material-ui/core";

// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Label,
//   Modal,
//   ModalBody,
//   ModalHeader,
// } from "reactstrap";

// import paginationFactory, {
//   PaginationProvider,
//   PaginationListStandalone,
// } from "react-bootstrap-table2-paginator";
// import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
// import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
// import BootstrapTable from "react-bootstrap-table-next";
// import { Formik, Field, Form, ErrorMessage } from "formik";
// import moment from 'moment';



// //Import Breadcrumb
// import * as Yup from "yup";
// import Breadcrumbs from "components/Common/Breadcrumb";
// import {
//   getPendingComplaintsLabhazir,
//   assignComplaint,
//   //   getCSRList,
// } from "store/csr-admin/actions";
// import { getCsrCentralList,
// } from "store/csr-territory-list/actions";
// import "assets/scss/table.scss";

// class PendingComplaintsLabhazir extends Component {
//   constructor(props) {
//     super(props);
//     this.node = React.createRef();
//     this.state = {
//       pendingComplaintsLabhazir: [],
//       // Office
//       csrCentralTerritoryList: [],
//       id: "",
//       btnText: "Copy",
//       isUrgent: false, 
//       assignedTo: "",
//       PendingComplaintsLabhazir: "",
//       pendingComplaintLabhazir: "",
//       csrList: [],
//       user_id: localStorage.getItem("authUser")
//         ? JSON.parse(localStorage.getItem("authUser")).user_id
//         : "",
//       pendingComplaintLabhazirListColumns: [
//         {
//           text: "id",
//           dataField: "id",
//           sort: true,
//           hidden: true,
//           formatter: (cellContent, pendingComplaintLabhazir) => (
//             <>{pendingComplaintLabhazir.id}</>
//           ),
//         },
//         {
//           dataField: "registered_at",
//           text: "Registered at",
//           sort: true,
//           formatter: (cellContent, complaint) => (
//             <>
//               <span>
//                 {moment(complaint.registered_at).format("DD MMM YYYY, h:mm A")}
//               </span>
//             </>
//           ),
//           filter: textFilter(),
//         },
//         {
//           dataField: "",
//           text: "Complaint ID",
//           sort: true,
//           formatter: (cellContent, complaint) => (
//             <>
//               <strong>{complaint.complaint_id}</strong>
//             </>
//           ),filter: textFilter(),
//         },
//         {
//           dataField: "complainant",
//           text: "Complaint From",
//           sort: true,
//           filter: textFilter(),
//         },
//         {
//           dataField: "name",
//           text: "Complainant Name",
//           sort: true,
//           formatter: (cellContent, pendingComplaintLabhazir) => (
//             <>
//               <span className="float-start">
//                   <Link
//                     to="#"
//                     // onClick={e => this.openPatientModal(e, pendingComplaintLabhazir)}
//                     onMouseEnter={e => this.openPatientModal(e, pendingComplaintLabhazir)}
//                     onPointerLeave={this.handleMouseExit()}
//                   >
//                    {pendingComplaintLabhazir.name}
//                   </Link>
//               </span>
//             </>
//           ),filter: textFilter(),
//         },
//         {
//           dataField: "complainee",
//           text: "Complaint Against",
//           sort: true,
//           formatter: (cellContent, pendingComplaintLabhazir) => (
//             <>
//                   {/* {pendingComplaintLabhazir.complainee},{" "} */}
//                   <strong className="text-danger float-start">{pendingComplaintLabhazir.complainee}</strong><br></br>
//                   <span className="float-start">{pendingComplaintLabhazir.labhazir_complainee}</span>
//             </>
//           ),filter: textFilter(),
//         },
//         // {
//         //   dataField: "email",
//         //   text: "Email",
//         //   sort: true,
//         // },
//         // {
//         //   dataField: "phone",
//         //   text: "Phone No.",
//         //   sort: true,
//         // },

//         {
//           dataField: "registered_at",
//           text: "Pending Since",
//           sort: true,
//           formatter: (cellContent, complaint) => (
//             <>
//               <span>
//               {new Date().getDate() - new Date(complaint.registered_at).getDate()} days
//               </span>
//             </>
//           ),filter: textFilter(),
//         },
//         {
//           dataField: "message",
//           text: "Message",
//           sort: true,
//           formatter: (cellContent, complaint) => (
//             <>
//               <Link to="#" 
//               // onClick={e => this.openMessageModal(e, complaint)}
//               onMouseEnter={e => this.openMessageModal(e, complaint)}
//               onPointerLeave={this.handleMouseExit()}
//               >
//                 {complaint.message.slice(0, 10) + "..."}
//               </Link>{" "}
//             </>
//           ),
//         },
       

//         {
//           dataField: "data",
//           text: "id",
//           isDummyField: true,
//           editable: false,
//           text: "Action",
//           formatter: (cellContent, pendingComplaintLabhazir) => (
//             <>
//               <Link
//                 className="btn btn-success"
//                 to="#"
//                 onClick={e => this.handleApprovedEvent(e, pendingComplaintLabhazir.id)}
//               >
//                 Assign
//               </Link>{" "}
//             </>
//           ),
//         },
//         // {
//         //   dataField: "data",
//         //   text: "id",
//         //   isDummyField: true,
//         //   editable: false,
//         //   text: "Chat",
//         //   formatter: (cellContent, complaint) => (
//         //     <>
//         //       <Tooltip title="Add Comment">
//         //         <Link
//         //           className="fas fa-comment font-size-18"
//         //           to={`/csr-notes-admincomplains/${complaint.id}`}
//         //         ></Link>
//         //       </Tooltip>
//         //     </>
//         //   ),
//         // },
//       ],
//     };
//     this.toggle = this.toggle.bind(this);
//     this.toggleMessageModal.bind(this);
//     this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
//   }

//   componentDidMount() {
//     const { pendingComplaintsLabhazir, onGetPendingComplaintsLabhazir } = this.props;
//     onGetPendingComplaintsLabhazir();
//     this.setState({ pendingComplaintsLabhazir });

//     //  csr central list
//     const { csrCentralTerritoryList, onGetCsrCentralList } = this.props;
//     onGetCsrCentralList();
//     this.setState({ csrCentralTerritoryList });
//   }
//   openPatientModal = (e, arg) => {
//     this.setState({
//       PatientModal: true,
//       email: arg.email,
//       phone:arg.phone,
//     });
//   };
//   handleMouseExit = () => {
//     this.setState({
//       PatientModal: false,
//       isHovered: false,
//       messageModal: false,
//     });
//   };
//   togglePatientModal = () => {
//     this.setState(prevState => ({
//       PatientModal: !prevState.PatientModal,
//     }));
//     this.state.btnText === "Copy"
//       ? this.setState({ btnText: "Copied" })
//       : this.setState({ btnText: "Copy" });
//   };
//   toggle() {
//     this.setState(prevState => ({
//       modal: !prevState.modal,
//     }));
//   }

//   toggleMessageModal = () => {
//     this.setState(prevState => ({
//       messageModal: !prevState.messageModal,
//     }));
//   };

//   openMessageModal = (e, arg) => {
//     this.setState({ messageModal: true, 
//       message: arg.message,
//       subject: arg.subject,
//     });
//   };

//   handleApprovedEvent = (e, arg) => {
//     this.setState({
//       id: arg,
//     });

//     this.toggle();
//   };

//   onPaginationPageChange = page => {
//     if (
//       this.node &&
//       this.node.current &&
//       this.node.current.props &&
//       this.node.current.props.pagination &&
//       this.node.current.props.pagination.options
//     ) {
//       this.node.current.props.pagination.options.onPageChange(page);
//     }
//   };

//   render() {
//     const { SearchBar } = Search;

//     const { pendingComplaintsLabhazir } = this.props;
//     const data = this.state.data;
//     const { onAssignComplaint, onGetPendingComplaintsLabhazir } = this.props;

//     const pageOptions = {
//       sizePerPage: 100,
//       totalSize: pendingComplaintsLabhazir.length, // replace later with size(pendingComplaintsLabhazir),
//       custom: true,
//     };

//     const defaultSorted = [
//       {
//         dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
//         order: "desc", // desc or asc
//       },
//     ];

//     // Central Office
//     const csrCentralTerritoryList = [];

//     for (let i = 0; i < this.props.csrCentralTerritoryList.length; i++) {
//       csrCentralTerritoryList.push({
//         label: this.props.csrCentralTerritoryList[i].name,
//         value: this.props.csrCentralTerritoryList[i].id,
//       });
  
//     }

//     return (
//       <React.Fragment>
//         <div className="page-content">
//           <MetaTags>
//             <title>Pending Complaints | Complaint Hazir</title>
//           </MetaTags>

//           <Container fluid>
//             {/* Render Breadcrumbs */}
//             <Breadcrumbs title="Complaints" breadcrumbItem="Pending" />
//             <Row>
//             <div className="mb-3">
//                                                 <p><b>Note: When you assign a complaint to CSR it will move to Inprocess Complaints.</b></p>
//                                                 </div>
//               <Col lg="12">
//                 <Card>
//                   <CardBody>
//                     <PaginationProvider
//                       pagination={paginationFactory(pageOptions)}
//                       keyField="id"
//                       columns={this.state.pendingComplaintListColumns}
//                       data={pendingComplaintsLabhazir}
//                     >
//                       {({ paginationProps, paginationTableProps }) => (
//                         <ToolkitProvider
//                           keyField="id"
//                           columns={this.state.pendingComplaintLabhazirListColumns}
//                           data={pendingComplaintsLabhazir}
//                           search
//                         >
//                           {toolkitprops => (
//                             <React.Fragment>
//                               <Row className="mb-2">
//                                 <Col sm="4">
//                                   <div className="search-box ms-2 mb-2 d-inline-block">
//                                     {/* <div className="position-relative">
//                                       <SearchBar
//                                         {...toolkitprops.searchProps}
//                                       />
//                                       <i className="bx bx-search-alt search-icon" />
//                                     </div> */}
//                                   </div>
//                                   <Modal
//                                       isOpen={this.state.PatientModal}
//                                       className={this.props.className}
//                                       onPointerLeave={this.handleMouseExit}
//                                     >
//                                       <ModalHeader
//                                         toggle={this.togglePatientModal}
//                                         tag="h4"
//                                       >
//                                         <span></span>
//                                       </ModalHeader>
//                                       <ModalBody>
//                                         <Formik>
//                                           <Form>
//                                             <Row>
//                                               <Col className="col-12">
//                                                 {/* <div className="mb-3 row">
//                                                   <div className="col-md-3">
//                                                     <Label className="form-label">
//                                                       Age
//                                                     </Label>
//                                                   </div>
//                                                   <div className="col-md-9">
//                                                     <input
//                                                       type="text"
//                                                       value={
//                                                         this.state.patient_age
//                                                       }
//                                                       className="form-control"
//                                                       readOnly={true}
//                                                     />
//                                                   </div>
//                                                 </div> */}

//                                                 {/* <div className="mb-3 row">
//                                                   <div className="col-md-3">
//                                                     <Label className="form-label">
//                                                       Address
//                                                     </Label>
//                                                   </div>
//                                                   <div className="col-md-9">
//                                                     <input
//                                                       type="text"
//                                                       value={
//                                                         this.state
//                                                           .patient_address
//                                                       }
//                                                       className="form-control"
//                                                       readOnly={true}
//                                                     />
//                                                   </div>
//                                                 </div> */}

//                                                 <div className="mb-3 row">
//                                                   <div className="col-md-3">
//                                                     <Label className="form-label">
//                                                       E-mail
//                                                     </Label>
//                                                   </div>
//                                                   <div className="col-md-9">
//                                                     <input
//                                                       type="text"
//                                                       value={
//                                                         this.state.email
//                                                       }
//                                                       className="form-control"
//                                                       readOnly={true}
//                                                     />
//                                                   </div>
//                                                 </div>

//                                                 <div className="mb-3 row">
//                                                   <div className="col-md-3">
//                                                     <Label className="form-label">
//                                                       Mobile No.
//                                                     </Label>
//                                                   </div>
//                                                   <div className="col-md-6">
//                                                     <input
//                                                       type="text"
//                                                       value={
//                                                         this.state.phone
//                                                       }
//                                                       className="form-control"
//                                                       readOnly={true}
//                                                     />
//                                                   </div>

//                                                   <div className="col-md-3">
//                                                     <button
//                                                       type="button"
//                                                       className="btn btn-secondary"
//                                                       onClick={() => {
//                                                         navigator.clipboard.writeText(
//                                                           this.state
//                                                             .phone
//                                                         );
//                                                         this.setState({
//                                                           btnText: "Copied",
//                                                         });
//                                                       }}
//                                                     >
//                                                       {this.state.btnText}
//                                                     </button>
//                                                   </div>
//                                                 </div>
//                                               </Col>
//                                             </Row>
//                                           </Form>
//                                         </Formik>
//                                       </ModalBody>
//                                     </Modal>
//                                 </Col>
//                               </Row>
//                               <Row className="mb-4">
//                                 <Col xl="12">
//                                   <div className="table-responsive">
//                                     <BootstrapTable
//                                       {...toolkitprops.baseProps}
//                                       {...paginationTableProps}
//                                       defaultSorted={defaultSorted}
//                                       classes={"table align-middle table-hover"}
//                                       bordered={false}
//                                       striped={true}
//                                       filter={filterFactory()}
//                                       headerWrapperClasses={"table-light"}
//                                       responsive
//                                       ref={this.node}
//                                     />
//                                     <Modal
//                                       isOpen={this.state.modal}
//                                       className={this.props.className}
//                                     >
//                                       <div className="modal-header">
//                                         <button
//                                           type="button"
//                                           className="btn-close"
//                                           onClick={() =>
//                                             this.setState({
//                                               modal: false,
//                                             })
//                                           }
//                                           data-bs-dismiss="modal"
//                                           aria-label="Close"
//                                         ></button>
//                                       </div>
//                                       <ModalBody>
//                                         <Formik
//                                           enableReinitialize={true}
//                                           initialValues={{
//                                             assignedTo:
//                                               (this.state &&
//                                                 this.state.assignedTo) ||
//                                               "",
//                                           }}
//                                           validationSchema={Yup.object().shape({
//                                             assignedTo: Yup.number().required(
//                                               "Please select CSR to assign complaint"
//                                             ),
//                                           })}
//                                           onSubmit={values => {
//                                             const data = {
//                                               id: this.state.id,
//                                               assignedTo: values.assignedTo,
//                                               is_it_urgent: this.state.isUrgent, // Include the checkbox value

//                                             };

//                                             // Assign complaint
//                                             onAssignComplaint(data);

//                                             // Calling to update list record
//                                             setTimeout(() => {
//                                               onGetPendingComplaintsLabhazir();
//                                             }, 1000);

//                                             this.toggle();
//                                           }}
//                                         >
//                                           {({ errors, status, touched }) => (
//                                             <Form>
//                                               <Row>
//                                                 <Col className="col-12">
//                                                   <div className="mb-3 select2-container">
//                                                     <Label>Assigned to</Label>
//                                                     <Select
//                                                       name="assignedTo"
//                                                       component="Select"
//                                                       onChange={selectedGroup => {
//                                                         this.setState({
//                                                           assignedTo:
//                                                             selectedGroup.value,
//                                                         });
//                                                       }}
//                                                       className={
//                                                         "defautSelectParent" +
//                                                         (errors.assignedTo
//                                                           ? " is-invalid"
//                                                           : "")
//                                                       }
//                                                       styles={{
//                                                         control: (
//                                                           base,
//                                                           state
//                                                         ) => ({
//                                                           ...base,
//                                                           borderColor:
//                                                             errors.assignedTo
//                                                               ? "#f46a6a"
//                                                               : "#ced4da",
//                                                         }),
//                                                       }}
//                                                       options={csrCentralTerritoryList}
//                                                       placeholder="Select CSR..."
//                                                     />
//                                                     <ErrorMessage
//                                                       name="assignedTo"
//                                                       component="div"
//                                                       className="invalid-feedback"
//                                                     />
//                                                   </div>
//                                                 </Col>
//                                                 <Col className="col-12">
//                                               <div className="mb-3 form-check">
//                                                 <label htmlFor="isUrgentCheckbox" className="form-check-label">
//                                                   This Complaint Requires Immediate Attention!
//                                                 </label>
//                                                 <input
//                                                   type="checkbox"
//                                                   id="isUrgentCheckbox"
//                                                   className="form-check-input"
//                                                   checked={this.state.isUrgent}
//                                                   onChange={(e) => this.setState({ isUrgent: e.target.checked })}
//                                                 />
//                                               </div>
//                                             </Col>
//                                               </Row>
//                                               <Row>
//                                                 <Col>
//                                                   <div className="text-end">
//                                                     <button
//                                                       type="submit"
//                                                       className="btn btn-success save-user"
//                                                     >
//                                                       Save
//                                                     </button>
//                                                   </div>
//                                                 </Col>
//                                               </Row>
//                                             </Form>
//                                           )}
//                                         </Formik>
//                                       </ModalBody>
//                                     </Modal>

//                                     <Modal
//                                       isOpen={this.state.messageModal}
//                                       role="dialog"
//                                       autoFocus={true}
//                                       data-toggle="modal"
//                                       centered
//                                       toggle={this.toggleMessageModal}
//                                       onPointerLeave={this.handleMouseExit}
//                                     >
//                                       <div className="modal-content">
//                                         <div className="modal-header border-bottom-0">
//                                           <button
//                                             type="button"
//                                             className="btn-close"
//                                             onClick={() =>
//                                               this.setState({
//                                                 messageModal: false,
//                                               })
//                                             }
//                                             data-bs-dismiss="modal"
//                                             aria-label="Close"
//                                           ></button>
//                                         </div>
//                                         <div className="modal-body">
//                                           <div className="text-center mb-4">
//                                             <div className="avatar-md mx-auto mb-4">
//                                               <div className="avatar-title bg-light rounded-circle text-primary h3">
//                                                 <i className="mdi mdi-email-open"></i>
//                                               </div>
//                                             </div>

//                                             <div className="row justify-content-center">
//                                               <div className="col-xl-10">
//                                                 <h4 className="text-primary">
//                                                 {this.state.subject}
//                                                 </h4>
//                                                 <p className="text-muted font-size-14 mb-4">
//                                                   {this.state.message}
//                                                 </p>
//                                               </div>
//                                             </div>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     </Modal>
//                                   </div>
//                                 </Col>
//                               </Row>
//                               {/* <Row className="align-items-md-center mt-30">
//                                 <Col className="pagination pagination-rounded justify-content-end mb-2">
//                                   <PaginationListStandalone
//                                     {...paginationProps}
//                                   />
//                                 </Col>
//                               </Row> */}
//                             </React.Fragment>
//                           )}
//                         </ToolkitProvider>
//                       )}
//                     </PaginationProvider>
//                   </CardBody>
//                 </Card>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </React.Fragment>
//     );
//   }
// }

// PendingComplaintsLabhazir.propTypes = {
//   match: PropTypes.object,
//   pendingComplaintsLabhazir: PropTypes.array,
//   csrList: PropTypes.array,
//   className: PropTypes.any,
//   onGetPendingComplaintsLabhazir: PropTypes.func,
//   onGetCSRList: PropTypes.func,
//   onAssignComplaint: PropTypes.func,
//   // office
//   csrCentralTerritoryList: PropTypes.array,
//   onGetCsrCentralList: PropTypes.func,
// };
// const mapStateToProps = ({ csrAdmin, csrTerritoryList }) => ({
//   pendingComplaintsLabhazir: csrAdmin.pendingComplaintsLabhazir,
//   // Office 
//   csrCentralTerritoryList: csrTerritoryList.csrCentralTerritoryList,
// });

// const mapDispatchToProps = (dispatch, ownProps) => ({
//   onAssignComplaint: data => dispatch(assignComplaint(data)),
//   onGetPendingComplaintsLabhazir: () => dispatch(getPendingComplaintsLabhazir()),
//   onGetCsrCentralList: () => dispatch(getCsrCentralList()),
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(withRouter(PendingComplaintsLabhazir));
