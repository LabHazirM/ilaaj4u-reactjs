import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import * as Yup from "yup";

import {
  Alert,
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
import { getTestsList } from "store/test-list/actions";
import {
  // getUnits,
  addNewOfferedTest,
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
      isPaymentUpdated: false,
      disabledTests: [], // an array to keep track of disabled test IDs
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
          // headerStyle: {
          //   width: "330px",
          //   textAlign: "left",
          // },
          formatter: (cellContent, testsList) => (
            <>
              {testsList.type == "Test" ? (
                <span>
                <p className="float-start">
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, testsList)}
                    // onMouseEnter={e => this.openPatientModal(e, testsList)}
                    // onPointerLeave={this.handleMouseExit()}
                  >
                    {testsList.name}
                  </Link></p>
                </span>
              ) : (
                <span>
                <p className="float-start">
                  <Link
                    to="#"
                    onClick={e => this.openOtherModal(e, testsList)}
                    // onMouseEnter={e =>  this.openOtherModal(e, testsList)}
                    // onPointerLeave={this.handleMouseExit()}
                  >
                    {testsList.name}
                  </Link></p>
                </span>
              )}
            </>
          ),
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
                  type="button"
                  color={this.state.disabledTests.includes(testsList.id) ? 'secondary' : 'primary'}
                  className={`btn mt-3 me-1${this.state.disabledTests.includes(testsList.id) ? ' disabled' : ''}`}
                  onClick={e => this.handleOfferedTestClicks(e, testsList.id, testsList.name, testsList.sample_type)}
                  disabled={this.state.disabledTests.includes(testsList.id)} // Disable the button if the item is in the cart
                >
                  <i className="mdi mdi-plus-circle-outline me-1" /> {this.state.disabledTests.includes(testsList.id) ? 'Already Added' : 'Add Test'}
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
    const { testsList, ongetTestsList } = this.props;
    console.log(ongetTestsList(this.state.user_id));
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
        test_name: arg2,
        sample_type: arg3,
      },
      selectedTest: arg1, // store arg in component state
      selectedname: arg2,
      selectedtype: arg3,
      // Check if the test is already disabled
    });
    if (!this.state.disabledTests.includes(arg1)) {
      // Add the test ID to the disabledTests array
      this.setState((prevState) => ({
        disabledTests: [...prevState.disabledTests, arg1],
      }));
    }
    this.toggle();
  };
  
  // handleOfferedTestClicks = (e, arg) => {
  //   this.setState(
  //     console.log("fuction call",{
  //     offeredTest: "",
  //     isEdit: false,
  //     initialValues: {
  //       ...this.state.initialValues,
  //       test_id: arg // set the test_id value to arg
  //     }
  //   }));
  //   this.toggle();
  // };
  // handleOfferedTestClicks = (e, arg) => {
  //   this.setState(
  //     console.log("id in function",{
  //     test_id: arg,
  //     offeredTest: "",
  //     isEdit: false
  //   }));
  //   this.toggle();
  // };
  // handleOfferedTestClick = arg => {
  //   const offeredTest = arg;
  //   const testsList =arg;

  //   this.setState({
  //     test_id: offeredTest.test_id,
  //     offeredTest: {
  //       id: offeredTest.id,
  //       test_name: offeredTest.name,
  //       // unit_name: offeredTest.unit_name,
  //       test_id: offeredTest.test_id,
  //       // unit_id: offeredTest.unit_id,
  //       duration_required: offeredTest.duration_required,
  //       duration_type: offeredTest.duration_type,
  //       sample_type: offeredTest.sample_type,
  //       price: offeredTest.price,
  //       is_eqa_participation: offeredTest.is_eqa_participation,
  //       is_home_sampling_available: offeredTest.is_home_sampling_available,
  //       is_test_performed: offeredTest.is_test_performed,
  //       is_active:'Yes',
  //     },
  //     isEdit: true,
  //   });

  //   this.toggle();
  // };

  render() {
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;
    const { offeredTests } = this.props;
    const offeredTest = this.state.offeredTest;
    const { testsList } = this.props;
    const data = this.state.data;
    const { onAddNewOfferedTest, ongetTestsList } = this.props;

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
            <title>Medical Tests | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Tests" breadcrumbItem="Medical Tests" />
            <Row>
            {
             this.state.isPaymentUpdated && this.state.isPaymentUpdated ? (
              <Alert color="success">Offered Test Added Successfully.</Alert>
            ) : null}

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
                    Note: The Tests, Profile and Packages already added will not be displayed here.........
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
                                            // unit_id:
                                            //   (offeredTest &&
                                            //     offeredTest.unit_id) ||
                                            //   "",
                                            duration_required:
                                              (offeredTest &&
                                                offeredTest.duration_required) ||
                                              "",
                                            duration_type:
                                              (offeredTest &&
                                                offeredTest.duration_type) ||
                                              "",
                                            sample_type:
                                              (offeredTest &&
                                                offeredTest.sample_type) ||
                                              "",
                                            price:
                                              (offeredTest &&
                                                offeredTest.price) ||
                                              "",
                                            is_eqa_participation:
                                              (offeredTest &&
                                                offeredTest.is_eqa_participation) ||
                                              "",
                                            is_home_sampling_available:
                                              (offeredTest &&
                                                offeredTest.is_home_sampling_available) ||
                                              "No",
                                            is_test_performed:
                                              (offeredTest &&
                                                offeredTest.is_test_performed) ||
                                              "",
                                            is_active:
                                              (offeredTest &&
                                                offeredTest.is_active) ||
                                              "Yes",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            duration_required: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter turn around time required"
                                              ),
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
                                            duration_type: Yup.string()
                                              .trim()
                                              .required(
                                                "Please select duration type"
                                              ),
                                            // is_eqa_participation: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please select one option from dropdown"
                                            //   ),
                                            // is_home_sampling_available:
                                            //   Yup.string()
                                            //     .trim()
                                            //     .required(
                                            //       "Please select one option from dropdown"
                                            //     ),
                                            // is_active:
                                            //     Yup.string()
                                            //       .trim()
                                            //       .required(
                                            //         "Please select one option from dropdown"
                                            //       ),
                                          })}
                                          // in onSubmit function
                                          onSubmit={values => {
                                            const { isEdit, selectedTest , selectedname, selectedtype } = this.state; // get isEdit and selectedTest from component state
                                            if (isEdit) {
                                              const updateOfferedTest = {
                                                id: offeredTest.id,
                                                test_id: selectedTest, // use selectedTest as the test_id value
                                                test_name: selectedTest,
                                                duration_required: values.duration_required,
                                                duration_type: values.duration_type,
                                                sample_type: values.sample_type,
                                                price: values.price,
                                                is_eqa_participation: values.is_eqa_participation,
                                                is_home_sampling_available: values.is_home_sampling_available,
                                                is_test_performed: values.is_test_performed,
                                                is_active: values.is_active,
                                              };
                                            } else {
                                              const newOfferedTest = {
                                                test_id: selectedTest, // use selectedTest as the test_id value
                                                test_name: selectedname,
                                                test_type: this.state.test_type,
                                                test_details: this.state.test_details,
                                                duration_required: values.duration_required,
                                                duration_type: values.duration_type,
                                                sample_type: selectedtype,
                                                price: values.price,
                                                is_eqa_participation: values.is_eqa_participation,
                                                is_home_sampling_available: values.is_home_sampling_available,
                                                is_test_performed: values.is_test_performed,
                                                is_active: values.is_active,
                                              };
                                              onAddNewOfferedTest(newOfferedTest, this.state.user_id);
                                              // setTimeout(() => {
                                                this.setState({ isPaymentUpdated: true });                                                
                                              // }, 1000);
                                              setTimeout(() => {
                                                ongetTestsList(this.state.user_id);
                                                this.setState({ isPaymentUpdated: false });                                                
                                              }, 2000);
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
                                                    <Row>
                                                      <Col lg={7}>
                                                        <Label className="form-label">
                                                          Turn Around Time
                                                          (Reporting Time)
                                                          <span className="text-danger font-size-12">
                                                            *
                                                          </span>
                                                        </Label>
                                                         <Field
                                                      name="duration_required"
                                                      type="number"
                                                      step="1"
                                                      min="0"
                                                      value={
                                                        this.state
                                                          .offeredTest
                                                          .duration_required
                                                     }
                                                      // onChange={e => {
                                                      //   this.setState({
                                                      //     offeredTest: {
                                                      //       id: this.state
                                                      //         .offeredTest
                                                      //         .id,
                                                      //         duration_required:
                                                      //         e.target.value,
                                                      //       lab_id:
                                                      //         this.props.match
                                                      //           .params.id,
                                                      //     },
                                                      //   });
                                                      // }}
                                                      className={
                                                        "form-control" +
                                                        (errors.duration_required &&
                                                        touched.duration_required
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                        <ErrorMessage
                                                          name="duration_required"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                      <Col lg={5}>
                                                        <Label className="form-label">
                                                          Duration type
                                                          <span className="text-danger font-size-12">
                                                            *
                                                          </span>
                                                        </Label>
                                                        <Field
                                                          name="duration_type"
                                                          as="select"
                                                          // className="form-control"
                                                          className={
                                                            "form-control" +
                                                            (errors.duration_type &&
                                                              touched.duration_type
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                          multiple={false}
                                                        >
                                                          <option value="">
                                                            ---- Week/Days/Hours ----
                                                          </option>
                                                          <option value="week">
                                                            Week
                                                          </option>
                                                          <option value="days">
                                                            days
                                                          </option>
                                                          <option value="hours">
                                                            hours
                                                          </option>
                                                        </Field>
                                                        <ErrorMessage
                                                          name="duration_type"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </Col>
                                                    </Row>
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Sample Type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="sample_type"
                                                      type="text"
                                                      readOnly={true}
                                                      value= {this.state.selectedtype}
                                                      className={
                                                        "form-control" +
                                                        (errors.sample_type &&
                                                        touched.sample_type
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="sample_type"
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

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is home sampling
                                                      available?
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_home_sampling_available"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_home_sampling_available &&
                                                          touched.is_home_sampling_available
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        --- Are you providing
                                                        home sampling for the
                                                        test? ---
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_home_sampling_available"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is EQA participating
                                                      <span className="text-danger font-size-12">
                                                        (optional)
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_eqa_participation"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_eqa_participation &&
                                                          touched.is_eqa_participation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                    >
                                                      <option value="">
                                                        --- Is EQA participating
                                                        for the test? ---
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_eqa_participation"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      How test is performed?
                                                      (optional)
                                                    </Label>
                                                    <Field
                                                      name="is_test_performed"
                                                      as="select"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="--"></option>
                                                      <option value="In House">
                                                        In House
                                                      </option>
                                                      <option value="Outsource">
                                                        Outsource
                                                      </option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Are you active for performing this test?
                                                    </Label>
                                                    <Field
                                                      name="is_active"
                                                      as="select"
                                                      defaultValue="Yes"
                                                      className="form-control"
                                                      multiple={false}
                                                    >
                                                      <option value="Yes">
                                                        Active
                                                      </option>
                                                      <option value="No">
                                                        In Active
                                                      </option>
                                                    </Field>
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
                                    <Modal
                                      isOpen={this.state.OtherModal}
                                      className={this.props.className}
                                      // onPointerLeave={this.handleMouseExit}
                                    >
                                      <ModalHeader
                                        toggle={this.toggleOtherModal}
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
                                                      rows="8"
                                                      cols="8"
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
                                                      Description in English
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <textarea
                                                      name="description_in_english"
                                                      id="description_in_english"
                                                      rows="8"
                                                      cols="8"
                                                      value={this.state.description_in_english}
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Description in Urdu
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <textarea
                                                      name="description_in_urdu"
                                                      id="description_in_urdu"
                                                      rows="8"
                                                      cols="8"
                                                      value={this.state.description_in_urdu}
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
                                  </div>
                                </Col>
                              </Row>
                              <Modal
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
                              </Modal>
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
  ongetTestsList: PropTypes.func,
  onAddNewOfferedTest: PropTypes.func,
  offeredTests: PropTypes.array,

  onAssignAudit: PropTypes.func,
};
const mapStateToProps = ({ tests }) => ({
  testsList: tests.testsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetTestsList: id => dispatch(getTestsList(id)),
  onAddNewOfferedTest: (offeredTest, id) =>
    dispatch(addNewOfferedTest(offeredTest, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsList));
