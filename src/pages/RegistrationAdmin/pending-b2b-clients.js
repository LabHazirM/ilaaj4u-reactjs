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
import { Tooltip } from "@material-ui/core";
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
  getPendingB2BClients,
  approveUnapproveB2BClient,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingB2BClients extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pendingB2BClients: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingB2BClient: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pendingB2BClientListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pendingB2BClient) => (
            <>{pendingB2BClient.id}</>
          ),
        },
        {
          dataField: "business_name",
          text: "Business name",
          sort: true,
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "landline",
          text: "Landline",
          sort: true,
        },
        {
          dataField: "registered_at",
          text: "Registered at",
          sort: true,
          formatter: (cellContent, pendingB2BClient) => (
            <>
              <span>
                {new Date(pendingB2BClient.registered_at).toLocaleString(
                  "en-US"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "website_url",
          text: "Website URL",
          sort: true,
          formatter: (cellContent, pendingB2BClient) => (
            <>
              <Link
                to={{
                  pathname: pendingB2BClient.website_url,
                }}
                target="_blank"
              >
                {pendingB2BClient.website_url}
              </Link>
            </>
          ),
        },
        {
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pendingB2BClient) => (
            <>
            <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.handleApprovedEvent(pendingB2BClient.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>
              </Tooltip>{" "}
              <Tooltip title="Delete">
              <Link
                className="btn btn-danger btn-rounded"
                to="#"
                onClick={() => this.handleUnapprovedEvent(pendingB2BClient.id)}
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
    const { pendingB2BClients, onGetPendingB2BClients } = this.props;
    onGetPendingB2BClients();
    this.setState({ pendingB2BClients });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  handleUnapprovedEvent = id => {
    this.setState({ id: id, isApproved: false, unapprovedModal: true });
  };

  callOnApproveUnapproveB2BClient = () => {
    const { onApproveUnapproveB2BClient, onGetPendingB2BClients } = this.props;

    const data = {
      id: this.state.user_id,
      b2bId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveB2BClient(data);

    // Calling to update list record
    setTimeout(() => {
      onGetPendingB2BClients();
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

    const { pendingB2BClients } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pendingB2BClients.length, // replace later with size(pendingB2BClients),
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
            <title>Pending B2B Clients | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveB2BClient}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Clients" breadcrumbItem="Pending" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingB2BClientListColumns}
                      data={pendingB2BClients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingB2BClientListColumns}
                          data={pendingB2BClients}
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
                                      classes={"table align-middle table-condensed table-hover"}
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

PendingB2BClients.propTypes = {
  match: PropTypes.object,
  pendingB2BClients: PropTypes.array,
  className: PropTypes.any,
  onGetPendingB2BClients: PropTypes.func,
  onApproveUnapproveB2BClient: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  pendingB2BClients: registrationAdmin.pendingB2BClients,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveB2BClient: data =>
    dispatch(approveUnapproveB2BClient(data)),
  onGetPendingB2BClients: () => dispatch(getPendingB2BClients()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingB2BClients));
