import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
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
  ModalHeader,

} from "reactstrap";

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
  getUnapprovedCorporate,
  approveUnapproveCorporate,
} from "store/registration-admin/actions";
import "assets/scss/table.scss";

class UnapprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      UnapprovedCorporate: [],
      id: "",
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      pendingCorporates: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
        pendingCorporatesListColumns: [
          {
            text: "id",
            dataField: "id",
            sort: true,
            hidden: true,
            formatter: (cellContent, pendingCorporates) => <>{pendingCorporates.id}</>,
          },
          {
            dataField: "name",
            text: "Corporate name",
            sort: true,
            formatter: (cellContent, pendingCorporates) => (
              <>
                <span style={{
                  width: '200px', // Set your desired width here
                  fontSize: '14px',
  
                  textOverflow: 'ellipsis',
                  whiteSpace: 'prewrap',
                  textAlign: 'left', // Align text to the left
                  display: 'block',
                }}>
                  
                    {pendingCorporates.name}
                  
                </span>
              </>
            ), filter: textFilter(),
          },
          {
            dataField: "email",
            text: "Email",
            sort: true,
            formatter: (cellContent, pendingCorporates) => (
              <>
                <span style={{
                  width: '200px', // Set your desired width here
                  fontSize: '14px',
  
                  textOverflow: 'ellipsis',
                  whiteSpace: 'prewrap',
                  textAlign: 'left', // Align text to the left
                  display: 'block',
                }}>
                  
                    {pendingCorporates.email}
                  
                </span>
              </>
            ), filter: textFilter(),
          },
  
          {
            dataField: "city",
            text: "City",
            sort: true,
            formatter: (cellContent, pendingCorporates) => (
              <>
                <span style={{
                  width: '200px', // Set your desired width here
                  fontSize: '14px',
  
                  textOverflow: 'ellipsis',
                  whiteSpace: 'prewrap',
                  textAlign: 'left', // Align text to the left
                  display: 'block',
                }}>
                  {pendingCorporates.city}
  
                </span>
              </>
            ), filter: textFilter(),
          },
         
          {
            dataField: "address",
            text: "Address",
            sort: true,
            formatter: (cellContent, pendingCorporates) => (
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',
  
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                {pendingCorporates.address}
  
              </span>
            ), filter: textFilter(),
  
          },
  
          {
            dataField: "landline",
            text: "Phone No",
            sort: true,
            formatter: (cellContent, pendingCorporates) => (
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',
  
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'center', 
                display: 'block',
              }}>
                {pendingCorporates.landline}
  
              </span>
            ), filter: textFilter(),
          },
          // {
          //   dataField: "data",
          //   text: "id",
          //   isDummyField: true,
          //   editable: false,
          //   text: "Action",
          //   formatter: (cellContent, pendingCorporates) => (
          //     <>
          //       <Tooltip title="Update">
          //         <Link
          //           className="btn btn-success btn-rounded"
          //           to="#"
          //           onClick={e => this.handleApprovedEvent(pendingCorporates.id)}
  
          //         >
          //           <i className="mdi mdi-check-circle font-size-14"></i>
          //         </Link>
          //       </Tooltip>
          //       {" "}
          //       <Tooltip title="Delete">
          //         <Link
          //           className="btn btn-danger btn-rounded"
          //           to="#"
          //           onClick={() => this.handleUnapprovedEvent(pendingCorporates.id)}
          //         >
          //           <i className="mdi mdi-close-circle font-size-14"></i>
          //         </Link>
          //       </Tooltip>
          //     </>
          //   ),
          // },
        ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { UnapprovedCorporate, onGetUnapprovedLabs } = this.props;
    onGetUnapprovedLabs(this.state.user_id);
    this.setState({ UnapprovedCorporate });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

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
    const { SearchBar } = Search;

    const { UnapprovedCorporate } = this.props;
    const data = this.state.data;
    const { onapproveUnapproveCorporate, onGetUnapprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: UnapprovedCorporate.length, // replace later with size(UnapprovedCorporate),
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
            <title>Unapproved Corporates | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate" breadcrumbItem="Unapproved" />
            <Row>
            <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be UnapprovedApproved and Inactive Corporates Shown on it.
                  </strong>
                  </span>
                </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingCorporatesListColumns}
                      data={UnapprovedCorporate}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingCorporatesListColumns}
                          data={UnapprovedCorporate}
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
                                      filter={filterFactory()}

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

UnapprovedLabs.propTypes = {
  match: PropTypes.object,
  UnapprovedCorporate: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedLabs: PropTypes.func,
  onapproveUnapproveCorporate: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  UnapprovedCorporate: registrationAdmin.UnapprovedCorporate,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onapproveUnapproveCorporate: data => dispatch(approveUnapproveCorporate(data)),
  onGetUnapprovedLabs: () => dispatch(getUnapprovedCorporate()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnapprovedLabs));
