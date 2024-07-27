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
          hidden: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
        },
        {
          dataField: "added_by",
          text: "Added On",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.added_by ? (
                  moment(offeredTest.added_by).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
        },
        {
          text: "Test ID",
          dataField: "test_id",
          sort: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.test_id}</>,
        },
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
          formatter: (cellContent, offeredTest) => (
            <span>
              {/* {offeredTest.test_name} */}
              {offeredTest.type != "Test" && (
                              <div>
                                <Link
                                to="#"
                                onClick={e => this.openPatientModal(e, offeredTest)}
                                // onMouseEnter={e =>  this.openPatientModal(e, offeredTest)}
                                // onPointerLeave={this.handleMouseExit()}
                              >
                                <span>
                                {offeredTest.type}
                                </span>
                              </Link>
                              </div>
                            )}
               {offeredTest.type == "Test" && (
                              <div>
                                <span>
                                {offeredTest.type}
                                </span>
                              </div>
                            )}
            </span>

          ),
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
          dataField: "date_difference",
          text: "Duration Days",
          sort: false, // Sorting might not be straightforward with calculated fields
          formatter: (cellContent, offeredTest) => {
            const startDate = moment(offeredTest.start_date);
            const endDate = moment(offeredTest.end_date);
            const duration = endDate.diff(startDate);
      
            // If either date is missing, show "--"
            if (!startDate.isValid() || !endDate.isValid()) {
              return "--";
            }
      
            // Calculate the difference in days, hours, and minutes
            const days = moment.duration(duration).days();
            const hours = moment.duration(duration).hours();
            const minutes = moment.duration(duration).minutes();
      
            // Format the duration
            let formattedDuration = "";
            if (days > 0) formattedDuration += `${days}`;
            // if (hours > 0) formattedDuration += `${hours}h `;
            // formattedDuration += `${minutes}m`;
      
            return <span>{formattedDuration}</span>;
          },
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
        {
          dataField: "sum_appointments",
          text: "Total Appointments",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              {(
                <span className="float-end">{offeredTest.sum_appointments.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
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

  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  

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
    const uniqueCorporateNames = Array.from(new Set(
      offeredTests.map(corporate => corporate.corporate_name).filter(name => name)
    ));
  
    // Extract unique employee codes
    const uniqueEmployeeCodes = Array.from(new Set(
      offeredTests.map(corporate => corporate.employee_code).filter(code => code)
    ));

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Corporate Offered Tests List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate Offered Tests" breadcrumbItem="Tests List" />
            <Row className="mb-2">
  <Col lg="6" md="6" sm="12">
    <div className="text-sm-left text-md-center text-lg-center">
      {uniqueCorporateNames.length > 0 ? (
        <div>
          {uniqueCorporateNames.map((name, index) => (
            <div key={index}>
              <span style={{ fontWeight: 'bold' }}>Corporations Name: </span>
              <span className="text-danger">{name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>No Corporate Names Available</div>
      )}
    </div>
  </Col>
  <Col lg="6" md="6" sm="12">
    <div className="text-left">
      {uniqueEmployeeCodes.length > 0 ? (
        <div>
          {uniqueEmployeeCodes.map((code, index) => (
            <div key={index}>
              <span style={{ fontWeight: 'bold' }}>Number of Total Employees: </span>
              <span style={{ color: 'red' }}>{code}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>No Employee Codes Available</div>
      )}
    </div>
  </Col>
</Row>
            <Row>
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
                              <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
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
                                                      Included Tests
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                  <textarea
                                  name="test_details"
                                  id="test_details"
                                  rows="10"
                                  cols="10"
                                  value={this.state.test_details}
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
