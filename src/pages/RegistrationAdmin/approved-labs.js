import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
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
  Button,

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
import { getApprovedLabs } from "store/registration-admin/actions";
import "assets/scss/table.scss";

class ApprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedLabs: [],
      id: "",
      btnText: "Copy",
      isHovered: false,
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedLab: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedLabListColumns: [
        {
          text: "S#", // Column header for row numbers
          formatter: (cellContent, approvedLab, rowIndex) => (
            <>
              <span>{rowIndex + 1}</span>
            </>
          ),
        },
        {
          text: "id",
          dataField: "id",
          // sort: true,
          hidden: true,
          formatter: (cellContent, approvedLab) => <>{approvedLab.id}</>,
        },
        {
          dataField: "city",
          text: "Lab City",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                {approvedLab.city}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "district",
          text: "District",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span>
                {approvedLab.district}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Lab Name",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                <Link
                  to="#"
                  onMouseEnter={e => this.openPatientModal(e, approvedLab)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {approvedLab.name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "type",
          text: "Lab Type",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.type == "Main Lab" ? (
                  <span>Main</span>
                ) : (
                  <span>Collection</span>
                )}
              </span>
            </>
          ),
          filter: selectFilter({
            options: {
              // '': 'All',
              'Main Lab': 'Main',
              'Collection Point': 'Collection',
            },
            // defaultValue: 'Main Lab',
          }),
        },
        {
          dataField: "email",
          text: "Email",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-start">
                {approvedLab.email}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_phone",
          text: "Phone",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.lab_phone}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "offered_tests",
          text: "Offered Tests",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.offered_tests}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "pathologists",
          text: "Pathologist",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.pathologists}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "sample_collectors",
          text: "Sample Collector",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.sample_collectors}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "quality_certificates",
          text: "Quality Certificate",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.quality_certificates}
              </span>
            </>
          ), filter: textFilter(),
        },

        // {
        //   dataField: "registered_at",
        //   text: "Registeration",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span>
        //         {new Date(approvedLab.registered_at).toLocaleDateString("en-US", {
        //           year: "numeric",
        //           month: "2-digit",
        //           day: "2-digit",
        //         }).replace(/\//g, '-')}
        //       </span>
        //     </>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "done_at",
        //   text: "Approvel",
        //   // sort: true,
        //   formatter: (cellContent, approvedLab) => (
        //     <>
        //       <span>
        //         {new Date(approvedLab.done_at).toLocaleDateString("en-US", {
        //           year: "numeric",
        //           month: "2-digit",
        //           day: "2-digit",
        //         }).replace(/\//g, '-')}
        //       </span>
        //     </>
        //   ),
        //   filter: textFilter(),
        // },

        // {
        //   dataField: "is_blocked",
        //   text: "Blocked",
        //   sort: true,
        //   formatter: (cellContent, donor) => (
        //     <>
        //       {donor.is_blocked == true ? (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
        //           Yes
        //         </span>
        //       ) : (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
        //           No
        //         </span>
        //       )}
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

  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.lab_address,
      lab_name: arg.lab_name,
      lab_city: arg.lab_city,
      registered_at: arg.registered_at,
      done_at: arg.done_at,
      isHovered: true,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
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

  exportToExcel = () => {
    const { approvedLabs } = this.props;
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = [
      "lab_name",
      "lab_address",
      "lab_city",
      "email",
      "lab_phone",
      "type",
    ];

    // Map each row to an object with only the desired fields
    const dataToExport = approvedLabs.map(statement => {
      const rowData = {};
      fieldsToExport.forEach(field => {
        rowData[field] = statement[field];
      });
      return rowData;
    });

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "approved_labs" + fileExtension;
    saveAs(data, fileName);
  };

  render() {
    const { SearchBar } = Search;
    const { approvedLabs } = this.props;
    const data = this.state.data;
    const { onGetApprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 50,
      totalSize: approvedLabs.length, // replace later with size(approvedLabs),
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
            <title>Approved Labs | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Approved" />
            <Row>
              <Col lg="12" style={{ marginLeft: "87%" }}>
                <Button onClick={this.exportToExcel} className="mb-3">Export to Excel</Button>
              </Col>
            </Row>
            <Row>
            <div> <span className="text-danger font-size-12">
                  <strong>
                    Note:</strong> When lab is approved audit for the lab is auto generated. 
When lab is approved b2b shares for all the existing b2b clients is automatically added (Share is predefined by Labhazir).
                  
                  </span>
                </div>
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note:</strong> There will be Approved and Active Labs Shown on it.
                  </span>
                </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedLabListColumns}
                      data={approvedLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedLabListColumns}
                          data={approvedLabs}
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
                                      sort={{ sortCaret: (order, column) => order === 'desc' ? <i className="fa fa-arrow-up" 
                                      style={iconStyle}></i> : <i className="fa fa-arrow-down" style={iconStyle}></i> }} // Customize sort caret icons

                                    />
                                    {this.state.isHovered && (
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
                                                      Lab Address
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
                                                </div> */}
                                                  {/* <div className="mb-3 row">
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
                                                </div> */}
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
                                    )}
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
  approvedLabs: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedLabs: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  approvedLabs: registrationAdmin.approvedLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedLabs: () => dispatch(getApprovedLabs()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ApprovedLabs));
