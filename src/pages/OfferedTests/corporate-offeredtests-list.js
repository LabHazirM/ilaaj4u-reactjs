import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
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
  deleteOfferedTest,
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
      labProfiles: [],
      // units: [],
      offeredTest: "",
      type: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      offeredTestListColumns: [
        {
          text: "id",
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
          style: { textAlign: 'left' },
          formatter: (cellContent, offeredTest) => (
            <>
              <span style={{
                width: '140px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                {offeredTest.test_name}
              </span>
            </>
          ),
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
        },
        // {
        //   dataField: "start_date",
        //   text: "Start Date",
        //   sort: true,
        // },
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
    text: "Duration/ Days",
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
          text: "Status",
          sort: true,
        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
          
          style: { textAlign: 'right' },
          formatter: (cellContent, offeredTest) => (
            <>
              {(
                <span className="float-end">{offeredTest.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),

        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, offeredTest) => (
            <div className="d-flex gap-3" style={{ textAlign: "center", justifyContent: "center" }}>
              {offeredTest.test_status == "Expired" ? (
                <Tooltip title="Update">
                  <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={() => this.handleOfferedTestClick(offeredTest)}
                    ></i>
                  </Link>
                </Tooltip>
              ) : null}
            </div>
          ),
        },
      ],
    };
    this.handleOfferedTestClick = this.handleOfferedTestClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {

    const { offeredTests, onGetCorporateTests, } = this.props;
    onGetCorporateTests(this.state.user_id);
    this.setState({ offeredTests });
    console.log("state", offeredTests)

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
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };
  handleOfferedTestClicks = () => {
    this.setState({ offeredTest: "", isEdit: false, test_id: "" });
    this.toggle();
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

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = offeredTests => {
    this.setState({ offeredTests: offeredTests });
    this.setState({ deleteModal: true });
  };

  handleDeleteOfferedTest = () => {
    const { onDeleteOfferedTest, onGetCorporateTests } = this.props;
    const { offeredTests } = this.state;
    if (offeredTests.id !== undefined) {
      onDeleteOfferedTest(offeredTests);
      setTimeout(() => {
        onGetCorporateTests(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleOfferedTestClick = arg => {
    const offeredTest = arg;

    this.setState({
      test_id: offeredTest.test_id,
      offeredTest: {
        id: offeredTest.id,
        test_name: offeredTest.test_name,
        test_id: offeredTest.test_id,
        price: offeredTest.price,
        start_date: offeredTest.start_date,
        end_date: offeredTest.end_date,
        // is_active:'Yes',
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { offeredTests } = this.props;
    const { tests } = this.props;
    const { labProfiles } = this.props;
    // const { units } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCorporateTest, onGetCorporateTests, } =
      this.props;
    const offeredTest = this.state.offeredTest;

    const pageOptions = {
      sizePerPage: 10000,
      totalSize: offeredTests.length, // replace later with size(offeredTests),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const testList = [];
    for (let i = 0; i < tests.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in testList
      for (let j = 0; j < offeredTests.length; j++) {
        if (tests[i].id == offeredTests[j].test_id) {
          flag = 1;
        }
      }

      if (!flag) {
        testList.push({
          label: tests[i].name,
          value: tests[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteOfferedTest}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
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
                                    />
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

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Offered Test"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            test_id:
                                              (offeredTest &&
                                                offeredTest.test_id) ||
                                              "",
                                            price:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            start_date: (offeredTest && offeredTest.start_date) || "",
                                            end_date: (offeredTest && offeredTest.end_date) || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            price: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter your price"
                                              )
                                              .positive()
                                              .integer()
                                              .min(
                                                0,
                                                "Please enter a number greater than or equal to 0"
                                              )
                                              .max(
                                                50000,
                                                "Please enter a number less than or equal to 50000"
                                              ),

                                            start_date: Yup.date().nullable().required("Please select a start date"),
                                            end_date: Yup.date()
                                              .nullable()
                                              .min(
                                                Yup.ref("start_date"),
                                                "End date must be after or equal to the start date"
                                              )
                                              .required("Please select an end date"),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const updateCorporateTest = {
                                                id: offeredTest.id,
                                                test_id: parseInt(
                                                  values.test_id
                                                ),
                                                price: values.price,
                                                start_date: values.start_date,
                                                end_date: values.end_date,

                                                // is_active:
                                                //   values.is_active,
                                              };

                                              // update OfferedTest
                                              onUpdateCorporateTest(
                                                updateCorporateTest,
                                                this.state.user_id,
                                              );

                                              setTimeout(() => {
                                                onGetCorporateTests(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            } else {
                                              // if (!values.unit_id) {
                                              //   values.unit_id = units[0].id;
                                              // }

                                              const newOfferedTest = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                test_id: this.state.test_id,
                                                price: values.price,
                                                start_date: values.start_date,
                                                end_date: values.end_date,

                                                // is_active:
                                                //   values.is_active,
                                              };

                                              // save new OfferedTest
                                              onAddNewOfferedTest(
                                                newOfferedTest,
                                                this.state.user_id
                                              );

                                              setTimeout(() => {
                                                onGetCorporateTests(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedOfferedTest: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, values, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* Make field readonly in case of edit form */}
                                                  {offeredTest.test_id &&
                                                    offeredTest.test_id ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Test name
                                                      </Label>
                                                      <Field
                                                        name="test_id"
                                                        as="select"
                                                        defaultValue={
                                                          offeredTest.test_id
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                        multiple={false}
                                                      >
                                                        <option
                                                          key={
                                                            offeredTest.test_id
                                                          }
                                                          value={
                                                            offeredTest.test_id
                                                          }
                                                        >
                                                          {
                                                            offeredTest.test_name
                                                          }
                                                        </option>
                                                      </Field>
                                                    </div>
                                                  ) : (
                                                    <div className="mb-3 select2-container">
                                                      <Label>
                                                        Test Name
                                                        <span className="text-danger font-size-12">
                                                          *
                                                        </span>
                                                      </Label>
                                                      {/* <Select
                                                        component="select"
                                                        onChange={
                                                          this.handleSelectGroup
                                                        }
                                                        options={optionGroup}
                                                        classNamePrefix="select2-selection"
                                                      /> */}
                                                      <Select
                                                        name="test_id"
                                                        component="Select"
                                                        onChange={selectedGroup =>
                                                          this.setState({
                                                            test_id:
                                                              selectedGroup.value,
                                                          })
                                                        }
                                                        className={
                                                          "defautSelectParent" +
                                                          (!this.state.test_id
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        styles={{
                                                          control: (
                                                            base,
                                                            state
                                                          ) => ({
                                                            ...base,
                                                            borderColor: !this
                                                              .state.test_id
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                          }),
                                                        }}
                                                        options={testList}
                                                        placeholder="Select Test..."
                                                      />

                                                      <div className="invalid-feedback">
                                                        Please select your test
                                                      </div>
                                                    </div>
                                                  )}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Start Date
                                                      <span className="text-danger font-size-12">*</span>
                                                    </Label>
                                                    <Field
                                                      name="start_date"
                                                      type="datetime-local"
                                                      min={new Date().toISOString().slice(0, -8)}
                                                      className={
                                                        "form-control" +
                                                        (errors.start_date && touched.start_date ? " is-invalid" : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="start_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      End Date
                                                      <span className="text-danger font-size-12">*</span>
                                                    </Label>
                                                    <Field
                                                      name="end_date"
                                                      type="datetime-local"
                                                      min={values.start_date || new Date().toISOString().slice(0, -8)}
                                                      className={
                                                        "form-control" +
                                                        (errors.end_date && touched.end_date ? " is-invalid" : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="end_date"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Price
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="price"
                                                      type="number"
                                                      className={
                                                        "form-control" +
                                                        (errors.price &&
                                                          touched.price
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="price"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                </Col>
                                              </Row>

                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      disabled={
                                                        !this.state.test_id
                                                      }
                                                    >
                                                      Save
                                                    </button>
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Form>
                                          )}
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
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
  tests: PropTypes.array,
  labProfiles: PropTypes.array,
  // units: PropTypes.array,
  offeredTests: PropTypes.array,
  className: PropTypes.any,
  onGetCorporateTests: PropTypes.func,
  onDeleteOfferedTest: PropTypes.func,
  onUpdateCorporateTest: PropTypes.func,
};

const mapStateToProps = ({ offeredTests }) => ({
  offeredTests: offeredTests.offeredTests,
  tests: offeredTests.tests,
  labProfiles: offeredTests.labProfiles,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // onGetUnits: () => dispatch(getUnits()),
  onGetCorporateTests: id => dispatch(getCorporateTests(id)),
  onUpdateCorporateTest: offeredTest => dispatch(updateCorporateTest(offeredTest)),
  onDeleteOfferedTest: offeredTest => dispatch(deleteOfferedTest(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
