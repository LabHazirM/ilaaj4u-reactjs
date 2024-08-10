import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import { Tooltip } from "@material-ui/core";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
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
  Form,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import moment from 'moment';

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, ErrorMessage } from "formik";
//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getHandledComplaints } from "store/complaints/actions";

import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class handledComplaintsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      handledComplaints: [],
      handledComplaint: "",
      startDate: null,
      endDate: null,
      selectedLab: null,
      modal: false,
      btnText: "Copy",
      btnText1: "Copy",
      messageModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      handledComplaintListColumns: [
        {
          text: "id",
          dataField: "complaint_id",
          sort: true,
          hidden: true,
          formatter: (cellContent, handledComplaint) => (
            <>{handledComplaint.id}</>
          ),
          filter: textFilter(),
        },
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {moment(complaint.registered_at).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "complaint_id",
          text: "Complaint ID",
          sort: true,
          formatter: (cellContent, handledComplaint) => (
            <>
              <strong>{handledComplaint.complaint_id}</strong>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "complainant",
          text: "Complaint From",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Complainant Name",
          sort: true,
          formatter: (cellContent, handledComplaint) => (
            <>
              <span>
                  <Link
                    to="#"
                    // onClick={e => this.openPatientModal(e, handledComplaint)}
                    onMouseEnter={e => this.openPatientModal(e, handledComplaint)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {handledComplaint.name}
                  </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   sort: true,
        // },
        // {
        //   dataField: "phone",
        //   text: "Phone",
        //   sort: true,
        // },
       
        {
          dataField: "complainee",
          text: "Complaint Against",
          sort: true,
          formatter: (cellContent, unhandledComplaint) => (
            <>
              {unhandledComplaint.lab_name ? (
                <Link
                  to="#"
                  onMouseEnter={e => this.openLabMessageModal(e, unhandledComplaint)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  <strong className="text-danger">{unhandledComplaint.complainee}</strong> <br></br>
                  {unhandledComplaint.lab_name}
                </Link>
              ) : (
                <>
                  <strong className="text-danger">{unhandledComplaint.complainee}</strong> <br></br>
                  {unhandledComplaint.labhazir_complainee}
                </>
              )}
            </>
          ),
          filter: textFilter(),
        },      
        {
          dataField: "city",
          text: "City",
          sort: true,
          filter: textFilter(),
        },  
        // {
        //   dataField: "message",
        //   text: "Message",
        //   sort: true,
        //   formatter: (cellContent, complaint) => (
        //     <>
        //       <Link to="#" 
        //       // onClick={e => this.openMessageModal(e, complaint)}
        //       onMouseEnter={e => this.openMessageModal(e, complaint)}
        //       onPointerLeave={this.handleMouseExit()}
        //       >
        //         {complaint.message.slice(0, 10) + "..."}
        //       </Link>{" "}
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
        
        {
          dataField: "time_difference_hours",
          text: "Response Time in Hours",
          sort: true,
          formatter: (cellContent, handledComplaint) => (
            <>
              <span>
                {handledComplaint.time_difference_hours.toFixed().toString()}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, complaint) => (
            <>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/csr-notes-complains/${complaint.id}`}
                ></Link>
              </Tooltip>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);

  }
  componentDidMount() {
    this.setState({ handledComplaints: [] });
    const currentMonthStart = moment().startOf("day");
    const currentMonthEnd = moment().endOf("day");

    this.setState({
      startDate: currentMonthStart.toDate(),
      endDate: currentMonthEnd.toDate(),
    });

    this.fetchData();
  }
  
  
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate
    ) {
      // Fetch data based on date filters
      this.fetchData();
    }

    if (this.props.handledComplaints.length > 0 &&
      this.props.handledComplaints !== prevProps.handledComplaints) {
    const lastIndex = this.props.handledComplaints.findIndex((statement) => {
        const statementDate = new Date(statement.registered_at);
        const labFilter = !this.state.selectedLab || statement.lab_name === this.state.selectedLab;
        return (
          statementDate >= this.state.startDate &&
          statementDate <= this.state.endDate &&
          labFilter
        );
      });

      // Do something with lastIndex if needed
    }
    const { handledComplaints } = this.props;
    if (
      !isEmpty(handledComplaints) &&
      size(prevProps.handledComplaints) !== size(handledComplaints)
    ) {
      this.setState({ handledComplaints: {}, isEdit: false });
    }
  }

  fetchData = () => {
    if (this.state.user_id && this.state.startDate && this.state.endDate) {
      const { onGetHandledComplaints } = this.props;
      const userId = this.state.user_id;
      const startDate = moment(this.state.startDate).format("YYYY-MM-DD");
      const endDate = moment(this.state.endDate).format("YYYY-MM-DD");
  
      onGetHandledComplaints(userId, startDate, endDate); // Pass startDate and endDate to API call
    }
  };
  

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      phone:arg.phone,
    });
  };
  toggleLabMessageModal = () => {
    this.setState(prevState => ({
      labModal: !prevState.labModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  openLabMessageModal = (e, arg) => {
    this.setState({ labModal: true, 
      lab_email: arg.lab_email,
      lab_phone: arg.lab_phone,

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
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      messageModal: false,
      isHovered: false,
      labModal: false,

    });
  };

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, 
      message: arg.message,
      subject: arg.subject,
     });
  };

  // eslint-disable-next-line no-unused-vars
  

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
    const { startDate, endDate, labsData } = this.state;
    const { handledComplaints } = this.props;
    const { onGetHandledComplaints } = this.props;
    const handledComplaint = this.state.handledComplaint;

    const uniqueLabNames = [...new Set(this.props.handledComplaints.map(handledComplaints => handledComplaints.complainant))];
    const labOptions = uniqueLabNames.map((typeoptions, index) => (
      <option key={index} value={typeoptions}>
        {typeoptions}
      </option>
    ));
   
    const uniqueCityNames = [...new Set(this.props.handledComplaints.map(handledComplaints => handledComplaints.city))];
    const cityOptions = uniqueCityNames.map((cityName, index) => (
      <option key={index} value={cityName}>
        {cityName}
      </option>
    ));

    const pageOptions = {
      sizePerPage: 10,
      totalSize: handledComplaints.length, // replace later with size(handledComplaints),
      custom: true,
    };

    const filteredStatements = handledComplaints.filter((statement) => {
      const orderedAt = moment(statement.registered_at);
      const labFilter = !this.state.selectedLab || statement.complainant === this.state.selectedLab;
      const CorporateFilter = !this.state.selectedCorporate || statement.city === this.state.selectedCorporate;
      return (
        labFilter && CorporateFilter &&
        (!startDate || orderedAt.isSameOrAfter(startDate)) &&
        (!endDate || orderedAt.isSameOrBefore(endDate))
      );
    });

    filteredStatements.sort((a, b) => {
      return moment(a.registered_at) - moment(b.registered_at);
    });
    console.log("Filtered Statements:", filteredStatements);
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
            <title>Closed Complaints List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="CSR" breadcrumbItem="Closed Complaints" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                  <Row>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => this.setState({ startDate: date })}
                    className="form-control"
                    dateFormat="d MMM yyyy"

                  />
                </div></Col>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    className="form-control"
                    dateFormat="d MMM yyyy"

                  />
                </div>

              </Col>
             <Col lg="3">
  <div className="mb-3">
    <label className="form-label">Complainant type</label>
    <select
      value={this.state.selectedLab}
      onChange={(e) => this.setState({ selectedLab: e.target.value })}
      className="form-control"
    >
      <option value="">All</option>
      {labOptions}
    </select>
  </div>
</Col>
<Col lg="3">
  <div className="mb-3">
    <label className="form-label">City</label>
    <select
      value={this.state.selectedCorporate}
      onChange={(e) => this.setState({ selectedCorporate: e.target.value })}
      className="form-control"
    >
      <option value="">All Cities</option>
      {cityOptions}
    </select>
  </div>
</Col>


            </Row>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.handledComplaintListColumns}
                      data={handledComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.handledComplaintListColumns}
                          data={filteredStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    {/* <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div> */}
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.togglePatientModal}
                                        tag="h4"
                                      >
                                        <span>Details: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                            <Row>
                                              <Col className="col-12">
                                                {/* <div className="mb-3 row">
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
                                                </div> */}

                                                {/* <div className="mb-3 row">
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
                                                </div> */}

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      E-mail
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.email
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
                                                        this.state.phone
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
                                                            .phone
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
                                      isOpen={this.state.labModal}
                                      onPointerLeave={this.handleMouseExit}
                                      toggle={this.toggleLabMessageModal}
                                    >
                                    <ModalHeader
                                        toggle={this.toggleLabMessageModal}
                                        tag="h4"
                                      >
                                        <span>Lab details: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                        <Row>
                                        <Col className="col-12">

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_email
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
                                      filter={ filterFactory() }
                                    />

                                    <Modal
                                      isOpen={this.state.messageModal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
                                      centered
                                      onPointerLeave={this.handleMouseExit}
                                      toggle={this.toggleMessageModal}
                                    >
                                      <div className="modal-content">
                                        <div className="modal-header border-bottom-0">
                                          <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                messageModal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
                                        </div>
                                        <div className="modal-body">
                                          <div className="text-center mb-4">
                                            <div className="avatar-md mx-auto mb-4">
                                              <div className="avatar-title bg-light rounded-circle text-primary h3">
                                                <i className="mdi mdi-email-open"></i>
                                              </div>
                                            </div>

                                            <div className="row justify-content-center">
                                              <div className="col-xl-10">
                                                <h4 className="text-primary">
                                                {this.state.subject}
                                                </h4>
                                                <p className="text-muted font-size-14 mb-4">
                                                  {this.state.message}
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
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

handledComplaintsList.propTypes = {
  match: PropTypes.object,
  handledComplaints: PropTypes.array,
  className: PropTypes.any,
  onGetHandledComplaints: PropTypes.func,
};


const mapStateToProps = ({ complaints }) => ({
  handledComplaints: complaints.handledComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetHandledComplaints: id => dispatch(getHandledComplaints(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(handledComplaintsList));
