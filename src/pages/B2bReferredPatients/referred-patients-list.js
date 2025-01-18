import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import moment from 'moment';

import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getB2bReferredPatientsList } from "store/b2b-referred-patients/actions";
import "assets/scss/table.scss";

class ReferredPatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bReferredPatients: [],
      id: "",
      b2bReferredPatient: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bReferredPatientListColumns: [
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
            <span>
              <Tooltip title="Order ID">
                <Link
                  to="#"
                  onClick={e => this.openbookedModal(e, patientTestAppointment)}
                  // onMouseEnter={e => this.openbookedModal(e, patientTestAppointment)}
                  // onPointerLeave={this.handleMouseExit()}
                >
                  {patientTestAppointment.order_id}
                </Link>
              </Tooltip>
              </span>
              {/* <strong>{patientTestAppointment.order_id}</strong> */}
            </>
          ),
        },
        {
          dataField: "name",
          text: "Patient name",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <span>
              <Tooltip title="Patient Info">
                <Link
                  to="#"
                  onClick={e => this.openPatientModal(e, patientTestAppointment)}
                  // onMouseEnter={e => this.openPatientModal(e, patientTestAppointment)}
                  // onPointerLeave={this.handleMouseExit()}
                >
                  {patientTestAppointment.patient_name}
                </Link>
              </Tooltip>
              </span>
            </>
          ),
        },
        
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, b2bReferredPatient) => (
            <>
              <span>
              <Tooltip title="Lab Info">
                <Link
                  to="#"
                  onClick={e => this.openLabModal(e, b2bReferredPatient)}
                  // onMouseEnter={e => this.openLabModal(e, b2bReferredPatient)}
                  // onPointerLeave={this.handleMouseExit()}
                >
                  {b2bReferredPatient.name}
                </Link>
              </Tooltip>
              </span>
            </>
          ),
          },
        // {
        //   dataField: "city",
        //   text: "Lab City",
        //   sort: true,
        // },
       
        {
          dataField: "dues",
          text: "Payment",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
            {patientTestAppointment.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </>
            ),
        },
        {
          dataField: "is_home_sampling_availed",
          text: "Home sampling",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
          <>
          {patientTestAppointment.is_home_sampling_availed == true ? (
          <span>Yes</span>
          ) : (
          <span>No</span>
          )}
          </>
          ),
          },
        // {
        //   dataField: "booked_at",
        //   text: "Booked at",
        //   sort: true,
        //   formatter: (cellContent, b2bReferredPatient) => (
        //     <>
        //       <span>
        //         {new Date(b2bReferredPatient.booked_at).toLocaleString("en-US")}
        //       </span>
        //     </>
        //   ),
        // },
        // {
        //   dataField: "payment_status",
        //   text: "Payment Status",
        //   sort: true,
        //   formatter: (cellContent, b2bReferredPatient) => (
        //     <>
        //       {/* {b2bReferredPatient.payment_status == "Not Paid" ? (
        //         <span
        //           className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger"
        //           style={{ width: "100px" }}
        //         >
        //           {b2bReferredPatient.payment_status}
        //         </span>
        //       ) : (
        //         <span
        //           className="pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info"
        //           style={{ width: "100px" }}
        //         >
        //           {b2bReferredPatient.payment_status}
        //         </span>
        //       )} */}
        //       {b2bReferredPatient.payment_status}
        //     </>
        //   ),
        // },

        {
          dataField: "status",
          text: "Appointment Status",
          sort: true,
          formatter: (cellContent, b2bReferredPatient) => (
            <>
              {b2bReferredPatient.status == "Pending" ? (
                <span
                  className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Confirmed" ? (
                <span
                  className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-info"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Sample Collected" ? (
                <span
                  className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-warning"
                  style={{ width: "150px" }}
                >
                  {b2bReferredPatient.status}
                </span>
              ) : null}

              {b2bReferredPatient.status == "Result Uploaded" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-success">
                  {b2bReferredPatient.status}
                </span>
              ) : null}
            </>
          ),
        },
        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
          <>
          {patientTestAppointment.payment_status == "Not Paid" ? (
          <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
          {patientTestAppointment.payment_method},{" "}
          {patientTestAppointment.payment_status}
          </span>
          ) : (
          <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
          {patientTestAppointment.payment_method},{" "}
          {patientTestAppointment.payment_status}
          </span>
          )}
          </>
          ),
        },
        {
          dataField: "result",
          isDummyField: true,
          editable: false,
          text: "Result",
          formatter: (cellContent, patientTestAppointment) => (
            <>
              {patientTestAppointment.status == "Result Uploaded" &&
              patientTestAppointment.result_type == "File" ? (
                <Link
                  to={{
                    pathname:
                      process.env.REACT_APP_BACKENDURL +
                      patientTestAppointment.result,
                  }}
                  target="_blank"
                >
                  <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
                  Report
                </Link>
              ) : patientTestAppointment.status == "Result Uploaded" &&
                patientTestAppointment.result_type == "Link" ? (
                <Link
                  to={{
                    pathname: patientTestAppointment.url,
                  }}
                  target="_blank"
                >
                  <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
                  Report
                </Link>
              ) : (
                <span>Not uploaded</span>
              )}
            </>
          ),
          // formatter: (cellContent, b2bReferredPatient) => (
          //   <div className="d-flex gap-3">
          //     <Link className="text-success" to="#">
          //     <Tooltip title="Invoice">
          //     <Link
          //       className="mdi mdi-receipt font-size-18"
          //       to={`/in-process-b2b/${b2bReferredPatient.id}`}              >
          //     </Link>
          //     </Tooltip>
          //     </Link>
          //   </div>
          // ),
        },
        //comments patient invoive in b2b reffered patient list 
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, b2bReferredPatient) => (
        //     <div className="d-flex gap-3">
        //       <Link className="text-success" to="#">
        //       <Tooltip title="Invoice">
        //       <Link
        //         className="mdi mdi-receipt font-size-18"
        //         to={`/in-process-b2b/${b2bReferredPatient.id}`}              >
        //       </Link>
        //       </Tooltip>
        //       </Link>
        //     </div>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.togglebookModal = this.togglebookModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    this.toggleLabModal = this.toggleLabModal.bind(this);

  }

  componentDidMount() {
    const { b2bReferredPatients, onGetB2bReferredPatientsList } = this.props;
    onGetB2bReferredPatientsList(this.state.user_id);
    this.setState({ b2bReferredPatients });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  togglebookModal = () => {
    this.setState(prevState => ({
      bookModal: !prevState.bookModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openbookedModal = (e, arg) => {
    this.setState({
      bookModal: true,
      booked_at: arg.booked_at,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     bookModal: false,
  //     LabModal: false,
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
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      appointment_requested_at: arg.appointment_requested_at,
      patient_unique_id: arg.patient_unique_id,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      patient_age: arg.patient_age,
      patient_unique_id: arg.patient_unique_id,
      patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
      booked_at: arg.booked_at,
    });
  };
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      // appointment_requested_at: arg.appointment_requested_at,
      // patient_unique_id: arg.patient_unique_id,
      // patient_gender: arg.patient_gender,
      // patient_address: arg.patient_address,
      city: arg.city,
      // patient_phone: arg.patient_phone,
      // booked_at: arg.booked_at,
    });
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

  render() {
    const { SearchBar } = Search;

    const { b2bReferredPatients } = this.props;
    const { onGetB2bReferredPatientsList } = this.props;

    const pageOptions = {
      sizePerPage: b2bReferredPatients.length,
      totalSize: b2bReferredPatients.length, // replace later with size(b2bReferredPatients),
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
            <title>B2B Referred Patients List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Referreds" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bReferredPatientListColumns}
                      data={b2bReferredPatients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bReferredPatientListColumns}
                          data={b2bReferredPatients}
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

                                      {/* <p>{"https://labhazir.com/nearby-labs/?uuid=" + "b2bReferredPatients.uuid"}</p> */}
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
                                                      value={
                                                        this.state.patient_age
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Schedule time by Patient
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      // value={
                                                      //   this.state.appointment_requested_at
                                                      // }
                                                      value={this.state.appointment_requested_at
                                                        ? moment(this.state.appointment_requested_at).format("DD MMM YYYY, h:mm A")
                                                        : "--"}
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
                                                      // value={
                                                      //   this.state.booked_at
                                                      // }
                                                      value={this.state.booked_at
                                                        ? moment(this.state.booked_at).format("DD MMM YYYY, h:mm A")
                                                        : "--"}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                {/* <div className="mb-3 row">
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
                                                  </div> */}
                                                {/* </div> */}
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.LabModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleLabModal}
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
                                                      Lab Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                           

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.city
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
                                      isOpen={this.state.bookModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglebookModal}
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
                                                    Booked At
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      // value={
                                                      //   this.state.booked_at
                                                      // }
                                                      value={this.state.booked_at
                                                        ? moment(this.state.booked_at).format("DD MMM YYYY, h:mm A")
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
                                    ></Modal>
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

ReferredPatientsList.propTypes = {
  match: PropTypes.object,
  b2bReferredPatients: PropTypes.array,
  className: PropTypes.any,
  onGetB2bReferredPatientsList: PropTypes.func,
};
const mapStateToProps = ({ b2bReferredPatients }) => ({
  b2bReferredPatients: b2bReferredPatients.b2bReferredPatientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bReferredPatientsList: id => dispatch(getB2bReferredPatientsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferredPatientsList));