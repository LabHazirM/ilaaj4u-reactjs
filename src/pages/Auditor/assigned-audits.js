import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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
  Input,
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
import Breadcrumbs from "components/Common/Breadcrumb";

import { getAssignedAudits, updateAssignedAudits } from "store/auditor/actions";
import * as Yup from "yup";
import "assets/scss/table.scss";

class AssignedAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      assignedAudits: [],
      assignedAudit: "",
      auditReport: "",
      audit_status: "",
      comment: "",
      id: "",
      btnText: "Copy",
      auditModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      assignedAuditColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, assignedAudit) => <>{assignedAudit.id}</>,
        },
        {
          dataField: "lab_name",
          text: "Lab name",
          sort: true,
          formatter: (cellContent, assignedAudit) => (
            <>
              <span>
                  <Link
                    to="#"
                    // onClick={e => this.openPatientModal(e, assignedAudit)}
                    onMouseEnter={e => this.openPatientModal(e, assignedAudit)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {assignedAudit.lab_name}
                  </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "generated_at",
          text: "Generated at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>
                {new Date(audit.generated_at).toLocaleString("en-US")}
              </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "assigned_at",
          text: "Assigned since",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>
              {new Date().getDate() - new Date(audit.assigned_at).getDate()} days

                {/* {new Date(audit.assigned_at).toLocaleString("en-US")} */}
                </span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, audit) => (
            <>
            <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.onClickAuditedEvent(e, audit.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>
              </Tooltip>
              <Tooltip title="Comments">
              <Link
                  className="fas fa-comment font-size-18"
                  to={`/audit-activity-auditor/${audit.id}`}
                  ></Link></Tooltip>
            </>
          ),
        },
      ],
    };
    // this.toggle = this.toggle.bind(this);
    this.onClickAuditedEvent = this.onClickAuditedEvent.bind(this);
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
  toggleHandleModal = () => {
    this.setState(prevState => ({
      auditModal: !prevState.auditModal,
    }));
  };

  onClickAuditedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.setState({ auditModal: true });
  };

  // handleAPICall = () => {
  //   const { onUpdateAssignedAudits, onGetAssignedAudits } = this.props;

  //   onUpdateAssignedAudits(this.state.id);
  //   setTimeout(() => {
  //     onGetAssignedAudits(this.state.user_id);
  //   }, 1000);

  //   this.setState({ auditModal: false });
  // };

  componentDidMount() {
    const { onGetAssignedAudits } = this.props;
    onGetAssignedAudits(this.state.user_id);
    this.setState({ assignedAudits: this.props.assignedAudits });
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

    const { assignedAudits } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: assignedAudits.length, // replace later with size(assignedAudits),
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
            <title>Assigned Audits | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Auditor" breadcrumbItem="Assigned Audits" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.assignedAuditColumns}
                      data={assignedAudits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.assignedAuditColumns}
                          data={assignedAudits}
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
                                      filter={filterFactory()}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
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
                                      isOpen={this.state.auditModal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              auditModal: false,
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
                                            auditReport:
                                              (this.state &&
                                                this.state.auditReport) ||
                                              "",
                                            audit_status:
                                              (this.state &&
                                                this.state.audit_status) ||
                                              "",
                                            comment:
                                              (this.state &&
                                                this.state.comment) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            auditReport: Yup.string().required(
                                              "Please upload audit report"
                                            ),
                                            audit_status: Yup.string().required(
                                              "Please select Result of the audit"
                                            ),
                                            comment: Yup.string().required(
                                              "Please enter your comments/reason of result"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const {
                                              onUpdateAssignedAudits,
                                              onGetAssignedAudits,
                                            } = this.props;

                                            const data = {
                                              id: this.state.id,
                                              auditReport: values.auditReport,
                                              audit_status: values.audit_status,
                                              comment: values.comment,
                                            };

                                            console.log(data);

                                            onUpdateAssignedAudits(data);
                                            setTimeout(() => {
                                              onGetAssignedAudits(
                                                this.state.user_id
                                              );
                                            }, 1000);

                                            this.setState({
                                              auditModal: false,
                                            });
                                            setTimeout(() => {
                                              onGetAssignedAudits(
                                                this.state.user_id
                                              );
                                            }, 100);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                              <div className="mb-3">
                                                <p><b>Note: an email will be sent to the lab with your comments and report.</b></p>
                                                </div>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Audit Report
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="auditReport"
                                                      placeholder="Choose file"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,.word,.pdf"
                                                      onChange={e => {
                                                        this.setState({
                                                          auditReport:
                                                            e.target.files[0],
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.auditReport &&
                                                        touched.auditReport
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="auditReport"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Audit Result
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="audit_status"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.audit_status &&
                                                        touched.audit_status
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          audit_status:
                                                            e.target.value,
                                                        });
                                                      }}
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        ---- Select Result ----
                                                      </option>
                                                      <option value="Pass">
                                                        Pass
                                                      </option>
                                                      <option value="Fail">
                                                        Fail
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="audit_status"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Comment
                                                      </Label>
                                                      <Field
                                                        name="comment"
                                                        as="textarea"
                                                        rows="4"
                                                        cols="50"
                                                        className={
                                                          "form-control" +
                                                          (errors.comment &&
                                                          touched.comment
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.comment
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            comment:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="comment"
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

AssignedAudits.propTypes = {
  match: PropTypes.object,
  assignedAudits: PropTypes.array,
  className: PropTypes.any,
  onGetAssignedAudits: PropTypes.func,
  onUpdateAssignedAudits: PropTypes.func,
};

const mapStateToProps = ({ audits }) => ({
  assignedAudits: audits.assignedAudits,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAssignedAudits: id => dispatch(getAssignedAudits(id)),
  onUpdateAssignedAudits: data => dispatch(updateAssignedAudits(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AssignedAudits));