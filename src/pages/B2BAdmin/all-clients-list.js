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

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getB2bAllClientsList } from "store/b2b-all-clients/actions";
import "assets/scss/table.scss";

class B2bAllClientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bAllClients: [],
      // id: "",
      b2bAllClient: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bAllClientListColumns: [
        {
          dataField: "id",
          text: "B2B ID",
          sort: true,
          formatter: (cellContent, b2bAllClient) => (
            <>
              <strong>{b2bAllClient.id}</strong>
            </>
          ),
        },
        {
          dataField: "business_name",
          text: "Business Name",
          sort: true,
          formatter: (cellContent, b2bAllClient) => (
            <>
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
              <Link to={`/b2b-clients-shares/${b2bAllClient.id}`}>
                {b2bAllClient.business_name}
              </Link>
            </>
          ),
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
          dataField: "website_url",
          text: "Website",
          sort: true,
          formatter: (cellContent, b2bAllClient) => (
            <>
              <Link
                to={{
                  pathname: b2bAllClient.website_url,
                }}
                target="_blank"
              >
                {b2bAllClient.website_url}
              </Link>
            </>
          ),
        },
      
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { b2bAllClients, onGetB2bAllClientsList } = this.props;
    onGetB2bAllClientsList(this.state.user_id);
    this.setState({ b2bAllClients });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

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

    const { b2bAllClients } = this.props;
    const { onGetB2bAllClientsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2bAllClients.length, // replace later with size(b2bAllClients),
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
            <title>B2B Clients List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Client" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bAllClientListColumns}
                      data={b2bAllClients}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bAllClientListColumns}
                          data={b2bAllClients}
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
                                    />
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    ></Modal>
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

B2bAllClientsList.propTypes = {
  match: PropTypes.object,
  b2bAllClients: PropTypes.array,
  className: PropTypes.any,
  onGetB2bAllClientsList: PropTypes.func,
};
const mapStateToProps = ({ b2bAllClients }) => ({
  b2bAllClients: b2bAllClients.b2bAllClientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bAllClientsList: id => dispatch(getB2bAllClientsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(B2bAllClientsList));
