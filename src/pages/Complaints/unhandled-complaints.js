import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter,selectFilter } from 'react-bootstrap-table2-filter';
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Input,
  Button,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import moment from 'moment';

import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getUnhandledComplaints, updateUnhandledComplaints } from "store/complaints/actions";
import * as Yup from "yup";
import "assets/scss/table.scss";

class UnhandledComplaints extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unhandledComplaints: [],
      unhandledComplaint: "",
      btnText: "Copy",
      modal: false,
      messageModal: false,
      handleModal: false,
      id: "",
      btnText1: "Copy",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      unhandledComplaintListColumns: [
        {
          text: "id",
          dataField: "complaint_id",
          sort: true,
          hidden: true,
          formatter: (cellContent, unhandledComplaint) => (
            <>{unhandledComplaint.id}</>
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
          formatter: (cellContent, testAppointment) => (
            <>
              <strong>{testAppointment.complaint_id}</strong>
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
          formatter: (cellContent, unhandledComplaint) => (
            <>
              <span>
                  <Link
                    to="#"
                    // onClick={e => this.openPatientModal(e, unhandledComplaint)}
                    onMouseEnter={e =>this.openPatientModal(e, unhandledComplaint)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {unhandledComplaint.name}
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
        {
          dataField: "is_it_urgent",
          text: "Urgent",
          sort: true,
          formatter: (cellContent, row) => {
            const isUrgent = row.is_it_urgent;
        
            // Conditionally render red or green round box
            return isUrgent ? (
              <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger" style={{ animation: 'blinking 1s infinite' }}>
                Urgent
              </span>
            ) : (
              <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                Normal
              </span>
            );
          },
          filter: selectFilter({
            options: {
              '': 'All',
              'true': 'Urgent',
              'false': 'Normal',
            },
            defaultValue: '',
          }),
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
        // {
        //   dataField: "registered_at",
        //   text: "Registered at",
        //   sort: true,
        //   formatter: (cellContent, complaint) => (
        //     <>
        //       <span>
        //         {moment(complaint.registered_at).format("DD MMM YYYY, h:mm A")}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },
        
        {
          dataField: "registered_at",
          text: "Pending Since",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
              {new Date().getDate() - new Date(complaint.registered_at).getDate()} days

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
            <div className="d-flex align-items-center">
  <Tooltip title="Click here to update status">
    <Button
      color="success"
      className="mdi mdi-pencil font-size-14"
      id="edittooltip"
      onClick={() => this.handleResolveClick(complaint.id)}
    >
    </Button>
  </Tooltip>

  <Tooltip title="Add Comment">
    <Link
      style={{
        marginLeft: '5px',
      }}
      className="fas fa-comment font-size-18"
      to={`/csr-notes-complains/${complaint.id}`}
    >
    </Link>
  </Tooltip>
</div>

            </>
          ),
        },
      ],
    };
    // this.toggle = this.toggle.bind(this);
    // this.onClickAuditedEvent = this.onClickAuditedEvent.bind(this);
    this.toggleMessageModal.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
    
  }
  handleResolveClick = (complaintId) => {
    // Dispatch an action to update the status in Redux
    const { onUpdateUnhandledComplaints, onGetUnhandledComplaints} = this.props;
    onUpdateUnhandledComplaints({ id: complaintId, status: "Resolved" });

    setTimeout(() => {
      onGetUnhandledComplaints(this.state.user_id);
    }, 1000);
  };

  toggleHandleModal = () => {
    this.setState(prevState => ({
      auditModal: !prevState.auditModal,
    }));
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
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      email: arg.email,
      phone:arg.phone,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
      messageModal: false,
      labModal: false,
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

  // handleAPICall = () => {
  //   const { onUpdateUnhandledComplaints, onGetUnhandledComplaints } = this.props;

  //   onUpdateUnhandledComplaints(this.state.id);
  //   setTimeout(() => {
  //     onGetUnhandledComplaints(this.state.user_id);
  //   }, 1000);

  //   this.setState({ auditModal: false });
  // };
  componentDidMount() {
    const { onGetUnhandledComplaints } = this.props;
    onGetUnhandledComplaints(this.state.user_id);
    this.setState({ unhandledComplaints: this.props.unhandledComplaints });
  }

  // toggle() {
  //   this.setState(prevState => ({
  //     modal: !prevState.modal,
  //   }));
  // }

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

    const { unhandledComplaints } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unhandledComplaints.length, // replace later with size(unhandledComplaints),
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
        {/* <DeleteModal
          show={this.state.auditModal}
          onDeleteClick={this.handleAPICall}
          onCloseClick={() => this.setState({ auditModal: false })}
        /> */}

        <div className="page-content">
          <MetaTags>
            <title>Open Complaints| Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="CSR" breadcrumbItem="open Complaints" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.unhandledComplaintListColumns}
                      data={unhandledComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.unhandledComplaintListColumns}
                          data={unhandledComplaints}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              {/* <Row className="mb-2">
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
                              </Row> */}
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
                                      onPointerLeave={this.handleMouseExit}
                                      centered
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
                                                          this.state
                                                            .lab_phone
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
                                        <span>Details: </span>
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

UnhandledComplaints.propTypes = {
  match: PropTypes.object,
  unhandledComplaints: PropTypes.array,
  className: PropTypes.any,
  onGetUnhandledComplaints: PropTypes.func,
  onUpdateUnhandledComplaints: PropTypes.func,
};

const mapStateToProps = ({ complaints }) => ({
  unhandledComplaints: complaints.unhandledComplaints,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnhandledComplaints: id => dispatch(getUnhandledComplaints(id)),
  onUpdateUnhandledComplaints: data => dispatch(updateUnhandledComplaints(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnhandledComplaints));