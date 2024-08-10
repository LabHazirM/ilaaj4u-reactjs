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
  getLabsList,
} from "store/labs-list/actions";


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
          text: "Lab Name/Type",
          sort: true,
          style: { textAlign: 'left' },
          formatter: (cellContent, labsList) => (
            <>
              <span className="float-start">
              <Link to={`/account-statements-lab/${labsList.account_id}`}>
              {labsList.name}{" - "}
                {labsList.type}
                             </Link>
               </span>


            </>
          ), filter: textFilter(), // Add a text filter for this column
          // formatter: (cellContent, labsList) => (
          //   <>
          //     <span>
          //         <Link
          //           to="#"
          //           onClick={e => this.openPatientModal(e, labsList)}
          //         >
          //          {labsList.name}
          //         </Link>
          //     </span>
          //   </>
          // ),
        },
        {
          dataField: "landline",
          text: "Phone",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span className="float-start">{labsList.landline}</span>
            </>
          ), filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          formatter: (cellContent, labsList) => (
            <>
              <span className="float-start">{labsList.email}</span>
            </>
          ), filter: textFilter(), // Add a text filter for this column
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
        // {
        //   dataField: "current_amount",
        //   text: "Current Amount",
        //   sort: true,
        //   formatter: (cellContent, labsList) => (
        //     <p className="text-end">
        //       {labsList.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        //     </p>
        //   ), filter: textFilter(), // Add a text filter for this column
        // },
        // {
        //   dataField: "account_no",
        //   text: "Account Statement",
        //   sort: true,
        //   formatter: (cellContent, labsList) => (
        //     <Link to={`/account-statements-lab/${labsList.account_id}`}>
        //       Account statement
        //     </Link>
        //   ), filter: textFilter(), // Add a text filter for this column

        // },
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

    const columns = [
      ...this.state.labsListListColumns,
      {
        dataField: "current_amount",
        text: "Current Amount",
        sort: true,
        formatter: (cellContent, lab) => (
          <p className="text-end">
            {lab.current_amount !== undefined && lab.current_amount !== null
              ? lab.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : ""}
          </p>
        ),
        filter: textFilter(),
      },
      // {
      //     dataField: "account_no",
      //     text: "Account Statement",
      //     sort: true,
      //     formatter: (cellContent, labsList) => (
      //       <Link to={`/account-statements-lab/${labsList.account_id}`}>
      //         Account statement
      //       </Link>
      //     ), filter: textFilter(), // Add a text filter for this column

      //   },
    ];


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
            <Breadcrumbs title="List" breadcrumbItem="Labs List with Current Amounts" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={columns}
                      data={filteredStatements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={columns}
                          data={filteredStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              <Col sm="3" lg="3">
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
                                      filter={filterFactory()} // Enable filtering for the entire table
                                    />
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
};
const mapStateToProps = ({ labsList }) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsLists: id => dispatch(getLabsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
