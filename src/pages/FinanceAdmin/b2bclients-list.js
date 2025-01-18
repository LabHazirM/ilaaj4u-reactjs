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
  getB2bClients,
 
} from "store/outpayments/actions";


class B2bClientsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bClients: [],
      id: "",
      B2bClientsLists: "",
      btnText: "Copy",
      b2bClients: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      labsListListColumns: [

        {
          dataField: "id",
          text: " B2bClient ID",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <strong>{b2bClients.id}</strong>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "business_name",
          text: "Business Name",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <span>                   {b2bClients.business_name}

                  {/* <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, b2bClients)}
                  >
                   {b2bClients.business_name}
                  </Link> */}
              </span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "landline",
          text: "Phone",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <span>{b2bClients.landline}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <span>{b2bClients.email}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <span>{b2bClients.city}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "website_url",
          text: "Website URL",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <>
              <span>{b2bClients.website_url}</span>
            </>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "current_amount",
          text: "Current Amount",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <p className="text-end">
            {b2bClients.current_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          ),filter: textFilter(), // Add a text filter for this column
        },
        {
          dataField: "account_no",
          text: "Account Statement",
          sort: true,
          formatter: (cellContent, b2bClients) => (
            <Link to={`/account-statement-b2b/${b2bClients.account_id}`}>
                                    Account statement
                                  </Link>
          ),filter: textFilter(), // Add a text filter for this column
          
        },
      ],
    };
  }

  // componentDidMount() {
  //   const { b2bClients, onGetB2bClients } = this.props;
  //   console.log(onGetB2bClients());
  //   this.setState({ b2bClients });
  // }
  componentDidMount() {
    const { b2bClients, onGetB2bClients } = this.props;
    onGetB2bClients(this.state.user_id);
    console.log(onGetB2bClients());
    this.setState({ b2bClients });
  }
  // componentDidMount() {
  //   const { b2bAllClients, onGetB2bAllClientsList } = this.props;
  //   onGetB2bAllClientsList(this.state.user_id);
  //   this.setState({ b2bAllClients });
  // }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.website_url,
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

    const { b2bClients } = this.props;
    const data = this.state.data;
    const { onGetB2bClients } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2bClients.length, // replace later with size(b2bClients),
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
            <Breadcrumbs title="List" breadcrumbItem="B2b Clients List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={b2bClients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={b2bClients}
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
                                                      website url
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

B2bClientsLists.propTypes = {
  match: PropTypes.object,
  b2bClients: PropTypes.array,
  className: PropTypes.any,
  onGetB2bClients: PropTypes.func,
};
const mapStateToProps = ({ outPayments}) => ({
  b2bClients: outPayments.b2bClients,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bClients: id => dispatch(getB2bClients(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(B2bClientsLists));
