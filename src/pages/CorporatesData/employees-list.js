import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';

// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
  FormGroup,
  Card,
  Input,
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
  getEmployeeCorporate,
  updateCemployee,
  deletecedata
} from "store/corporatedata/actions";
import { getCLabAccountStatements } from "store/b2b-account-statements/actions";


import {
  getCorporateProfile,
} from "../../store/actions";


import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import b2bAccountStatements from "pages/AccountStatements/b2b-account-statements";
// import { Tooltip } from "@material-ui/core";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      cemployeeDatas: [],
      b2baccountStatements: [],
      tests: [],
      labProfiles: [],
      // units: [],
      offeredTest: "",
      type: "",
      payment_terms:"",
      selectedcorporate: null,
      selectedType: null,
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      
    };
    this.handleOfferedTestClick = this.handleOfferedTestClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  async componentDidMount() {
    const { onGetEmployeeCorporate, getCorporateProfile } = this.props;
    
  
    try {
      // Fetch the corporate profile using the user ID from state
      await getCorporateProfile(this.state.user_id);
    } catch (error) {
      console.error('Error fetching corporate profile:', error);
    }
  
    // Fetch the employee corporate data
    onGetEmployeeCorporate(this.state.user_id);
    const { onGetCLabAccountStatements, match } = this.props;
    const userId = match.params.id || this.state.user_id;
    
    if (userId) {
      onGetCLabAccountStatements(userId);
    }
  }

    // eslint-disable-next-line no-unused-vars
    componentDidUpdate(prevProps) {
  const { CorporateProfile } = this.props;

  // Check if CorporateProfile has changed
  if (CorporateProfile !== prevProps.CorporateProfile) {
    const payment_terms = CorporateProfile?.payment_terms;

    if (payment_terms) {
      console.log("Payment Terms after update:", payment_terms);

      // Update the state with the payment_terms
      this.setState({ payment_terms });
    }
  }
  if (prevProps.b2baccountStatements !== this.props.b2baccountStatements) {
    this.setState({ b2baccountStatements: this.props.b2baccountStatements }, () => {
      // Log updated state inside the callback to ensure it reflects the new state
      console.log("b2baccountStatements on component did update", this.state.b2baccountStatements);
    });
  }
}

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

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
  handleOfferedTestClicks = () => {
    this.setState({ offeredTest: "", isEdit: false, });
    this.toggle();
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

  /* Insert,Update Delete data */

  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = cemployeeDatas => {
    this.setState({ cemployeeDatas: cemployeeDatas });
    this.setState({ deleteModal: true });
  };

  handleOfferedTestClick = (e, arg) => {
    this.setState({
      offeredTest: {
        id: arg.id,
        name: arg.name,
        employee_code: arg.employee_code,
        limit: arg.limit,
        date: arg.date,
        status: arg.status,
      },
      isEdit: true,
    });

    this.toggle();
  };
  handleDeletePathologist = () => {
    const { onDeletecedata, onGetEmployeeCorporate } = this.props;
    const { cemployeeDatas } = this.state;
    if (cemployeeDatas.id !== undefined) {
      onDeletecedata(cemployeeDatas);
      setTimeout(() => {
        onGetEmployeeCorporate(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };
  getColumns() {
    const { payment_terms } = this.state;
    console.log("ongetcolums",this.state.b2baccountStatements);

    // Define columns that are always present
    let columns = [
      {
        text: "ID",
        dataField: "id",
        sort: true,
        formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
        filter: textFilter(),
      },
      {
        dataField: "name",
        text: "Name",
        sort: true,
        style: { textAlign: "left" },
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.name}</span>
        ),
        filter: textFilter(),
      },
      {
        dataField: "employee_code",
        text: "ID Card No.",
        sort: true,
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.employee_code}</span>
        ),
        filter: textFilter(),
      },
      {
        dataField: "type",
        text: "Type",
        sort: true,
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.type === "Family" ? "Family and Friends" : offeredTest.type}</span>
        ),
        filter: selectFilter({
          options: {
            '': 'All',
            'Employee': 'Employee',
            'Family': 'Family and Friends',
          },
          defaultValue: 'All',
        }),
      },
      {
        dataField: "relation",
        text: "Relation with Employee",
        sort: true,
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.relation || "--"}</span>
        ),
        filter: textFilter(),
      },
      {
        dataField: "parent_employee_id",
        text: "Parent Employee",
        style: { textAlign: "left" },
        sort: true,
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.parent_employee_id || "--"}</span>
        ),
        filter: textFilter(),
      },
    ];

    // Conditionally add columns based on payment_terms
    if (payment_terms === "Payment by Coorporate to LH") {
      columns = [
        ...columns,
        {
          dataField: "limit",
          text: "Quota",
          style: { textAlign: "right" },
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <span>{offeredTest.limit}</span>
          ),
          filter: textFilter(),
        },
        {
          dataField: "remening_quota",
          text: "Remaining Quota",
          style: { textAlign: "right" },
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <span>{offeredTest.remening_quota}</span>
          ),
          filter: textFilter(),
        },
        {
          dataField: "start_date",
          text: "Starting Date",
          sort: true,
          formatter: (cellContent, paymentCreatedStatus) => {
            if (!paymentCreatedStatus.start_date) {
              return <p className="text-muted mb-0">-</p>;
            }
            const date = new Date(paymentCreatedStatus.start_date);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(-2);
            return <p className="text-muted mb-0">{`${day}-${month}-${year}`}</p>;
          },
          filter: textFilter(),
        },
        {
          dataField: "date",
          text: "Expiry Date",
          sort: true,
          formatter: (cellContent, paymentCreatedStatus) => {
            if (!paymentCreatedStatus.date) {
              return <p className="text-muted mb-0">-</p>;
            }
            const date = new Date(paymentCreatedStatus.date);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(-2);
            return <p className="text-muted mb-0">{`${day}-${month}-${year}`}</p>;
          },
          filter: textFilter(),
        },
        // Add any other columns that should be conditionally inserted
      ];
    }

    // Add the always-present columns at the end
    columns = [
      ...columns,
      {
        dataField: "status",
        text: "Activity Status",
        sort: true,
        formatter: (cellContent, offeredTest) => (
          <span>{offeredTest.status}</span>
        ),
        filter: selectFilter({
          options: {
            '': 'All',
            'Active': 'Active',
            'Inactive': 'Inactive',
          },
          defaultValue: 'All',
        }),
      },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Action",
        formatter: (cellContent, offeredTest) => (
          <div className="d-flex gap-3" style={{ textAlign: "center", justifyContent: "center" }}>
            <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleOfferedTestClick(e, offeredTest)}
                ></i>
              </Link>
            </Tooltip>
            {/* <Tooltip title="Delete"> */}
            {console.log("offeredTest id:", offeredTest.id)}
    {console.log("b2baccountStatements ids:", this.props.b2baccountStatements.map(statement => statement.employee_id))}

    {!this.props.b2baccountStatements.some(statement => statement.employee_id === offeredTest.id) && (
      <button
        type="submit"
        className="btn btn-danger save-user"
        onClick={() => this.onClickDelete(offeredTest)}
      >
        Delete
      </button>
)}

            {/* </Tooltip> */}
          </div>
        ),
      },
    ];

    return columns;
  }
  render() {
    const { SearchBar } = Search;
    const columns = this.getColumns();
    const { cemployeeDatas,CorporateProfile } = this.props;
    console.log("props on render", this.props.b2baccountStatements);
    console.log("state on render", this.state.b2baccountStatements);


    const payment_terms = CorporateProfile?.payment_terms;

    // Log the payment_terms prop
    console.log("Payment Terms:", payment_terms);

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCemployee, onGetEmployeeCorporate, } =
      this.props;
    const uniqueCorporateNames = [...new Set(cemployeeDatas.map(data => data.status
    ))];

    // Generate labOptions for the <select> dropdown
    const corporateEmployeeOptions = uniqueCorporateNames.map((EmployeeStatus, index) => (
      <option key={index} value={EmployeeStatus}>
        {EmployeeStatus}
      </option>
    ));

    const filteredStatements = cemployeeDatas.filter((statement) => {
      const { selectedcorporate, selectedType } = this.state;
      const EmployeeFilter = !selectedcorporate || statement.status === selectedcorporate;
      const TypeFilter = !selectedType || statement.type === selectedType;
      return EmployeeFilter && TypeFilter;
    });
    const offeredTest = this.state.offeredTest;

    const pageOptions = {
      sizePerPage: 10000,
      totalSize: cemployeeDatas.length, // replace later with size(cemployeeDatas),
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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Employees List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Employees Tests" breadcrumbItem="Employees List" />
            <Row>
            <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: The status will initially be set to inactive and can be activated either through the registration process or by the corporate by edit action on this page.

                  </strong>
                  <br></br>
                  </span>
                </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Row>
                    <Col lg="3">
                      <div className="mb-3">
                        <label className="form-label">All Employees</label>
                        <select
                          value={this.state.selectedcorporate}
                          onChange={(e) => this.setState({ selectedcorporate: e.target.value })}
                          className="form-control"
                        >
                          <option value="">Select Status</option>
                          {corporateEmployeeOptions}
                        </select>
                      </div>
                    </Col>
                    <Col lg="3">
  <div className="mb-3">
    <label className="form-label">Type</label>
    <select
      value={this.state.selectedType}
      onChange={(e) => this.setState({ selectedType: e.target.value })}
      className="form-control"
    >
      <option value="">Select type</option>
      <option value="Employee">Employee</option>
      <option value="Family">Family and Friends</option>
    </select>
  </div>
</Col>
</Row>

                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.offeredTestListColumns}
                      data={cemployeeDatas}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.offeredTestListColumns}
                          data={cemployeeDatas}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>

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
                                      filter={filterFactory()}
                                      data={filteredStatements}
                                      columns={columns}
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
                                          ? "Edit Employee Data"
                                          : "Add Employee Data"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            name:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .name) ||
                                              "",
                                            employee_code:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .employee_code) ||
                                              "",
                                              limit:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .limit) ||
                                              "",
                                              date:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .date) ||
                                              "",
                                            status:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            employee_code: Yup.string()
                                              .required("Employee Code is required")
                                              .matches(/^\d{13}$/, "Employee Code must be exactly 13 digits")
                                          })}
                                          onSubmit={(values, { setSubmitting }) => {
                                            console.log("Form submitted with values:", values);
                                            setSubmitting(false);

                                            const updateCemployee =
                                            {
                                              id: offeredTest.id,
                                              name: values.name,
                                              employee_code:
                                                values.employee_code,
                                              status: values.status,
                                              limit: values.limit,
                                              date: values.date,
                                            };

                                            // update PaymentStatus
                                            onUpdateCemployee(
                                              updateCemployee
                                            );
                                            setTimeout(() => {
                                              onGetEmployeeCorporate(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched, isValid }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Employee Name
                                                    <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      type="text"
                                                      name="name"
                                                      className={"form-control" + (errors.name && touched.name ? " is-invalid" : "")}
                                                    />
                                                    <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Employee Code</Label>
                                                    <Field
                                                      type="text"
                                                      name="employee_code"
                                                      className={"form-control" + (errors.employee_code && touched.employee_code ? " is-invalid" : "")}
                                                    />
                                                    <ErrorMessage name="employee_code" component="div" className="invalid-feedback" />
                                                  </div>
                                                  {payment_terms === "Payment by Coorporate to LH" && (
                            <>

                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Amount Limit</Label>
                                                    <Field
                                                      type="text"
                                                      name="limit"
                                                      className={"form-control" + (errors.limit && touched.limit ? " is-invalid" : "")}
                                                    />
                                                    <ErrorMessage name="limit" component="div" className="invalid-feedback" />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="col-form-label">Expiry Date</Label>
                                                    <Field
                                                      type="datetime-local"
                                                      name="date"
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                        " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className={"form-control" + (errors.date && touched.date ? " is-invalid" : "")}
                                                    />
                                                    <ErrorMessage name="date" component="div" className="invalid-feedback" />
                                                  </div>
                                                  </>)}
                                                  <div className="mb-3">
                                                  <Label htmlFor="status" className="form-label">
                                                    Activity Status
                                                  </Label>
                                                  <Field name="status" as="select" className="form-select">
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
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
  onDeletePaymentout: PropTypes.func,
  cemployeeDatas: PropTypes.array,
  getCorporateProfile: PropTypes.func.isRequired,
  className: PropTypes.any,
  onGetEmployeeCorporate: PropTypes.func,
  b2baccountStatements: PropTypes.array,
  CorporateProfile: PropTypes.object,
  onUpdateCemployee: PropTypes.func,
  onDeletecedata: PropTypes.func,
  payment_terms: PropTypes.string,
  onGetCLabAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData,CorporateProfile,b2baccountStatements }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  CorporateProfile:CorporateProfile.success,
  b2baccountStatements: b2baccountStatements.b2baccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetEmployeeCorporate: id => dispatch(getEmployeeCorporate(id)),
  onUpdateCemployee: offeredTest => dispatch(updateCemployee(offeredTest)),
  onDeletecedata: offeredTest => dispatch(deletecedata(offeredTest)),
  getCorporateProfile: (id) => dispatch(getCorporateProfile(id)),
  onGetCLabAccountStatements: (id) => dispatch(getCLabAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
