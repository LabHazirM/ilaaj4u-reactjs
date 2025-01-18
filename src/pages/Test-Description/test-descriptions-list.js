import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getTestDescriptions } from "store/test-descriptions/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class testDescriptionsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testDescriptions: [],
      testDescription: "",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testDescriptionListColumns: [
        {
          text: "id",
          dataField: "test_id",
          sort: true,
          hidden: true,
          formatter: (cellContent, testDescription) => (
            <>{testDescription.id}</>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        // {
        //   dataField: "method",
        //   text: "Method",
        //   sort: true,
        // },
        {
          dataField: "description_in_english",
          text: "Description_in_English",
          sort: true,
        },
        {
          dataField: "description_in_urdu",
          text: "Description_in_Urdu",
          sort: true,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { testDescriptions, onGetTestDescriptions } = this.props;
    onGetTestDescriptions(this.props.match.params.id);
    this.setState({ testDescriptions });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { testDescriptions } = this.props;
    if (
      !isEmpty(testDescriptions) &&
      size(prevProps.testDescriptions) !== size(testDescriptions)
    ) {
      this.setState({ testDescriptions: {}, isEdit: false });
    }
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

    const { testDescriptions } = this.props;

    const { onGetTestDescriptions } = this.props;
    const testDescription = this.state.testDescription;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: testDescriptions.length, // replace later with size(testDescriptions),
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
            <title>Test Description | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Test Descriptions" breadcrumbItem="List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testDescriptionListColumns}
                      data={testDescriptions}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testDescriptionListColumns}
                          data={testDescriptions}
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

testDescriptionsList.propTypes = {
  match: PropTypes.object,
  testDescriptions: PropTypes.array,
  className: PropTypes.any,
  onGetTestDescriptions: PropTypes.func,
};

const mapStateToProps = ({ testDescriptions }) => ({
  testDescriptions: testDescriptions.testDescriptions,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetTestDescriptions: id => dispatch(getTestDescriptions(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(testDescriptionsList));
