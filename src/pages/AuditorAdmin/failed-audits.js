import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Modal,
  ModalBody,
  Input,
  Button,
  ModalHeader,
} from "reactstrap";
import filterFactory,{textFilter} from "react-bootstrap-table2-filter";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getFailedAudits,
  assignAudit,
  //   getAuditorList,
} from "store/auditor-admin/actions";

import { getAuditorList } from "store/staff/actions";
import "assets/scss/table.scss";

class FailedAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      failedAudits: [],
      id: "",
      btnText: "Copy",
      auditorName: "",
      assignedTo: "",
      message: "",
      FailedAudits: "",
      failedAudit: "",
      auditorList: [],
      messageModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      failedAuditListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, failedAudit) => <>{failedAudit.id}</>,
        },
        {
          dataField: "lab_name",
          text: "Lab name",
          sort: true,
          style:{ width: "300px" , textAlign: "left"},
          formatter: (cellContent, failedAudit) => (
            <>
              <span>
                  <Link
                    to="#"
                    // onClick={e => this.openPatientModal(e, failedAudit)}
                    onMouseEnter={e => this.openPatientModal(e, failedAudit)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {failedAudit.lab_name}
                  </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "lab_city",
        //   text: "City",
        //   sort: true,
        // },
        // {
        //   dataField: "lab_address",
        //   text: "Lab address",
        //   sort: true,
        // },
        {
          dataField: "generated_at",
          text: "Generated at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>
              {moment(audit.generated_at).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "assigned_at",
          text: "Assigned at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>{moment(audit.assigned_at).format("DD MMM YYYY, h:mm A")}</span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "audited_at",
          text: "Audited at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>{moment(audit.audited_at).format("DD MMM YYYY, h:mm A")}</span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "auditor_name",
          text: "Assigned to",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "Report",
          text: "Report",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + audit.audit_report,
                }}
                target="_blank"
              >
                View Report
              </Link>
            </>
          ),
        },
        {
          dataField: "lab_status",
          text: "Lab status",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              {audit.is_temporary_blocked == "Yes" ? (
                <span>Warning</span>
              ) : (
                <span>--</span>
              )}
            </>
          ),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, audit) => (
            <>
              <Link
                  className="fas fa-comment font-size-18"
                  to={`/audit-activity-admin/${audit.id}`}
                  ></Link>
            </>
            
          ),
        }
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { failedAudits, onGetFailedAudits } = this.props;
    onGetFailedAudits();
    this.setState({ failedAudits });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.lab_address,
      lab_city: arg.lab_city,
      lab_phone: arg.lab_phone,
      lab_email: arg.lab_email,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
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

    const { failedAudits } = this.props;
    const data = this.state.data;
    const { onAssignAudit, onGetFailedAudits } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: failedAudits.length, // replace later with size(failedAudits),
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
            <title>Failed Audits | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Completed Audits" breadcrumbItem="Failed" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.failedAuditListColumns}
                      data={failedAudits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.failedAuditListColumns}
                          data={failedAudits}
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
                                      filter={filterFactory()}
                                    />
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      onPointerLeave={this.handleMouseExit}
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
                                                      Lab Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
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
                                                      email
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
                                                      Contact No.
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
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              modal: false,
                                            })
                                          }
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            assignedTo:
                                              (this.state &&
                                                this.state.assignedTo) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            assignedTo: Yup.number().required(
                                              "Please select AuditorList to assign complaint"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              assignedTo: values.assignedTo,
                                            };

                                            // Assign complaint
                                            onAssignAudit(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetFailedAudits();
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3 select2-container">
                                                    <Label>Assigned to</Label>
                                                    <Select
                                                      defaultValue={{
                                                        label:
                                                          this.state
                                                            .auditorName,
                                                        value:
                                                          this.state.assignedTo,
                                                      }}
                                                      name="assignedTo"
                                                      component="Select"
                                                      onChange={selectedGroup => {
                                                        this.setState({
                                                          assignedTo:
                                                            selectedGroup.value,
                                                        });
                                                      }}
                                                      className={
                                                        "defautSelectParent" +
                                                        (errors.assignedTo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      styles={{
                                                        control: (
                                                          base,
                                                          state
                                                        ) => ({
                                                          ...base,
                                                          borderColor:
                                                            errors.assignedTo
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                        }),
                                                      }}
                                                      options={auditorList}
                                                      placeholder="Select AuditorList..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
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
                                      isOpen={this.state.messageModal}
                                      role="dialog"
                                      autoFocus={true}
                                      data-toggle="modal"
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
                                                  Audit Message
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

FailedAudits.propTypes = {
  match: PropTypes.object,
  failedAudits: PropTypes.array,
  auditorList: PropTypes.array,
  className: PropTypes.any,
  onGetFailedAudits: PropTypes.func,
  onGetAuditorList: PropTypes.func,
  onAssignAudit: PropTypes.func,
};
const mapStateToProps = ({ auditorAdmin, staff }) => ({
  failedAudits: auditorAdmin.failedAudits,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignAudit: data => dispatch(assignAudit(data)),
  onGetFailedAudits: () => dispatch(getFailedAudits()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FailedAudits));
