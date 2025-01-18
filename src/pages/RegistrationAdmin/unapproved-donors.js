import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getUnapprovedDonors,
  approveUnapproveDonor,
} from "store/registration-admin/actions";
import { Tooltip } from "@material-ui/core";
import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class UnapprovedDonors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedDonors: [],
      id: "",
      isApproved: false,
      unapprovedModal: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedDonor: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedDonorListColumns: [
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
                <span>Yes</span>
              ) : (
                <span>No</span>
              )}
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
          dataField: "data",
          text: "id",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pendingDonor) => (
            <>
            <Tooltip title="Update">
              <Link
                className="btn btn-success btn-rounded"
                to="#"
                onClick={e => this.handleApprovedEvent(pendingDonor.id)}
              >
                <i className="mdi mdi-check-circle font-size-14"></i>
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
    const { unapprovedDonors, onGetUnapprovedDonors } = this.props;
    onGetUnapprovedDonors(this.state.user_id);
    this.setState({ unapprovedDonors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = id => {
    this.setState({ id: id, isApproved: true, unapprovedModal: true });
  };

  callOnApproveUnapproveDonor = () => {
    const { onApproveUnapproveDonor, onGetUnapprovedDonors } = this.props;

    const data = {
      id: this.state.user_id,
      donorId: this.state.id,
      isApproved: this.state.isApproved,
    };

    // calling to unapprove lab
    onApproveUnapproveDonor(data);

    // Calling to update list record
    setTimeout(() => {
      onGetUnapprovedDonors();
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

    const { unapprovedDonors } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedDonors.length, // replace later with size(unapprovedDonors),
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
            onYesClick={this.callOnApproveUnapproveDonor}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Donors" breadcrumbItem="Unapproved" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedDonorListColumns}
                      data={unapprovedDonors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedDonorListColumns}
                          data={unapprovedDonors}
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

UnapprovedDonors.propTypes = {
  match: PropTypes.object,
  unapprovedDonors: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedDonors: PropTypes.func,
  onApproveUnapproveDonor: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  unapprovedDonors: registrationAdmin.unapprovedDonors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveDonor: data => dispatch(approveUnapproveDonor(data)),
  onGetUnapprovedDonors: () => dispatch(getUnapprovedDonors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnapprovedDonors));
