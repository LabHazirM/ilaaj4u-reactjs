import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
import { Collapse } from "reactstrap";
import { useParams } from 'react-router-dom'
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import moment from 'moment';

// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  // getUnits,
  getCorporateTests,
  updateCorporateTest,
} from "store/offered-tests/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      offeredTests: [],
      tests: [],
      offeredTest: "",
      type: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      newEntries: [], // Store new entries here
      offeredTestListColumns: [
        {
          text: "Offered Test ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
        },
        // {
        //   text: "Test ID",
        //   dataField: "corporate_id",
        //   sort: true,
        //   formatter: (cellContent, offeredTest) => <>{offeredTest.corporate_id}</>,
        // },
        {
          dataField: "test_name",
          text: "Test Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <span style={{ color: this.state.newEntries.includes(offeredTest.id) && existingEntriesCount > 0 ? 'red' : 'inherit',
              width: '140px', // Set your desired width here
              fontSize: '14px',
              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
              {offeredTest.test_name}
            </span>
          ),
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
        },
        {
          dataField: "start_date",
          text: "Start Date",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.start_date ? (
                  moment(offeredTest.start_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "end_date",
          text: "End Date",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.end_date ? (
                  moment(offeredTest.end_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "test_status",
          text: "Activity Status",
          sort: true,
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              {(
                <span className="float-end">{offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    const { onGetCorporateTests, offeredTests } = this.props;
    const { id } = this.props.match.params;
    const userId = id ? id : this.state.user_id;
    onGetCorporateTests(userId);
    this.setState({ user_id: userId });
  
    // Fetch the current timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000);
  
    // Filter new entries based on timestamp comparison
    const newEntries = offeredTests.filter(test => {
      const timestampDifference = currentTimestamp - test.timestamp;
      return timestampDifference < 24 * 60 * 60; // Entries within 24 hours
    });
    console.log("new entries", newEntries)
    // Store the IDs of new entries
    const newEntryIds = newEntries.map(entry => entry.id);
  
    // Update state with new entries and existing entries count
    this.setState({
      newEntries: newEntryIds,
      existingEntriesCount: offeredTests.length
    }, () => {
      console.log("exist entries", this.state.existingEntriesCount);
    });
  }    
  

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ offeredTest: selectedGroup.value });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     isHovered: false,
    
  //   });
  // };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { offeredTests } = this.props;
    if (
      !isEmpty(offeredTests) &&
      size(prevProps.offeredTests) !== size(offeredTests)
    ) {
      this.setState({ offeredTests: {}, isEdit: false });
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

  /* Insert,Update Delete data */



  render() {
    const { SearchBar } = Search;

    const { existingEntriesCount } = this.state;

    const { offeredTests } = this.props;
    console.log("All offered tests:", offeredTests); // Log all offered tests

    const defaultSorted = [
      {
        dataField: "test_status",
        order: "asc", // Sort in ascending order to bring "Active" tests to the top
      },
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    const filteredTests = offeredTests.filter(test => test.test_status === "Active");

    console.log("filter list", filteredTests)

    // const { units } = this.props;
    const offeredTest = this.state.offeredTest;

    const pageOptions = {
      sizePerPage: 10000,
      totalSize: offeredTests ? offeredTests.length : 0, // replace later with size(offeredTests),
      custom: true,
    };

    // const defaultSorted = [
    //   {
    //     dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
    //     order: "desc", // desc or asc
    //   },
    // ];

    return (
      <React.Fragment>
         
        <div className="page-content">
          <MetaTags>
            <title>Corporate Offered Tests List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate Offered Tests" breadcrumbItem="Tests List" />
            <Row>
            {/* <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: If referral fee of any offered test is not entered by Labhazir, all such tests will not be online.
                                    </strong>
                                  </span>
                                  </div> */}
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.offeredTestListColumns}
                      data={offeredTests}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.offeredTestListColumns}
                          data={offeredTests}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="8" lg="8">
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
                                      classes={"table align-middle table-condensed table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      data={filteredTests} // Passing filtered data to BootstrapTable

                                    />
                                  </div>
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

OfferedTestsList.propTypes = {
  match: PropTypes.object,
  // units: PropTypes.array,
  offeredTests: PropTypes.array,
  className: PropTypes.any,
  onGetCorporateTests: PropTypes.func,
};

const mapStateToProps = ({ offeredTests }) => ({
  offeredTests: offeredTests.offeredTests,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // onGetUnits: () => dispatch(getUnits()),
  onGetCorporateTests: id => dispatch(getCorporateTests(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
