import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";

import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getCorporateTestsList } from "store/test-list/actions";
import {
  // getUnits,
  addNewCorporateTest,
} from "store/offered-tests/actions";

class TestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      testsList: [],
      offeredTests: [],
      offeredTest: "",
      test_id: "",
      assignedTo: "",
      TestsList: "",
      btnText: "Copy",
      testsList: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testsListListColumns: [
        {
          text: "Test ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, testsList) => <>{testsList.id}</>,
        },
        {
          dataField: "name",
          text: "Test name",
          sort: true,
          formatter: (cellContent, testsList) => (
            <>
              <span style={{
                width: '140px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                   {testsList.name}
              </span>
            </>
          ),
          // filter: textFilter(),
        },
        {
          dataField: "type",
          text: "Type",
          sort: true,
          // formatter: (cellContent, audit) => (
          //   <>
          //     <span>
          //       {new Date(audit.generated_at).toLocaleString("en-US")}
          //     </span>
          //   </>
          // ),
        },
        {
          dataField: "test_categories",
          text: "Category",
          sort: true,
          // formatter: (cellContent, audit) => (
          //   <>
          //     <span>{new Date(audit.assigned_at).toLocaleString("en-US")}</span>
          //   </>
          // ),
        },
        {
          dataField: "sample_type",
          text: "Sample Type",
          sort: true,
          // formatter: (cellContent, audit) => (
          //   <>
          //     <span>{new Date(audit.audited_at).toLocaleString("en-US")}</span>
          //   </>
          // ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, testsList) => (
            // <div className="d-flex gap-6">
              <div className="float-middle">
                <Button
                  color="primary"
                  className="w-55  btn-block btn btn-primary"
                  // onClick={() => this.handleOfferedTestClicks(testsList.id)}
                  onClick={e => this.handleOfferedTestClicks(e, testsList.id, testsList.name, testsList.sample_type)}

                // disabled={testsList.length == 0}
                >
                  <i className="mdi mdi-plus-circle-outline me-1" />
                  Add Test
                </Button>
              </div>
            // </div>
          ),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.toggleMessageModal.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    // this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { testsList, ongetCorporateTestsList } = this.props;
    console.log(ongetCorporateTestsList(this.state.user_id));
    this.setState({ testsList });
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      test_details: arg.test_details,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
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
  openOtherModal = (e, arg) => {
    this.setState({
      OtherModal: true,
      test_details: arg.test_details,
      description_in_english: arg.description_in_english,
      description_in_urdu: arg.description_in_urdu,
    });
  };
  // handleMouseExit = () => {
  //   this.setState({
  //     PatientModal: false,
  //     OtherModal: false,
  //     isHovered: false,
    
  //   });
  // };
  toggleOtherModal = () => {
    this.setState(prevState => ({
      OtherModal: !prevState.OtherModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

  toggleMessageModal = () => {
    this.setState(prevState => ({
      messageModal: !prevState.messageModal,
    }));
  };

  openMessageModal = (e, arg) => {
    this.setState({ messageModal: true, message: arg.message });
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

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };
  handleOfferedTestClicks = (e, arg1, arg2, arg3) => {
    this.setState({
      offeredTest: "",
      isEdit: false,
      initialValues: {
        ...this.state.initialValues,
        test_id: arg1, // set the test_id value to arg
        test_name:arg2,
        sample_type:arg3
      },
      selectedTest: arg1, // store arg in component state
      selectedname: arg2, 
      selectedtype: arg3, 

    });
    this.toggle();
  };

  render() {
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;
    const { offeredTests } = this.props;
    const offeredTest = this.state.offeredTest;
    const { testsList } = this.props;
    const data = this.state.data;
    const { onAddNewCorporateTest, ongetCorporateTestsList } = this.props;

    const pageOptions = {
      sizePerPage: testsList.length,
      totalSize: testsList.length, // replace later with size(testsList),
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
            <title>Corporate Medical Tests | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Tests" breadcrumbItem="Corporate Medical Tests" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testsListListColumns}
                      data={testsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testsListListColumns}
                          data={testsList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              <div> 
                                  <span className="text-danger font-size-12">
                  <strong>
                  Note: The Tests, Profile, and Packages previously added in Offered Tests will not be displayed here.
.
                  </strong>
                  </span>
                  </div>
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 mt-2 d-inline-block">
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
                                            price:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            start_date:
                                              (offeredTest &&
                                                offeredTest.start_date) ||
                                              "",
                                            end_date:
                                              (offeredTest &&
                                                offeredTest.end_date) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            // duration_required: Yup.number(
                                            //   "Please enter number only"
                                            // )
                                            //   .required(
                                            //     "Please enter turn around time required"
                                            //   )
                                            //   .positive()
                                            //   .integer()
                                            //   .min(
                                            //     0,
                                            //     "Please enter a number greater than or equal to 0"
                                            //   )
                                            //   .max(
                                            //     100,
                                            //     "Please enter a number less than or equal to 150"
                                            //   ),
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
                                            start_date: Yup.string(
                                                Yup.number()
                                              ).when("discount", {
                                                is: discount => discount > 0,
                                                then: Yup.string().required(
                                                  "Please select start date"
                                                ),
                                              }),
                                            end_date: Yup.string(
                                                Yup.number()
                                              ).when("discount", {
                                                is: discount => discount > 0,
                                                then: Yup.string().required(
                                                  "Please select end date"
                                                ),
                                              }),
                                          })}
                                          // in onSubmit function
                                          onSubmit={values => {
                                            const { isEdit, selectedTest , selectedname, selectedtype } = this.state; // get isEdit and selectedTest from component state
                                            if (isEdit) {
                                              const updateOfferedTest = {
                                                id: offeredTest.id,
                                                test_id: selectedTest, // use selectedTest as the test_id value
                                                test_name: selectedname,
                                                price: values.price,
                                                start_date: values.start_date,
                                                end_date: values.end_date,

                                              };
                                            } else {
                                              const newOfferedTest = {
                                                test_id: selectedTest, // use selectedTest as the test_id value
                                                test_name: selectedname,
                                                price: values.price,
                                                start_date: values.start_date,
                                                end_date: values.end_date,
                                              };
                                              onAddNewCorporateTest(newOfferedTest, this.state.user_id);
                                              setTimeout(() => {
                                                ongetCorporateTestsList(this.state.user_id);
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedOfferedTest: null,
                                            });
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Test id
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="test_id"
                                                      type="text"
                                                      readOnly={true}
                                                      value= {this.state.selectedname}
                                                      className={
                                                        "form-control" +
                                                        (errors.test_id &&
                                                        touched.test_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="test_id"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  
      <div className="mb-3">
        <Label className="form-label">
          Start Date
          <span className="text-danger font-size-12">*</span>
        </Label>
        <Field
          name="start_date"
          type="datetime-local" min={new Date(
            new Date().toString().split("GMT")[0] +
            " UTC"
          )
            .toISOString()
            .slice(0, -8)}
          className={
            "form-control" +
            (errors.start_date && touched.start_date
              ? " is-invalid"
              : "")
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
          type="datetime-local" min={new Date(
            new Date().toString().split("GMT")[0] +
            " UTC"
          )
            .toISOString()
            .slice(0, -8)}
          className={
            "form-control" +
            (errors.end_date && touched.end_date
              ? " is-invalid"
              : "")
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
                                                    // disabled={
                                                    //   !this.state.test_id
                                                    // }
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
                              {/* <Modal
                                isOpen={this.state.messageModal}
                                role="dialog"
                                autoFocus={true}
                                data-toggle="modal"
                                centered
                                toggle={this.toggleMessageModal}
                              >
                                <div className="modal-content">
                                  <div className="modal-header border-bottom-0">
                                    <button
                                      type="button"
                                      className="btn-close"
                                      onClick={() =>
                                        this.setState({
                                          messageModal: false,
                                        })
                                      }
                                      data-bs-dismiss="modal"
                                      aria-label="Close"
                                    ></button>
                                  </div>
                                  <div className="modal-body">
                                    <div className="text-center mb-4">
                                      <div className="avatar-md mx-auto mb-4">
                                        <div className="avatar-title bg-light rounded-circle text-primary h3">
                                          <i className="mdi mdi-email-open"></i>
                                        </div>
                                      </div>

                                      <div className="row justify-content-center">
                                        <div className="col-xl-10">
                                          <h4 className="text-primary">
                                            Audit Message
                                          </h4>
                                          <p className="text-muted font-size-14 mb-4">
                                            {this.state.message}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Modal> */}
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

TestsList.propTypes = {
  match: PropTypes.object,
  testsList: PropTypes.array,
  className: PropTypes.any,
  ongetCorporateTestsList: PropTypes.func,
  onAddNewCorporateTest: PropTypes.func,
  offeredTests: PropTypes.array,
  onAssignAudit: PropTypes.func,
};
const mapStateToProps = ({ tests }) => ({
  testsList: tests.testsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetCorporateTestsList: id => dispatch(getCorporateTestsList(id)),
  onAddNewCorporateTest: (offeredTest, id) =>
    dispatch(addNewCorporateTest(offeredTest, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsList));
