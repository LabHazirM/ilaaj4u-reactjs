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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getApprovedDonors } from "store/registration-admin/actions";
import "assets/scss/table.scss";

class ApprovedDonors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedDonors: [],
      id: "",
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
          dataField: "done_at",
          text: "Approved at",
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
          dataField: "is_blocked",
          text: "Blocked",
          sort: true,
          formatter: (cellContent, donor) => (
            <>
              {donor.is_blocked == true ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  Yes
                </span>
              ) : (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  No
                </span>
              )}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { approvedDonors, onGetApprovedDonors } = this.props;
    onGetApprovedDonors(this.state.user_id);
    this.setState({ approvedDonors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePatientFeedbackClick = (e, arg) => {
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
    const { SearchBar } = Search;

    const { approvedDonors } = this.props;
    const { onGetApprovedDonors } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: approvedDonors.length, // replace later with size(approvedDonors),
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
            <title>Approved Donors | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Donors" breadcrumbItem="Approved" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedDonorListColumns}
                      data={approvedDonors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedDonorListColumns}
                          data={approvedDonors}
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

ApprovedDonors.propTypes = {
  match: PropTypes.object,
  approvedDonors: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedDonors: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  approvedDonors: registrationAdmin.approvedDonors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedDonors: () => dispatch(getApprovedDonors()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedDonors));
