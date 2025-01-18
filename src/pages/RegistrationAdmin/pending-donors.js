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
  getPendingDonors,
  approveUnapproveDonor,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingDonors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingDonors: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingDonor: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingDonorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingDonor) => <>{pendingDonor.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Phone No.",
          sort: true,
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
        },
        {
          dataField: "company_name",
          text: "Company Name",
          sort: true,
          formatter: (cellContent, donor) => (
            <>
              {donor.type == "Individual" ? (
                <span>None</span>
              ) : (
                <span>{donor.company_name}</span>
              )}
            </>
          ),
        },
        {
          dataField: "is_income_tax_payable",
          text: "Income tax payable",
          sort: true,
          formatter: (cellContent, donor) => (
            <>
              {donor.is_income_tax_payable == true ? (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning blinking-text">Yes</span>
              ) : (
                <span>No</span>
              )}
               <style>
          {`
            .blinking-text {
              animation: blinking 1s infinite;
            }

            @keyframes blinking {
              0% {
                opacity: 1;
              }
              50% {
                opacity: 0;
              }
              100% {
                opacity: 1;
              }
            }
          `}
        </style>
            </>
            
          ),
        },
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, pendingDonor) => (
            <>
              <span>
                {new Date(pendingDonor.registered_at).toLocaleString("en-US")}
              </span>
            </>
          ),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, donor) => (
            <>
            <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.handleApprovedEvent(donor.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link> 
              </Tooltip>{" "}
              <Tooltip title="Delete">
              <Link
                className="btn btn-danger btn-rounded"
                to="#"
                onClick={() => this.handleUnapprovedEvent(donor.id)}
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
    const { pendingDonors, onGetPendingDonors } = this.props;
    onGetPendingDonors();
    this.setState({ pendingDonors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
    console.log("ID: ", this.state.id);
  };

  handleUnapprovedEvent = id => {
    this.setState({ id: id, isApproved: false, unapprovedModal: true });
  };

  callOnApproveUnapproveDonor = () => {
    const { onApproveUnapproveDonor, onGetPendingDonors } = this.props;

    const data = {
      id: this.state.user_id,
      donorId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveDonor(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingDonors();
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

    const { pendingDonors } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pendingDonors.length, // replace later with size(pendingDonors),
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
            <title>Pending Donors | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveDonor}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Donors" breadcrumbItem="Pending" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingDonorListColumns}
                      data={pendingDonors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingDonorListColumns}
                          data={pendingDonors}
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

PendingDonors.propTypes = {
  match: PropTypes.object,
  pendingDonors: PropTypes.array,
  className: PropTypes.any,
  onGetPendingDonors: PropTypes.func,
  onApproveUnapproveDonor: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  pendingDonors: registrationAdmin.pendingDonors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveDonor: data => dispatch(approveUnapproveDonor(data)),
  onGetPendingDonors: () => dispatch(getPendingDonors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingDonors));
