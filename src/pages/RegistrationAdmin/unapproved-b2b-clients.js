import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Tooltip } from "@material-ui/core";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getUnapprovedB2BClients,
  approveUnapproveB2BClient,
} from "store/registration-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class UnapprovedB2BClients extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedB2BClients: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedB2BClient: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedB2BClientListColumns: [
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
          dataField: "done_at",
          text: "Unapproved at",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                {new Date(approvedLab.done_at).toLocaleString("en-US")}
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
            <div>
          <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.handleApprovedEvent(pendingB2BClient.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
              </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { unapprovedB2BClients, onGetUnapprovedB2BClients } = this.props;
    onGetUnapprovedB2BClients(this.state.user_id);
    this.setState({ unapprovedB2BClients });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  callOnApproveUnapproveB2BClient = () => {
    const { onApproveUnapproveB2BClient, onGetUnapprovedB2BClients } =
      this.props;

    const data = {
      id: this.state.user_id,
      b2bId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveB2BClient(data);

    // Calling to update list record
    setTimeout(() => {
      onGetUnapprovedB2BClients();
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

    const { unapprovedB2BClients } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedB2BClients.length, // replace later with size(unapprovedB2BClients),
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
            <title>Unapproved B2B Clients | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            onYesClick={this.callOnApproveUnapproveB2BClient}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2BClients" breadcrumbItem="Unapproved" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedB2BClientListColumns}
                      data={unapprovedB2BClients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedB2BClientListColumns}
                          data={unapprovedB2BClients}
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

UnapprovedB2BClients.propTypes = {
  match: PropTypes.object,
  unapprovedB2BClients: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedB2BClients: PropTypes.func,
  onApproveUnapproveB2BClient: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  unapprovedB2BClients: registrationAdmin.unapprovedB2BClients,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveB2BClient: data =>
    dispatch(approveUnapproveB2BClient(data)),
  onGetUnapprovedB2BClients: () => dispatch(getUnapprovedB2BClients()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnapprovedB2BClients));
