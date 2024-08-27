import React, { Component, useState } from "react";
import Select from "react-select";
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
  Button,
  ModalHeader,
} from "reactstrap";
import filterFactory, {textFilter, selectFilter} from "react-bootstrap-table2-filter";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import moment from 'moment';

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getInProcessComplaints,
  assignComplaint,
  //   getCSRList,
} from "store/csr-admin/actions";

import { getCSRList } from "store/staff/actions";
//Office
import { getCsrCentralList,
       getCsrSouthList,
       getCsrNorthList,
      } from "store/csr-territory-list/actions";
import "assets/scss/table.scss";

class InProcessComplaints extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      inProcessComplaints: [],
      id: "",
      csrName: "",
      assignedTo: "",
      btnText: "Copy",
      message: "",
      isUrgent: false, 
      InProcessComplaints: "",
      inProcessComplaint: "",
      csrList: [],
      // Office
      csrCentralTerritoryList: [],
      csrSouthTerritoryList: [],
      csrNorthTerritoryList: [],
      messageModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      inProcessComplaintListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, inProcessComplaint) => (
            <>{inProcessComplaint.id}</>
          ),
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
          formatter: (cellContent, complaint) => (
            <>
              <strong>{complaint.complaint_id}</strong>
            </>
          ),filter: textFilter(),
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
          formatter: (cellContent, inProcessComplaint) => (
            <>
              <span className="float-start">
                  <Link
                    to="#"
                    // onClick={e => this.openPatientModal(e, inProcessComplaint)}
                    onMouseEnter={e => this.openPatientModal(e, inProcessComplaint)}
                    onPointerLeave={this.handleMouseExit()}
                  >
                   {inProcessComplaint.name}
                  </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "complainee",
        //   text: "Complaint Against",
        //   sort: true,
        //   formatter: (cellContent, inProcessComplaint) => (
        //     <>
        //           {/* {inProcessComplaint.complainee},{" "} */}
        //           {inProcessComplaint.labhazir_complainee}{" "}
        //           {inProcessComplaint.lab_name}
        //     </>
        //   ),filter: textFilter(),
        // },
        {
          dataField: "complainee",
          text: "Complaint Against",
          sort: true,
          formatter: (cellContent, pendingComplaint) => (
            <>
              {pendingComplaint.complainee === "Lab" ? (
                <Link to="#" 
                  onMouseEnter={e => this.openCompalneeModal(e, pendingComplaint)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  <strong className="text-danger float-start">{pendingComplaint.complainee}</strong><br></br>
                  <span className="float-start">{pendingComplaint.lab_name}</span>
                </Link>
              ) : (
                <>
                  <strong className="text-danger float-start">{pendingComplaint.complainee}</strong><br></br>
                  <span className="float-start">{pendingComplaint.labhazir_complainee}</span>
                </>
              )}
            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'Lab': 'Lab',
              'LabHazir': 'LabHazir',
            },
            defaultValue: 'All',
          }),
          
        },
        // {
        //   dataField: "email",
        //   text: "Email",
        //   sort: true,
        // },
        // {
        //   dataField: "phone",
        //   text: "Phone No.",
        //   sort: true,
        // },

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
        // },
        {
          dataField: "csr_name",
          text: "Assigned to",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "assigned_at",
          text: "Assigned at",
          sort: true,
          formatter: (cellContent, complaint) => (
            <>
              <span>
                {moment(complaint.assigned_at).format("DD MMM YYYY, h:mm A")}
              </span>
            </>
          ),
          filter: textFilter(),
        }, 
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
          ),filter: textFilter(),
        },
       
        {
          dataField: "office",
          text: "Office",
          sort: true, 
          filter: textFilter(),    
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, inProcessComplaint, complaint) => (
            <>
              <Link
                className="btn btn-success"
                to="#"
                onClick={e => this.handleApprovedEvent(e, inProcessComplaint)}
              >
                Reassign
              </Link>{" "}
            </>
          ),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Chat",
          formatter: (cellContent, complaint) => (
            <>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/csr-notes-admincomplains/${complaint.id}`}
                ></Link>
              </Tooltip>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.toggleComplaneeModal.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { inProcessComplaints, onGetInProcessComplaints } = this.props;
    onGetInProcessComplaints();
    this.setState({ inProcessComplaints });

    const { csrList, onGetCSRList } = this.props;
    onGetCSRList();
    this.setState({ csrList });

    //  csr central list
    const { csrCentralTerritoryList, onGetCsrCentralList } = this.props;
    onGetCsrCentralList();
    this.setState({ csrCentralTerritoryList });
   //  csr south list
    const { csrSouthTerritoryList, onGetCsrSouthList } = this.props;
    onGetCsrSouthList();
    this.setState({ csrSouthTerritoryList });
   //  csr north list
    const { csrNorthTerritoryList, onGetCsrNorthList } = this.props;
    onGetCsrNorthList();
    this.setState({ csrNorthTerritoryList });

  }
  toggleComplaneeModal = () => {
    this.setState(prevState => ({
      complaneeModal: !prevState.complaneeModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  openCompalneeModal = (e, arg) => {
    console.log("message model is call in case when complanee is lab", arg)
    this.setState({ complaneeModal: true, 
      lab_city: arg.lab_city,
      lab_phone: arg.lab_phone,

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
      complaneeModal: false,

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
    this.setState({ messageModal: true, message: arg.message , subject:arg.subject});
  };

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg.id,
      csrName: arg.csr_name,
      assignedTo: arg.assigned_to,
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
    const { SearchBar } = Search;

    const { inProcessComplaints } = this.props;
    const data = this.state.data;
    const { onAssignComplaint, onGetInProcessComplaints } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: inProcessComplaints.length, // replace later with size(inProcessComplaints),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const csrList = [];
    for (let i = 0; i < this.props.csrList.length; i++) {
      csrList.push({
        label: this.props.csrList[i].name,
        value: this.props.csrList[i].id,
      });
    }

        // Central Office
        const csrCentralTerritoryList = [];

        for (let i = 0; i < this.props.csrCentralTerritoryList.length; i++) {
          csrCentralTerritoryList.push({
            label: this.props.csrCentralTerritoryList[i].name,
            value: this.props.csrCentralTerritoryList[i].id,
          });
      
        }
        // South Office
        const csrSouthTerritoryList = [];
    
        for (let i = 0; i < this.props.csrSouthTerritoryList.length; i++) {
          csrSouthTerritoryList.push({
            label: this.props.csrSouthTerritoryList[i].name,
            value: this.props.csrSouthTerritoryList[i].id,
          });
      
        }
        // North Office
        const csrNorthTerritoryList = [];
    
        for (let i = 0; i < this.props.csrNorthTerritoryList.length; i++) {
          csrNorthTerritoryList.push({
            label: this.props.csrNorthTerritoryList[i].name,
            value: this.props.csrNorthTerritoryList[i].id,
          });
      
        }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Open Complaints | Complaint Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Complaints" breadcrumbItem="Open" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.inProcessComplaintListColumns}
                      data={inProcessComplaints}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.inProcessComplaintListColumns}
                          data={inProcessComplaints}
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
                                  </div>
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
                                      isOpen={this.state.complaneeModal}
                                      onPointerLeave={this.handleMouseExit}
                                      toggle={this.toggleComplaneeModal}
                                    >
                                    <ModalHeader
                                        toggle={this.toggleComplaneeModal}
                                        tag="h4"
                                      >
                                        <span>Complainant Against: </span>
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik>
                                          <Form>
                                        <Row>
                                        <Col className="col-12">

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
                                              "Please select CSR to assign complaint"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.id,
                                              assignedTo: values.assignedTo,
                                              is_it_urgent: this.state.isUrgent, // Include the checkbox value

                                            };

                                            // Assign complaint
                                            onAssignComplaint(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetInProcessComplaints();
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
                                                          InProcessComplaints: {
                                                         
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
                                               
                                          {this.state.InProcessComplaints.office =="Central Office"
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
                                                      options={csrCentralTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* South Office */}
                                                 {this.state.InProcessComplaints.office =="South Office"
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
                                                      options={csrSouthTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                 {/* North Office */}
                                                 {this.state.InProcessComplaints.office =="North Office"
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
                                                      options={csrNorthTerritoryList}
                                                      placeholder="Select CSR..."
                                                    />
                                                    <ErrorMessage
                                                      name="assignedTo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                )} 
                                                </Col>
                                                <Col className="col-12">
                                              <div className="mb-3 form-check">
                                                <label htmlFor="isUrgentCheckbox" className="form-check-label">
                                                  This Complaint Requires Immediate Attention!
                                                </label>
                                                <input
                                                  type="checkbox"
                                                  id="isUrgentCheckbox"
                                                  className="form-check-input"
                                                  checked={this.state.isUrgent}
                                                  onChange={(e) => this.setState({ isUrgent: e.target.checked })}
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

InProcessComplaints.propTypes = {
  match: PropTypes.object,
  inProcessComplaints: PropTypes.array,
  csrList: PropTypes.array,
  className: PropTypes.any,
  onGetInProcessComplaints: PropTypes.func,
  onGetCSRList: PropTypes.func,
  onAssignComplaint: PropTypes.func,
  // office
  csrCentralTerritoryList: PropTypes.array,
  csrSouthTerritoryList:  PropTypes.array,
  csrNorthTerritoryList:  PropTypes.array,
  onGetCsrCentralList: PropTypes.func,
  onGetCsrSouthList: PropTypes.func,
  onGetCsrNorthList: PropTypes.func,
};
const mapStateToProps = ({ csrAdmin, staff, csrTerritoryList }) => ({
  inProcessComplaints: csrAdmin.inProcessComplaints,
  csrList: staff.csrList,
    // Office 
  csrCentralTerritoryList: csrTerritoryList.csrCentralTerritoryList,
  csrSouthTerritoryList: csrTerritoryList.csrSouthTerritoryList,
  csrNorthTerritoryList: csrTerritoryList.csrNorthTerritoryList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignComplaint: data => dispatch(assignComplaint(data)),
  onGetInProcessComplaints: () => dispatch(getInProcessComplaints()),
  onGetCSRList: () => dispatch(getCSRList()),
  // office
  onGetCsrCentralList: () => dispatch(getCsrCentralList()),
  onGetCsrSouthList: () => dispatch(getCsrSouthList()),
  onGetCsrNorthList: () => dispatch(getCsrNorthList()),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InProcessComplaints));
