import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
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
import { Tooltip } from "@material-ui/core";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getPendingDoctors,
  approveUnapproveDoctor,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingDoctors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingDoctors: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingDoctor: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingDoctorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingDoctor) => <>{pendingDoctor.id}</>,
        },
        {
          dataField: "doctor_name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "contact",
          text: "Phone No.",
          sort: true,
        },
        {
          dataField: "cnic",
          text: "CNIC No.",
          sort: true,
        },   
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, pendingDoctor) => (
            <>
              <span>
                {new Date(pendingDoctor.registered_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "data",
          text: "Action",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, doctor) => (
            <>
              <Tooltip title="Update">
                <Link
                  className="btn btn-success btn-rounded"
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.handleApprovedEvent(doctor.id);
                  }}
                >
                  <i className="mdi mdi-check-circle font-size-14"></i>
                </Link>
              </Tooltip>{" "}
              <Tooltip title="Delete">
                <Link
                  className="btn btn-danger btn-rounded"
                  to="#"
                  onClick={e => {
                    e.preventDefault();
                    this.handleUnapprovedEvent(doctor.id);
                  }}
                >
                  <i className="mdi mdi-close-circle font-size-14"></i>
                </Link>
              </Tooltip>
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { pendingDoctors, onGetPendingDoctors } = this.props;
    onGetPendingDoctors();
    this.setState({ pendingDoctors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (id) => {
  console.log("Clicked ID:", id); // ← This should log 10, 9, etc.
  this.setState({ id: id, isApproved: true, approvedModal: true }, () => {
    console.log("State ID after setState:", this.state.id);
  });
};


  handleUnapprovedEvent = id => {
    this.setState({ id: id, isApproved: false, unapprovedModal: true });
  };

  callOnApproveUnapproveDoctor = () => {
    const { onApproveUnapproveDoctor, onGetPendingDoctors } = this.props;

    const data = {
      id: this.state.user_id,
      doctorId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveDoctor(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingDoctors();
    }, 2000);

    this.setState({ unapprovedModal: false });
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

    const { pendingDoctors } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pendingDoctors.length, // replace later with size(pendingDoctors),
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
            <title>Pending Doctors | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveDoctor}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Doctors" breadcrumbItem="Pending" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingDoctorListColumns}
                      data={pendingDoctors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingDoctorListColumns}
                          data={pendingDoctors}
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
                                      classes={"table align-middle  table-condensed table-hover"}
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

PendingDoctors.propTypes = {
  match: PropTypes.object,
  pendingDoctors: PropTypes.array,
  className: PropTypes.any,
  onGetPendingDoctors: PropTypes.func,
  onApproveUnapproveDoctor: PropTypes.func,
};

const mapStateToProps = (state) => {
  console.log('Full Redux state:', state);
  console.log('Pending Doctors:', state.registrationAdmin?.pendingDoctors);

  return {
    pendingDoctors: state.registrationAdmin?.pendingDoctors || [],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveDoctor: data => dispatch(approveUnapproveDoctor(data)),
  onGetPendingDoctors: () => dispatch(getPendingDoctors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingDoctors));
