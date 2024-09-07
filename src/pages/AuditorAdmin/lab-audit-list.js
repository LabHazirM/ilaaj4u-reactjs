import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  Col,
  Container,
  Button,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Alert
} from "reactstrap";
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
import paginationFactory, { PaginationProvider, PaginationListStandalone,} from "react-bootstrap-table2-paginator";
import moment from 'moment';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import {
    getLabsAllAuditList,
} from "store/labs-list/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import { getAuditorCentralList,
    getAuditorSouthList,
    getAuditorNorthList,
   } from "store/auditor-territory-list/actions";
import { assignAudit } from "store/auditor-admin/actions";  
import "assets/scss/table.scss";
import { getAuditorList } from "store/staff/actions";
import { addNewAudit } from "store/auditor/actions";
import { register } from "serviceWorker";
class PendingAudits extends Component {
    constructor(props) {
      super(props);
      this.node = React.createRef();
      this.state = {
        labaudit: [],
        labaudit: "",
        auditorCentralTerritoryList: [],
        auditorSouthTerritoryList: [],
        auditorNorthTerritoryList: [],
        id: "",
        btnText: "Copy",
        assignedTo: "",
        reason_of_reaudit:"",
        labaudit: "",
        frequency: "",
        register_at: "",
        auditorList: [],
        auditModal: false,
        user_id: localStorage.getItem("authUser")
          ? JSON.parse(localStorage.getItem("authUser")).user_id
          : "",
        pendingAuditListColumns: [
          {
            text: "id",
            dataField: "id",
            sort: true,
            hidden: true,
            formatter: (cellContent, labaudit) => <>{labaudit.id}</>,
          },
          {
            dataField: "lab_name",
            text: "Lab name",
            sort: true,
            style:{ width: "300px" , textAlign: "left"},
            formatter: (cellContent, labaudit) => (
              <>
                <span>
                    <Link
                      to="#"
                      onMouseEnter={e =>  this.openPatientModal(e, labaudit)}
                      onPointerLeave={this.handleMouseExit()}
                    >
                     {labaudit.lab_name}
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
                {audit.assigned_at ? (
                  <span>{moment(audit.assigned_at).format("DD MMM YYYY, h:mm A")}</span>
                )  : (
                  <span>--</span>
                )}
              </>
            ),
            filter: textFilter(),
          },
          {
            dataField: "auditor_name",
            text: "Assigned to",
            sort: true,
            formatter: (cellContent, audit) => (
              <>
                {audit.auditor_name ? (
              <span>{audit.auditor_name}</span>
                ) : (
                  <span>--</span>
                )}
              </>
            ),
            filter: textFilter(),
          },
          {
            dataField: "Report",
            text: "Report",
            sort: true,
            formatter: (cellContent, audit) => (
              <>
                {audit.audit_report ? (
                  <Link
                    to={{
                      pathname: `${process.env.REACT_APP_BACKENDURL}${audit.audit_report}`,
                    }}
                    target="_blank"
                  >
                    View Report
                  </Link>
                ) : (
                  <span>--</span>
                )}
              </>
            ),
          },
          {
            dataField: "pending_since",
            text: "Pending Since",
            sort: true,
            formatter: (cellContent, audit) => (
              <>
                <span>
  
                {new Date().getDate() - new Date(audit.generated_at).getDate()} days
                </span>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "status",
            text: "Audit Status",
            sort: true,
            formatter: (cellContent, audit) => (
              <>
                <span>{audit.status}</span>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "audit_status",
            text: "Status",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {labsList.audit_status === "Pass" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                    {labsList.audit_status}
                  </span>
                ) : labsList.audit_status === "Fail" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {labsList.audit_status}
                  </span>
                ) : labsList.audit_status === "Revisit"?(
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {labsList.audit_status}
                  </span>
                ) : (
                  <span>--</span>
                )}
              </>
            ),
            filter: textFilter(),
          },
          {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, labsList) => (
              <>
              {labsList.audit_status == "Fail"   ? ( 
                <div className="d-flex gap-1">
                <>
                <Link
                  className="btn btn-success"
                  to="#"
                  // onClick={e => this.onClickAuditedEvent(e, labsList.id)}
                  onClick={e => this.handleApprovedEvent(e, labsList.id)}
                >
                  ReAssign
                </Link>{" "}
              </>
              </div>
              ) : labsList.audit_status == "Revisit" ? ( 
                <div className="d-flex gap-1">
                <>
                <Link
                  className="btn btn-success"
                  to="#"
                  // onClick={e => this.onClickAuditedEvent(e, labsList.id)}
                  onClick={e => this.handleApprovedEvent(e, labsList.id)}
                >
                  ReAssign
                </Link>{" "}
              </>
              </div>
              ):labsList.status == "Pending"  ? ( 
                <div className="d-flex gap-1">
                <>
                <Link
                  className="btn btn-success"
                  to="#"
                  onClick={e => this.handleApprovedEvent(e, labsList.id)}
                >
                  Assign
                </Link>{" "}
              </>
              </div>
              ) :labsList.status == "In Process"  ? ( 
                <div className="d-flex gap-1">
                <>
                <Link
                  className="btn btn-success"
                  to="#"
                  onClick={e => this.handleApprovedEvent(e, labsList.id)}
                >
                  ReAssign
                </Link>{" "}
              </>
              </div>
              ) :
               (
                "---"
              )}
              
              </>
              
            ),
          },
        ],
      };
      this.toggle = this.toggle.bind(this);
      this.toggleMessageModal.bind(this);
      this.togglePatientModal = this.togglePatientModal.bind(this);
      this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
    }
  
    componentDidMount() {
      const { labaudit, onGetDiscountLabHazirToLabs } = this.props;
      onGetDiscountLabHazirToLabs(this.props.match.params.id);
      this.setState({ labaudit });
  
      const { auditorList, onGetAuditorList } = this.props;
      onGetAuditorList();
      this.setState({ auditorList });
  
          //  auditor central list
      const { auditorCentralTerritoryList, onGetAuditorCentralList } = this.props;
      onGetAuditorCentralList();
      this.setState({ auditorCentralTerritoryList });
      //  auditor south list
      const { auditorSouthTerritoryList, onGetAuditorSouthList } = this.props;
      onGetAuditorSouthList();
      this.setState({ auditorSouthTerritoryList });
      //  auditor north list
      const { auditorNorthTerritoryList, onGetAuditorNorthList } = this.props;
      onGetAuditorNorthList();
      this.setState({ auditorNorthTerritoryList });
    }

    onClickAuditedEvent = (e, arg) => {
        this.setState({
          id: this.props.match.params.id,
        });
        this.setState({ auditModal: true, });
        
      };
      
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
        // auditModal: false,
        PatientModal: false,
        isHovered: false,
      });
    };
    handleButtonClick = () => {
      this.setState({ auditModal: true });
    }
    handleEditAllBtnClick = () => {

      const { onAddNewAudit , onGetDiscountLabHazirToLabs} = this.props;
      const data = {
        reason_of_reaudit: "",
      };
      onAddNewAudit(data, this.props.match.params.id);
      this.setState({ showAlert: true });
      setTimeout(() => {
        onGetDiscountLabHazirToLabs(this.props.match.params.id);
      }, 1000);
      setTimeout(() => {
        this.setState({ auditModal: false , showAlert: false});
      }, 2000);
    }
    togglePatientModal = () => {
      this.setState(prevState => ({
        PatientModal: !prevState.PatientModal,
      }));
      this.state.btnText === "Copy"
        ? this.setState({ btnText: "Copied" })
        : this.setState({ btnText: "Copy" });
    };
    toggle() {
      this.setState(prevState => ({
        modal: !prevState.modal,
      }));
    }
  
    toggleMessageModal = () => {
      this.setState(prevState => ({
        messageModal: !prevState.messageModal,
      }));
    };
  
    openMessageModal = (e, arg) => {
      this.setState({ messageModal: true, message: arg.message });
    };
  
    handleApprovedEvent = (e, arg) => {
      this.setState({
        id: arg,
      });
  
      this.toggle();
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
      const { labaudit } = this.props;
      // Ensure labaudit is an array and has data
      if (!Array.isArray(labaudit) || labaudit.length === 0) {
        return <div>No audits available</div>; // Handle empty state
      }
    
      // Check if all audits have `register_at` >= `frequency`
      const allAuditsValid = labaudit.every(audit => audit.register_at >= audit.frequency);
      const isButtonDisabled = !allAuditsValid;
    
      console.log("All Audits Valid:", allAuditsValid);
      console.log("Is Button Disabled:", isButtonDisabled);
      const { SearchBar } = Search;
      const {
        onGetDiscountLabHazirToLabs,
        // onUpdateDiscountLabHazirToLab,
      } = this.props;
      const { onAddNewAudit } = this.props;
      
      console.log("data get on the page is ", this.props.labaudit)
      const data = this.state.data;
      const { onAssignAudit } = this.props;
  
      const pageOptions = {
        sizePerPage: 10,
        totalSize: labaudit.length, // replace later with size(labaudit),
        custom: true,
      };
  
      const defaultSorted = [
        {
          dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
          order: "desc", // desc or asc
        },
      ];
  
      const auditorList = [];
      for (let i = 0; i < this.props.auditorList.length; i++) {
        auditorList.push({
          label: this.props.auditorList[i].name,
          value: this.props.auditorList[i].id,
        });
      }
    // Central Office
      const auditorCentralTerritoryList = [];
  
      for (let i = 0; i < this.props.auditorCentralTerritoryList.length; i++) {
        auditorCentralTerritoryList.push({
          label: this.props.auditorCentralTerritoryList[i].name,
          value: this.props.auditorCentralTerritoryList[i].id,
        });
    
      }
  
      // South Office
      const auditorSouthTerritoryList = [];
  
      for (let i = 0; i < this.props.auditorSouthTerritoryList.length; i++) {
        auditorSouthTerritoryList.push({
          label: this.props.auditorSouthTerritoryList[i].name,
          value: this.props.auditorSouthTerritoryList[i].id,
        });
    
      }
      // North Office
      const auditorNorthTerritoryList = [];
  
      for (let i = 0; i < this.props.auditorNorthTerritoryList.length; i++) {
        auditorNorthTerritoryList.push({
          label: this.props.auditorNorthTerritoryList[i].name,
          value: this.props.auditorNorthTerritoryList[i].id,
        });
    
      }
  
      return (
        <React.Fragment>
          <div className="page-content">
            <MetaTags>
              <title>Pending Audits | Audit Hazir</title>
            </MetaTags>
  
            <Container fluid>
              {/* Render Breadcrumbs */}
              <Breadcrumbs title="Audits" breadcrumbItem="Pending" />
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <PaginationProvider
                        pagination={paginationFactory(pageOptions)}
                        keyField="id"
                        columns={this.state.pendingAuditListColumns}
                        data={labaudit}
                      >
                        {({ paginationProps, paginationTableProps }) => (
                          <ToolkitProvider
                            keyField="id"
                            columns={this.state.pendingAuditListColumns}
                            data={labaudit}
                            search
                          >
                            {toolkitprops => (
                              <React.Fragment>
                                <Row className="mb-2">
                                  {/* <Col sm="4">
                                    <div className="search-box ms-2 mb-2 d-inline-block">
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                        />
                                        <i className="bx bx-search-alt search-icon" />
                                      </div>
                                    </div>
                                  </Col> */}
                                  <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-18 btn-block btn btn-success"
                                      onClick={this.handleButtonClick}
                                      disabled={isButtonDisabled}
                                    >
                                      Generate Audit
                                    </Button>
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
                                              "",
                                          }} 
                                          onSubmit={values => {
                                            const {
                                             onAddNewAudit,
                                            } = this.props;

                                            const data = {
                                              // id: this.state.id,
                                              reason_of_reaudit: "",
                                            };

                                            console.log(data);

                                            onAddNewAudit(data, this.props.match.params.id);
                                            this.setState({
                                              auditModal: false,
                                            });
                                            setTimeout(() => {
                                              onGetDiscountLabHazirToLabs(this.props.match.params.id);
                                            }, 1000);
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                    <div className="mb-3">
                                                      <h5>Generate Audit of lab</h5>
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
    {/* Modal Component */}
    <Modal
          isOpen={this.state.auditModal}
          className={this.props.className}
          // onPointerLeave={this.handleMouseExit}
        >
          {this.state.showAlert && (
            <Alert color="success" style={{ marginTop: "13px",marginLeft: "13px", marginRight: "13px" }}>
              Audit Generated Successfully.
            </Alert>
          )}
     <div className="modal-header">
            <h5 className="modal-title"> Generate Lab Audit</h5>
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
            <Row>
              <Col>
                <p> By clicking the <strong>&quot;Generate Audit&quot;</strong> button below, you will initiate the process to generate a new audit for the selected lab. This will create a record for the lab audit.</p>
              </Col>
            </Row>
            <Row>
              <Col className="text-end">
                <Button
                  color="primary"
                  className="font-18 btn-block btn btn-success"
                  onClick={this.handleEditAllBtnClick}
                >
                  Generate Audit
                </Button>
              </Col>
            </Row>
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
                                                "Please select auditor to assign complaint"
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
                                                onGetDiscountLabHazirToLabs(this.props.match.params.id);
                                              }, 1000);
  
                                              this.toggle();
                                            }}
                                          >
                                            {({ errors, status, touched }) => (
                                              <Form>
                                                <Row>
                                                <Col className="col-12">
                                                      <div className="mb-3">
                                                      <Label className="form-label">
                                                        Office
                                                      </Label>
                                                      <Field
                                                        name="office"
                                                        as="select"
                                                        className="form-control"
                                                        onChange={e => {
                                                          this.setState({
                                                            labaudit: {
                                                           
                                                              office: e.target.value,
                                                            
                                                            },
                                                          });
                                                        }}
                                                        multiple={false}
                                                        value={
                                                          this.state.office
                                                        }
                                                      >
                                                         <option value="">
                                                        ---Select Office---
                                                        </option>
                                                        <option value="Central Office">
                                                        Central Office
                                                        </option>
                                                        <option value="South Office">
                                                        South Office
                                                        </option>
                                                        <option value="North Office">
                                                        North Office
                                                        </option>
                                                     
                                                      </Field>
                                                    </div>
                                                 
                                            {this.state.labaudit.office =="Central Office"
                                                  &&(
  
                                                    <div className="mb-3 select2-container">
                                                      <Label>Assigned to</Label>
                                                      <Select
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
                                                        options={auditorCentralTerritoryList}
                                                        placeholder="Select Auditor..."
                                                      />
                                                      <ErrorMessage
                                                        name="assignedTo"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  )} 
                                                   {/* South Office */}
                                                   {this.state.labaudit.office =="South Office"
                                                  &&(
  
                                                    <div className="mb-3 select2-container">
                                                      <Label>Assigned to</Label>
                                                      <Select
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
                                                        options={auditorSouthTerritoryList}
                                                        placeholder="Select Auditor..."
                                                      />
                                                      <ErrorMessage
                                                        name="assignedTo"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  )} 
                                                   {/* North Office */}
                                                   {this.state.labaudit.office =="North Office"
                                                  &&(
  
                                                    <div className="mb-3 select2-container">
                                                      <Label>Assigned to</Label>
                                                      <Select
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
                                                        options={auditorNorthTerritoryList}
                                                        placeholder="Select Auditor..."
                                                      />
                                                      <ErrorMessage
                                                        name="assignedTo"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  )} 
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
  PendingAudits.propTypes = {
    match: PropTypes.object,
    labaudit: PropTypes.array,
    auditorList: PropTypes.array,
    className: PropTypes.any,
    onGetAuditorList: PropTypes.func,
    onAssignAudit: PropTypes.func,
    auditorCentralTerritoryList: PropTypes.array,
    auditorSouthTerritoryList:  PropTypes.array,
    auditorNorthTerritoryList:  PropTypes.array,
    onGetAuditorCentralList: PropTypes.func,
    onGetAuditorSouthList: PropTypes.func,
    onGetAuditorNorthList: PropTypes.func,
    onGetDiscountLabHazirToLabs: PropTypes.func,
    onAddNewAudit: PropTypes.func,
  };
  const mapStateToProps = ({ labsList, staff, auditorTerritoryList}) => ({
    labaudit: labsList.labaudit,
    auditorList: staff.auditorList,
    auditorCentralTerritoryList: auditorTerritoryList.auditorCentralTerritoryList,
    auditorSouthTerritoryList: auditorTerritoryList.auditorSouthTerritoryList,
    auditorNorthTerritoryList: auditorTerritoryList.auditorNorthTerritoryList,
  });
  
  const mapDispatchToProps = (dispatch, ownProps) => ({
    onGetDiscountLabHazirToLabs: id => dispatch(getLabsAllAuditList(id)),
    onAssignAudit: data => dispatch(assignAudit(data)),
    onGetAuditorList: () => dispatch(getAuditorList()),
    onGetAuditorCentralList: () => dispatch(getAuditorCentralList()),
    onGetAuditorSouthList: () => dispatch(getAuditorSouthList()),
    onGetAuditorNorthList: () => dispatch(getAuditorNorthList()),
    onAddNewAudit: (audit, id) => dispatch(addNewAudit(audit, id)),
  });
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(PendingAudits));