import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';


import {
  Card,
  CardBody,
  Col,
  ModalHeader,
  Container,
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
import { getDonorReferredAppointmentsList } from "store/donor-referred-appointments/actions";
import { uniqueId } from "lodash";
import { b2bclientAuthProtectedRoutes } from "routes";

class ReferredPatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donorReferredAppointments: [],
      id: "",
      donorReferredAppointment: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      donorReferredAppointmentListColumns: [
        {
          dataField: "booked_at",
          text: "Booked at",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => {
            const date = new Date(donorReferredAppointment.booked_at);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year

            return (
              <p className="text-muted mb-0">
                {`${day}-${month}-${year}`}
              </p>
            );
          },filter: textFilter(),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <strong>{patientTestAppointment.order_id}</strong>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "donated_by",
        //   text: "Donor ID",
        //   sort: true,
        // },
        // {
        //   dataField: "patient_name",
        //   text: "Patient Name",
        //   sort: true,
        // },
        {
          dataField: "patient_name",
          text: "Patient Name",
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
          ),filter: textFilter(),
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
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              <span>
              <Tooltip title="Lab Info">
                <Link
                  to="#"
                  onClick={e => this.openLabModal(e, donorReferredAppointment)}
                  // onMouseEnter={e => this.openLabModal(e, donorReferredAppointment)}
                  // onPointerLeave={this.handleMouseExit()}
                >
                  {donorReferredAppointment.lab_name}
                </Link>
              </Tooltip>
              </span>
            </>
          ),filter: textFilter(),
          },
        

        
        // {
        //   dataField: "payment_method",
        //   text: "Payment method",
        //   sort: true,
        // },
        {
          dataField: "payment_status",
          text: "Payments status",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              {donorReferredAppointment.payment_status == "Not Paid" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger" style={{ width: "100px" }}>
                  {donorReferredAppointment.payment_status}
                </span>
              ) : (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-info" style={{ width: "100px" }}>
                  {donorReferredAppointment.payment_status}
                </span>
              )}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "status",
          text: "Appointments Status",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              {donorReferredAppointment.status == "Pending" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-primary" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}
              {donorReferredAppointment.status == "Cancel" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}
              {donorReferredAppointment.status == "Pending Cancel" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {donorReferredAppointment.status}
                </span>
              )}

              {donorReferredAppointment.status == "Confirmed" ? (
                <span className="pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-info" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}

              {donorReferredAppointment.status == "Sample Collected" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-warning" style={{ width: "150px" }}>
                  {donorReferredAppointment.status}
                </span>
              ) : null}

              {donorReferredAppointment.status == "Result Uploaded" ? (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-success">
                  {donorReferredAppointment.status}
                </span>
              ) : null}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "donortesting",
          text: "Status",
          sort: true,
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <strong>{patientTestAppointment.donortesting}</strong>
            </>
          ),filter: textFilter(),
        },

        {
          dataField: "dues",
          text: "Invoice Amount",
          sort: true,
          formatter: (cellContent, donorReferredAppointment) => (
            <>
              <div className="text-end">
                <strong>{donorReferredAppointment.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
            </>
          ), filter: textFilter(),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);

  }

  componentDidMount() {
    const { donorReferredAppointments, onGetB2bReferredPatientsList } =
      this.props;
    if (donorReferredAppointments && !donorReferredAppointments.length) {
      console.log(this.state.user_id);
      setTimeout(() => {
        onGetB2bReferredPatientsList(this.state.user_id);
      }, 3000);
    }

    this.setState({ donorReferredAppointments });
  }


  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
    ? this.setState({ btnText: "Copied" })
    : this.setState({ btnText: "Copy" });
  }
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
      ageFormat: arg.ageFormat,
      patient_unique_id: arg.patient_unique_id,
      // patient_city: arg.patient_city,
      patient_phone: arg.patient_phone,
      booked_at: arg.booked_at,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     isHovered: false,
  //     LabModal: false,
  //   });
  // };
  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,
      lab_city: arg.lab_city,
      lab_type: arg.lab_type,
      lab_address: arg.lab_address,
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

    const { donorReferredAppointments } = this.props;
    const { onGetB2bReferredPatientsList } =
      this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donorReferredAppointments.length, // replace later with size(donorReferredAppointments),
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
            <title>Donor Appointments List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Appointments" breadcrumbItem="Traceability" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.donorReferredAppointmentListColumns}
                      data={donorReferredAppointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.donorReferredAppointmentListColumns}
                          data={donorReferredAppointments}
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
                                      
                                      {/* <p>{"https://labhazir.com/nearby-labs/?uuid=" + "donorReferredAppointments.uuid"}</p> */}

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
                                      // classes={
                                      //   "table align-middle table-nowrap table-hover"
                                      // }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
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
                                        <span>Lab Details</span>
                                      </ModalHeader>
                                      <ModalBody>

                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">

                                                {/* <div className="mb-3 row">
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
                                                </div> */}
                                           

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
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
                                                      Lab type
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_type
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_address
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
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                        Patient Details
                                      >
                                        <span> Patient Details</span>
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
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Schedule time by Patient
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.appointment_requested_at
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
                                                {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">Booked At</Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.booked_at
                                                          ? new Date(this.state.booked_at).toLocaleString([], {
                                                              year: 'numeric',
                                                              month: 'numeric',
                                                              day: 'numeric',
                                                              hour: '2-digit',
                                                              minute: '2-digit',
                                                              second: '2-digit',
                                                              timeZoneName: 'short',
                                                            })
                                                          : '' // Provide a default value if this.state.booked_at is null or undefined
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}


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
                                                  </div>
                                                </div> */}
                                              </Col>
                                            </Row>
                                          </Form>
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

ReferredPatientsList.propTypes = {
  match: PropTypes.object,
  donorReferredAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetB2bReferredPatientsList: PropTypes.func,
};
const mapStateToProps = ({ donorReferredAppointments }) => ({
  donorReferredAppointments: donorReferredAppointments.donorReferredAppointmentsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bReferredPatientsList: id =>
    dispatch(getDonorReferredAppointmentsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferredPatientsList));
