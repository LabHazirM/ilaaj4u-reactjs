import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { any } from "prop-types";
import { Tooltip } from "@material-ui/core";
import { withRouter, Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Modal,
  Row,
  Button,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getLabAudits, UpdateAuditStatus } from "store/auditor/actions";

class LabAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labAudits: [],
      id: "",
      assignedTo: "",
      LabAudits: "",
      auditModal: false,
      reason_of_reaudit:"",
      labAudit: "",
      audit_status:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      LabAuditListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, labAudit) => <>{labAudit.id}</>,
        },
        // {
        //   dataField: "lab_name",
        //   text: "Lab Name",
        //   sort: true,
        // },
        // {
        //   dataField: "generated_at",
        //   text: "Generated at",
        //   sort: true,
        //   formatter: (cellContent, audit) => (
        //     <>
        //       <span>
        //         {new Date(audit.generated_at).toLocaleString("en-US")}
        //       </span>
        //     </>
        //   ),
        // },
        {
          dataField: "assigned_at",
          text: "Assigned at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>{new Date(audit.assigned_at).toLocaleString("en-US")}</span>
            </>
          ),
        },
        {
          dataField: "audited_at",
          text: "Audited at",
          sort: true,
          formatter: (cellContent, audit) => (
            <>
              <span>{new Date(audit.audited_at).toLocaleString("en-US")}</span>
            </>
          ),
        },
        // {
        //   dataField: "auditor_name",
        //   text: "Audited by",
        //   sort: true,
        // },
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
          dataField: "audit_status",
          text: "Result",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, audit) => (
            <div className="text-sm-center">
              {audit.audit_status === "Fail" && (
                <Button
                  color="primary"
                  className="font-12 btn-block btn btn-primary"
                  onClick ={e=>this.onClickAuditedEvent(e,audit)}
                >
                  <i className="mdi mdi-plus-circle-outline me-1" />
                  Request Reaudit
                </Button>
              )}
              <Tooltip title="Comments">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/audit-activity-history/${audit.id}`}
                />
              </Tooltip>
            </div>
          ),
        },
      ],
      
     
    };
    this.onClickAuditedEvent =
    this.onClickAuditedEvent.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { labAudits, onGetLabAudits } = this.props;
    onGetLabAudits(this.state.user_id);
    this.setState({ labAudits });
  }
  onClickAuditedEvent = (e, arg) => {
    console.log("audit id is ", arg)
    this.setState({
      audit: {
        id: arg.id,
        reason: arg.reason,
        lab_id:arg.lab_id,
        audit_status: "Revisit",
      },
      isEdit: true,
    });

    this.setState({ auditModal: true, });
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

    const { labAudits, } = this.props;
    const {  onGetLabAudits, onUpdateAuditStatus } = this.props;
    const audit = this.state.audit;
    const pageOptions = {
      sizePerPage: 10,
      totalSize: labAudits.length, // replace later with size(labAudits),
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
            <title>Lab Audits | Audit Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Auditor" breadcrumbItem="Lab Audits" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.LabAuditListColumns}
                      data={labAudits}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.LabAuditListColumns}
                          data={labAudits}
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
                                            reason_of_reaudit:
                                              (this.state &&
                                                this.state.reason_of_reaudit) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            reason_of_reaudit: Yup.string().required(
                                              "Please enter your reason_of_reaudit"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const Updateauditstatus =
                                            {
                                              id: audit.id,
                                              lab_id: audit.lab_id,
                                              reason_of_reaudit: values.reason_of_reaudit,
                                              audit_status: "Revisit",
            
                                            };
                                            onUpdateAuditStatus(
                                              Updateauditstatus
                                            );
                                            this.setState({
                                              auditModal: false,
                                            });
                                            setTimeout(() => {
                                              onGetLabAudits(this.state.user_id);
                                            }, 1000);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Reason of Reaudit
                                                      </Label>
                                                      <Field
                                                        name="reason_of_reaudit"
                                                        as="textarea"
                                                        rows="4"
                                                        cols="50"
                                                        className={
                                                          "form-control" +
                                                          (errors.reason_of_reaudit &&
                                                          touched.reason_of_reaudit
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        value={
                                                          this.state.reason_of_reaudit
                                                        }
                                                        onChange={e =>
                                                          this.setState({
                                                            reason_of_reaudit:
                                                              e.target.value,
                                                          })
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="reason_of_reaudit"
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
                                {/* <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.onClickAuditedEvent}
                                      // disabled={this.state.audit_status == "Pass"}
                                      >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Request Reaudit
                                    </Button>
                                  </div>
                                </Col> */}
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

LabAudits.propTypes = {
  match: PropTypes.object,
  labAudits: PropTypes.array,
  className: PropTypes.any,
  onGetLabAudits: PropTypes.func,
  onUpdateAuditStatus: PropTypes.func,
  history: any,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({ audits }) => ({
  labAudits: audits.labAudits,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabAudits: id => dispatch(getLabAudits(id)),
  onUpdateAuditStatus: (audit) =>
    dispatch(UpdateAuditStatus(audit)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabAudits));
