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
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getB2bSharesLabList } from "store/b2b-lab-shares/actions";
import "assets/scss/table.scss";

class B2bLabSharesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bLabShares: [],
      id: "",
      b2bLabShare: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bLabShareListColumns: [
        {
          dataField: "lab_id",
          text: "Lab ID",
          sort: true,
          formatter: (cellContent, b2bLabShare) => (
            <>
              <strong>{b2bLabShare.lab_id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          style: { width: "400px"},
          formatter: (cellContent, b2bLabShare) => (
            <span className="text-start">
              <p>{b2bLabShare.name}</p>
            </span>
          ),
        },
        {
          dataField: "city",
          text: "Lab City",
          sort: true,
        },
        // {
        //   dataField: "b2b_shares",
        //   text: "B2B Shares",
        //   sort: true,
        //   formatter: (cellContent, b2bLabShare) => (
        //     <>
        //       {(
        //         <span>{(b2bLabShare.b2b_shares*100).toFixed()}%</span>
        //         )}
        //     </>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { b2bLabShares, onGetB2bSharesLabList } = this.props;
    onGetB2bSharesLabList(this.state.user_id);
    this.setState({ b2bLabShares });
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

    const { b2bLabShares } = this.props;
    const { onGetB2bSharesLabList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2bLabShares.length, // replace later with size(b2bLabShares),
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
            <title>B2B Client Shares | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Client Shares" breadcrumbItem=" List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bLabShareListColumns}
                      data={b2bLabShares}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bLabShareListColumns}
                          data={b2bLabShares}
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

                                      {/* <p>{"https://labhazir.com/nearby-labs/?uuid=" + "b2bLabShares.uuid"}</p> */}
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

B2bLabSharesList.propTypes = {
  match: PropTypes.object,
  b2bLabShares: PropTypes.array,
  className: PropTypes.any,
  onGetB2bSharesLabList: PropTypes.func,
};
const mapStateToProps = ({ b2bLabShares }) => ({
  b2bLabShares: b2bLabShares.b2bLabSharesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bSharesLabList: id => dispatch(getB2bSharesLabList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(B2bLabSharesList));