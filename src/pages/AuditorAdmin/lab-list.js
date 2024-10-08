import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
  Row,
  Label,
  Modal,
  ModalBody,
  Button,
  Alert
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
    getLabsAuditList,
} from "store/labs-list/actions";
import { AddAllLabsAudit } from "store/auditor-admin/actions";  

class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsList: [],
      id: "",
      LabsLists: "",
      searchType: null,
      btnText: "Copy",
      labsList: "",
      auditModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labsListListColumns: [

        {
          dataField: "id",
          text: "Lab ID",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <strong>{labsList.id}</strong>
            </>
          ), filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          style: { textAlign: 'left' },
          formatter: (cellContent, labsList) => (
            <>
              <span className="float-start">
              <Link to={`/lab-audits/${labsList.account_id}`}>
              {labsList.name}
                             </Link>
               </span>


            </>
          ), filter: textFilter(), 
        },
   
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span>{labsList.city}</span>
            </>
          ), filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
          style: { textAlign: 'left' },
          formatter: (cellContent, labsList) => (
            <>
              <span>{labsList.address}</span>
            </>
          ), filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "total_audits",
          text: "Total Audits",
          sort: true,
          formatter: (cellContent, labsList) => (
       
     <span>{labsList.total_audits}</span>
       
          ), filter: textFilter(), // Add a text filter for this column

        },
        {
          dataField: "last_audit_status",
          text: "Last Audit Status",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              {labsList.last_audit_status === "Pass" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {labsList.last_audit_status}
                </span>
              ) : labsList.last_audit_status === "Fail" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {labsList.last_audit_status}
                </span>
              ): labsList.last_audit_status === "Revisit" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {labsList.last_audit_status}
                </span>
              )  : (
                <span>--</span>
              )}
            </>
          ),
          filter: textFilter(),
        }
      ],
    };
  }
  fetchData = () => {
    const { onGetLabsLists } = this.props;
    onGetLabsLists(); // Assuming onGetLabsLists fetches data without userId
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if searchType has changed
    if (prevState.searchType !== this.state.searchType) {
      this.fetchData();
    }
  }
  handleEditAllBtnClick = () => {
    const { onAssignAudit, onGetLabsLists } = this.props;
    const data = {
      userId: this.state.user_id,
    };
    this.setState({ showAlert: true });
    onAssignAudit(data)
    setTimeout(() => {
      onGetLabsLists();
    }, 1000);
    setTimeout(() => {
      this.setState({ auditModal: false , showAlert: false});
    }, 2000);
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.address,
      lab_city: arg.city,
      lab_phone: arg.landline,
      lab_email: arg.email,
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
  handleButtonClick = () => {
    this.setState({ auditModal: true });
  }

  render() {
    const { SearchBar } = Search;
    const { searchType } = this.state;
    const { labsList } = this.props;
    // Filter data based on selected type
    const filteredStatements = labsList.filter((lab) => {
      if (searchType === 'payable' && lab.current_amount > 0) {
        return true;
      } else if (searchType === 'receivable' && lab.current_amount < 0) {
        return true;
      } else if (!searchType) {
        // For other cases or when no filter is selected, include all labs
        return true;
      }
      return false; // Exclude labs that don't match the conditions
    });



    const data = this.state.data;
    const { onGetLabsLists } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labsList.length, // replace later with size(labsList),
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

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Labs List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={filteredStatements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={filteredStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                       <Row className="mb-2">
                                  <Col sm="4">
                                    {/* <div className="search-box ms-2 mb-2 d-inline-block">
                                      <div className="position-relative">
                                        <SearchBar
                                          {...toolkitprops.searchProps}
                                        />
                                        <i className="bx bx-search-alt search-icon" />
                                      </div>
                                    </div> */}
                                  </Col>
                                  <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-18 btn-block btn btn-success"
                                      onClick={this.handleButtonClick}
                                      // disabled={isButtonDisabled}
                                    >
                                      Generate Audit
                                    </Button>
                                  </div>
                                </Col>
                          
                              {/* <Col sm="3" lg="3">
                                  <div className="ms-2 mb-4">
                                    <div className="position-relative">
                                        <div>
                                          <Label for="main_lab_appointments" className="form-label">
                                            <strong>Search Type</strong>
                                          </Label>
                                          <select
                                      className="form-select"
                                      onChange={(e) => this.setState({ searchType: e.target.value })}
                                    >
                                      <option value="">All Labs</option>
                                      <option value="payable">Payable Labs</option>
                                      <option value="receivable">Receivable Labs</option>
                                    </select>
                                    <p className="text-danger font-size-10">Filter and view the Payable Labs or Receivable Labs</p>

                                        </div>
                                    </div>
                                  </div>
                                </Col> */}
                                
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
                                      filter={filterFactory()} // Enable filtering for the entire table
                                    />
                                        {/* Modal Component */}
    <Modal
          isOpen={this.state.auditModal}
          className={this.props.className}
          // onPointerLeave={this.handleMouseExit}
        >
          {this.state.showAlert && (
            <Alert color="success" style={{ marginTop: "13px",marginLeft: "13px", marginRight: "13px" }}>
              Audit Generated Successfully.
            </Alert>
          )}
     <div className="modal-header">
            <h5 className="modal-title"> Generate All Labs Audit</h5>
            <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                              this.setState({
                                                auditModal: false,
                                              })
                                            }
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                          ></button>
          </div>
          <ModalBody>
            <Row>
            <Col>
  <p>
    By clicking the <strong>&quot;Generate Audit&quot;</strong> button below, you will initiate the process to generate audits for all labs where audits have not yet been generated.
  </p>
</Col>
            </Row>
            <Row>
              <Col className="text-end">
                <Button
                  color="primary"
                  className="font-18 btn-block btn btn-success"
                  onClick={this.handleEditAllBtnClick}
                >
                  Generate Audit
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
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
                                                </div>
                                                <div className="mb-3 row">
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
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      email
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_email
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Contact No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state
                                                            .lab_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsList: PropTypes.array,
  className: PropTypes.any,
  onGetLabsLists: PropTypes.func,
  onAssignAudit: PropTypes.func,
};
const mapStateToProps = ({ labsList }) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAssignAudit: data => dispatch(AddAllLabsAudit(data)),
  onGetLabsLists: id => dispatch(getLabsAuditList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
