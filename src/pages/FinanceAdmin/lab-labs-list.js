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
import filterFactory, { textFilter} from 'react-bootstrap-table2-filter';

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
  getAllLabsList,
  // approveUnapproveB2BClient,
} from "store/finance-admin/actions";

import ApproveUnapproveModal from "components/Common/ApproveUnapproveModal";
import "assets/scss/table.scss";

class PendingB2BClients extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      allLabsList: [],
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
          text: "Lab ID",
          dataField: "id",
          sort: true,
          // hidden: true,
          formatter: (cellContent, pendingB2BClient) => (
            <>{pendingB2BClient.id}</>
          ),filter: textFilter(),
        },
        {
          dataField: "type",
          text: "Lab Type",
          sort: true,

          formatter: (cellContent, pendingB2BClient) => (
            <>
              <span style={{
                width: '170px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
                {pendingB2BClient.type}
              </span>
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "name",
        //   text: "Lab Name",
        //   sort: true,
        // },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,

          formatter: (cellContent, pendingB2BClient) => (
            <>
                          <span style={{
                width: '300px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
              <Link to={`/All-Donation-Appointments/${pendingB2BClient.id}`}>
                {pendingB2BClient.name}
              </Link>
              </span>
            </>
          ),filter: textFilter(),
        },
           {
          dataField: "city",
          text: "Lab City",
          sort: true,
          filter: textFilter(),
        },
                   {
          dataField: "office",
          text: "Lab Office",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "donation_amount",
          text: "Total Donation Appointment Payable",
          sort: true,
          formatter: (cellContent, pendingB2BClient) => (
            <>
              <div style={{
                width: '300px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'right', // Align text to the left
                display: 'block',
              }}>
                  <strong>{pendingB2BClient.donation_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
            </>
            ),filter: textFilter(),
        },
      //   {
      //     dataField: "email",
      //     text: "Email",
      //     sort: true,
      //   },
      //   {
      //     dataField: "landline",
      //     text: "Landline",
      //     sort: true,
      //   },
      //   {
      //     dataField: "registered_at",
      //     text: "Registered at",
      //     sort: true,
      //     formatter: (cellContent, pendingB2BClient) => (
      //       <>
      //         <span>
      //           {new Date(pendingB2BClient.registered_at).toLocaleString(
      //             "en-US"
      //           )}
      //         </span>
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "website_url",
      //     text: "Website URL",
      //     sort: true,
      //     formatter: (cellContent, pendingB2BClient) => (
      //       <>
      //         <Link
      //           to={{
      //             pathname: pendingB2BClient.website_url,
      //           }}
      //           target="_blank"
      //         >
      //           {pendingB2BClient.website_url}
      //         </Link>
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "data",
      //     text: "id",
      //     isDummyField: true,
      //     editable: false,
      //     text: "Action",
      //     formatter: (cellContent, pendingB2BClient) => (
      //       <>
      //         <Link
      //           className="btn btn-success btn-rounded"
      //           to="#"
      //           onClick={e => this.handleApprovedEvent(pendingB2BClient.id)}
      //         >
      //           <i className="mdi mdi-check-circle font-size-14"></i>
      //         </Link>{" "}
      //         <Link
      //           className="btn btn-danger btn-rounded"
      //           to="#"
      //           onClick={() => this.handleUnapprovedEvent(pendingB2BClient.id)}
      //         >
      //           <i className="mdi mdi-close-circle font-size-14"></i>
      //         </Link>
      //       </>
      //     ),
      //   },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  // componentDidMount() {
  //   const { allLabsList, onGetAllLabsList } = this.props;
  //   onGetAllLabsList();
  //   this.setState({ allLabsList });
  // }
  componentDidMount() {
    const { allLabsList, onGetAllLabsList } = this.props;
    onGetAllLabsList(this.state.user_id);
    this.setState({ allLabsList });
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

  // callOnApproveUnapproveB2BClient = () => {
  //   const { onApproveUnapproveB2BClient, onGetAllLabsList } = this.props;

  //   const data = {
  //     id: this.state.user_id,
  //     b2bId: this.state.id,
  //     isApproved: this.state.isApproved,
  //   };

  //   // calling to unapprove lab
  //   onApproveUnapproveB2BClient(data);

  //   // Calling to update list record
  //   setTimeout(() => {
  //     onGetAllLabsList();
  //   }, 2000);

  //   this.setState({ unapprovedModal: false });
  // };

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

    const { allLabsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: allLabsList.length, // replace later with size(allLabsList),
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
            <title>Labs List | Lab Hazir</title>
          </MetaTags>

          <ApproveUnapproveModal
            show={this.state.unapprovedModal}
            // onYesClick={this.callOnApproveUnapproveB2BClient}
            onCloseClick={() => this.setState({ unapprovedModal: false })}
          />

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Labs List" />
            <Row>
            <p><span className="text-danger">Note:</span> Only those Labs will be shown here whose total Payable Amount of All Donation Allocate and Result Uploaded Appointments.</p>
            <p><span className="text-danger">Note:</span> Click on Lab Name to See List of Appointments.</p>

              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pendingB2BClientListColumns}
                      data={allLabsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingB2BClientListColumns}
                          data={allLabsList}
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
                                </Col>
                                <Col sm="4"></Col>
                                <Col sm="4">
  {allLabsList.map((lab, index) => {
    if (lab.donor_balance !== undefined && lab.donor_balance !== null) {
      return (
        <div key={index} className="float-end">
          <strong>Donation Available Balance: <span className="text-danger">{lab.donor_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></strong>
        </div>
      );
    }
    return null; // Don't render anything for labs without donor_balance
  })}
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
                                      filter={ filterFactory()}
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
  allLabsList: PropTypes.array,
  className: PropTypes.any,
  onGetAllLabsList: PropTypes.func,
  // onApproveUnapproveB2BClient: PropTypes.func,
};
const mapStateToProps = ({ financeAdmin }) => ({
  allLabsList: financeAdmin.allLabsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // onApproveUnapproveB2BClient: data =>
  //   dispatch(approveUnapproveB2BClient(data)),
  onGetAllLabsList: () => dispatch(getAllLabsList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PendingB2BClients));
