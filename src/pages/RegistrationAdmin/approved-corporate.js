import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
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
import { getApprovedCorporate } from "store/registration-admin/actions";
import "assets/scss/table.scss";
import { Tooltip } from "@material-ui/core";
class ApprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedCorporate: [],
      id: "",
      btnText: "Copy",
      isHovered: false,
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
    this.handlePatientFeedbackClick =
      this.handlePatientFeedbackClick.bind(this);
  }

  componentDidMount() {
    const { onGetApprovedLabs } = this.props;
    onGetApprovedLabs(this.state.user_id);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // openPatientModal = (e, arg) => {
  //   this.setState({
  //     PatientModal: true,
  //     lab_address: arg.lab_address,
  //     lab_name: arg.lab_name,
  //     lab_city: arg.lab_city,
  //     registered_at: arg.registered_at,
  //     done_at: arg.done_at,
  //     isHovered: true,
  //   });
  // };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     isHovered: false,
  //   });
  // };
  // togglePatientModal = () => {
  //   this.setState(prevState => ({
  //     PatientModal: !prevState.PatientModal,
  //   }));
  //   this.state.btnText === "Copy"
  //     ? this.setState({ btnText: "Copied" })
  //     : this.setState({ btnText: "Copy" });
  // };

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
    const { approvedCorporate } = this.props;
    const data = this.state.data;
    const { onGetApprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: approvedCorporate.length, // replace later with size(approvedCorporate),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const iconStyle = { color: 'red' }; // Customize the color here

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Approved Corporates | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporates" breadcrumbItem="Approved" />
            <Row>
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be Approved and Active Corporates Shown on it.
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
                      data={approvedCorporate}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pendingCorporatesListColumns}
                          data={approvedCorporate}
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                      sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }} // Customize sort caret icons

                                    />
                                    {/* {this.state.isHovered && (
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
                                                        Name
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.lab_name
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Address
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
                                                        Approvel At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.done_at).toLocaleString('en-US')
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Register At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.registered_at).toLocaleString('en-US')
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>

                                                    
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          </Formik>
                                        </ModalBody>
                                      </Modal>
                                    )} */}
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

ApprovedLabs.propTypes = {
  match: PropTypes.object,
  approvedCorporate: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedLabs: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  approvedCorporate: registrationAdmin.approvedCorporate,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedLabs: () => dispatch(getApprovedCorporate()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedLabs));
