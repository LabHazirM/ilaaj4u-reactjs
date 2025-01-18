import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Label,ModalHeader, Modal,ModalBody } from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import moment from 'moment';
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getSampleCollectionCompletedList } from "store/sample-collector-test-appointments/actions";

class TestAppointmentsCompletedList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testAppointments: [],
      testAppointment: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
        btnText: "Copy",
        btnTextaddress: "Copy",
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
          formatter: (cellContent, patientTestAppointment) => (
            <>
              <strong>{patientTestAppointment.order_id}</strong>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Patient name",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                <Link
                  to="#"
                  onClick={e => this.openPatientModal(e, testAppointment)}
                  // onMouseEnter={e => this.openPatientModal(e, testAppointment)}
                  // onPointerLeave={this.handleMouseExit()}
                >
                  {testAppointment.patient_name}
                </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "name",
        //   text: "Patient name",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       <span>
        //           <Link
        //             to="#"
        //             onClick={e => this.openPatientModal(e, testAppointment)}
        //             // onMouseEnter={e => this.openPatientModal(e, testAppointment)}
        //             // onPointerLeave={this.handleMouseExit()}
        //           >
        //            {testAppointment.patient_name}
        //           </Link>
        //       </span>
        //     </>
        //   ),filter: textFilter(),
        // },
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
        // {
        //   dataField: "appointment_requested_at",
        //   text: "Sampling time by Patient",
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
          dataField: "estimated_sample_collection_at",
          text: "Sampling time by Lab",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              {testAppointment.status == "Pending" ? (
                <span>Not available yet</span>
              ) : null}

              {testAppointment.status != "Pending" ? (
                <span>
                  {/* {new Date(
                    testAppointment.estimated_sample_collection_at
                  ).toLocaleString("en-US")} */}
                  {testAppointment.estimated_sample_collection_at
                  ? moment(testAppointment.estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
                  : "--"}
                </span>
              ) : null}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "handovered_at",
          text: "Sample+payment Delivered at",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>
              <span>
                {/* {new Date(testAppointment.handovered_at).toLocaleString(
                  "en-US"
                )} */}
                {testAppointment.handovered_at
                  ? moment(testAppointment.handovered_at).format("DD MMM YYYY, h:mm A")
                  : "--"}
              </span>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "dues",
        //   text: "Dues",
        //   sort: true,
        // },
        {
          dataField: "dues",
          text: "Dues",
          sort: true,
          formatter: (cellContent, testAppointment) => (
            <>             
             <div className="text-end">
            {testAppointment.dues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div></>
        ),filter: textFilter(),
        },
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
          ),filter: selectFilter({
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
        //   dataField: process.env.REACT_APP_BACKENDURL + "result",
        //   text: "Result",
        //   sort: true,
        //   formatter: (cellContent, testAppointment) => (
        //     <>
        //       {testAppointment.result_type == "File" ? (
        //         <Link
        //           to={{
        //             pathname:
        //               process.env.REACT_APP_BACKENDURL + testAppointment.result,
        //           }}
        //           target="_blank"
        //         >
        //           <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
        //           View Result
        //         </Link>
        //       ) : (
        //         <Link
        //           to={{
        //             pathname: testAppointment.url,
        //           }}
        //           target="_blank"
        //         >
        //           <i className="mdi mdi-eye font-size-14" id="edittooltip"></i>{" "}
        //           View Result
        //         </Link>
        //       )}
        //     </>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
  }

  componentDidMount() {
    const { onGetTestAppointmentsCompletedList } = this.props;
    onGetTestAppointmentsCompletedList(this.state.user_id);
    this.setState({ testAppointments: this.props.testAppointments });
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
      patient_address: arg.patient_address,
      ageFormat: arg.ageFormat,
      patient_city: arg.patient_city,
      patient_phone:arg.patient_phone,
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
      btnText: prevState.btnText === "Copy" ? "Copied" : "Copy",
      btnTextaddress: prevState.btnTextaddress === "Copy" ? "Copied" : "Copy",
    }));
  };
  
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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

  render() {
    const { SearchBar } = Search;

    const { testAppointments } = this.props;

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
            <title>Sample Collection Completed | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Completed List"
              breadcrumbItem={testAppointments.map((lab, index) => {
                // Check if lab_name is defined and not null
                if (lab.lab_name !== undefined && lab.lab_name !== null) {
                  // Return a div for each lab_name
                  return (
                    <div key={index} className="float-end">
                      <span className="text-danger">{lab.lab_name}</span>
                      <span>-Sample Collector</span>
                    </div>
                  );
                }
                // Don't render anything for labs without lab_name
                return null;
              })}
            ></Breadcrumbs>
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
                                  {/* <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div> */}
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
    <Label className="form-label">Address</Label>
  </div>
  <div className="col-md-6">
    <input
      type="text"
      value={this.state.patient_address}
      className="form-control"
      readOnly={true}
    />
  </div>
  <div className="col-md-3">
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => {
        navigator.clipboard.writeText(this.state.patient_address);
        this.setState({ btnTextaddress: "Copied" });
      }}
    >
      {this.state.btnTextaddress}
    </button>
  </div>
</div>

<div className="mb-3 row">
  <div className="col-md-3">
    <Label className="form-label">Mobile No.</Label>
  </div>
  <div className="col-md-6">
    <input
      type="text"
      value={this.state.patient_phone}
      className="form-control"
      readOnly={true}
    />
  </div>
  <div className="col-md-3">
    <button
      type="button"
      className="btn btn-secondary"
      onClick={() => {
        navigator.clipboard.writeText(this.state.patient_phone);
        this.setState({ btnText: "Copied" });
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

TestAppointmentsCompletedList.propTypes = {
  match: PropTypes.object,
  testAppointments: PropTypes.array,
  className: PropTypes.any,
  onGetTestAppointmentsCompletedList: PropTypes.func,
  // onUpdateTestAppointment: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectorDatas }) => ({
  testAppointments: sampleCollectorDatas.sampleCollectorDatasCompletedList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestAppointmentsCompletedList: id =>
    dispatch(getSampleCollectionCompletedList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestAppointmentsCompletedList));
