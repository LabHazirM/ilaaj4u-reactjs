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
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter} from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
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
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          // style: {
          //   width: "300px",
          //   textAlign: "left",
          // },
          formatter: (cellContent, labsList) => (
            <span className="float-start">
              {/* {patientTestAppointment.payment_status == "Not Paid" ? ( */}
              <Link to={`/discountlab/${labsList.id}`}>
                {labsList.name}
              </Link>
            </span>
          ),filter: textFilter(),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
           style: {
            // width: "300px",
            textAlign: "left",
          },
          filter: textFilter(),
        },
        {
          dataField: "landline",
          text: "Phone No.",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "district",
          text: "District",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
  }

  // componentDidMount() {
  //   const { labsList, onGetLabsLists } = this.props;
  //   console.log(onGetLabsLists());
  //   this.setState({ labsList });
  // }
  componentDidMount() {
    const { labsList, onGetLabsLists } = this.props;
    onGetLabsLists(this.state.user_id);
    console.log(onGetLabsLists());
    this.setState({ labsList });
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

    const { labsList } = this.props;
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
            <title>Discount By Labhazir Against Specific Lab | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Marketer Admin" breadcrumbItem="Discount By Labhazir Against Specific Lab" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={labsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={labsList}
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsList: PropTypes.array,
  className: PropTypes.any,
  onGetLabsLists: PropTypes.func,
};
const mapStateToProps = ({ labsList}) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsLists: id => dispatch(getLabsList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
