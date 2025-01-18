import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getQualityCertificates } from "store/quality-certificates/actions";
import "assets/scss/table.scss";

class LabQualityCertificates extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedFiles: [],
      qualityCertificates: [],
      qualityCertificate: "",
      certificateImg: "",
      modal: false,
      deleteModal: false,
      qualityCertificateListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, qualityCertificate) => (
            <>{qualityCertificate.id}</>
          ),
        },
        {
          dataField: "img",
          text: "#",
          formatter: (cellContent, qualityCertificate) => (
            <>
              {!qualityCertificate.certificate ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {qualityCertificate.name.charAt(0)}
                  </span>
                </div>
              ) : (
                <div>
                  <img
                    className="rounded-circle avatar-xs"
                    src={
                      process.env.REACT_APP_BACKENDURL +
                      qualityCertificate.certificate
                    }
                    alt=""
                  />
                </div>
              )}
            </>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { qualityCertificates, onGetQualityCertificates } = this.props;
    onGetQualityCertificates();
    this.setState({ qualityCertificates });
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

  /* Insert,Update Delete data */

  render() {
    const { SearchBar } = Search;

    const { qualityCertificates } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: qualityCertificates.length, // replace later with size(qualityCertificates),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const selectRow = {
      mode: "checkbox",
    };

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Quality Certificates List | Ilaaj4u</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Quality Certificates"
              breadcrumbItem="Certificates List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.qualityCertificateListColumns}
                      data={qualityCertificates}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.qualityCertificateListColumns}
                          data={qualityCertificates}
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
                              <Row>
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      selectRow={selectRow}
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

LabQualityCertificates.propTypes = {
  match: PropTypes.object,
  qualityCertificates: PropTypes.array,
  className: PropTypes.any,
  onGetQualityCertificates: PropTypes.func,
};

const mapStateToProps = ({ qualityCertificates }) => ({
  qualityCertificates: qualityCertificates.qualityCertificates,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetQualityCertificates: () =>
    dispatch(getQualityCertificates(ownProps.match.params.id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabQualityCertificates));
