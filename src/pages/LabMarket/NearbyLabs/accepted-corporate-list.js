import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
// import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import {
  FormGroup,
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
  getALabCorporate,
} from "store/corporatedata/actions";
import {
  // getUnits,
  updateCorporateStatus,
} from "store/offered-tests/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedStatus: null,
      selectedName: null,
      cemployeeDatas: [],
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
          dataField: "corporate_id",
          sort: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.corporate_id}</>,
        },
        {
          dataField: "name",
          text: "Corporate Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span className="float-start">
                {offeredTest.name}
              </span>
            </>
          ),
        },
        {
          dataField: "offered_tests",
          text: "Test List",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <Link to={`/corporate-offered-tests/${offeredTest.corporate_account_id}`}>{offeredTest.offered_tests}</Link>

            </>
          ),
        },
        {
          dataField: "payment_terms",
          text: "Payment Terms",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.payment_terms}
              </span>
            </>
          ),
        },
        {
          dataField: "shared_percentage",
          text: "Referral Fee",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.shared_percentage ? `${(offeredTest.shared_percentage * 100).toFixed(0)}%` : '0%'}
              </span>
            </>
          ),
        },
        
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.status}
              </span>
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
              {offeredTest.status == "Accept" ? (
                <Button
                  color="primary"
                  className="w-55  btn-block btn btn-primary"
                  // onClick={() => this.handleOfferedTestClicks(offeredTest.id)}
                  onClick={() => this.handleSaveButtonClick(offeredTest.id)}

                // disabled={offeredTest.length == 0}
                >
                  {/* <i className="mdi mdi-sticker-check-outline me-1" /> */}
                  Cancel Request
                </Button>
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
    const { cemployeeDatas, onGetALabCorporate } = this.props;
    console.log(onGetALabCorporate(this.state.user_id));
    this.setState({ cemployeeDatas });
    this.setInitialDropdownValue();
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
    this.setState({ offeredTest: "", isEdit: false, });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { cemployeeDatas } = this.props;
    if (
      !isEmpty(cemployeeDatas) &&
      size(prevProps.cemployeeDatas) !== size(cemployeeDatas)
    ) {
      this.setState({ cemployeeDatas: {}, isEdit: false });
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

  onClickDelete = cemployeeDatas => {
    this.setState({ cemployeeDatas: cemployeeDatas });
    this.setState({ deleteModal: true });
  };

  handleOfferedTestClick = (e, arg) => {
    this.setState({
      offeredTest: {
        id: arg.id,
        status: arg.status,
      },
      isEdit: true,
    });

    this.toggle();
  };
  // handleSaveButtonClick = (complaintId) => {
  //   // Your other logic...
  
  //   const { offeredTest } = this.state;
  
  //   const updateCorporateStatus = {
  //     id: complaintId,
  //     status: "Pending",
  //     shared_percentage: this.state.shared_percentage
  //   };
  
  //   // Dispatch the action
  //   this.props.onUpdateCorporateStatus(updateCorporateStatus);
  
  //   // Optionally, you can handle the asynchronous behavior here
  //   // For example, use a promise or callback function
  //   setTimeout(() => {
  //     this.props.onGetALabCorporate(
  //       this.state.user_id
  //     );
  //   }, 1000);
  
  //   // Close the modal or perform other actions as needed
  // };
  handleSaveButtonClick = (complaintId) => {
    // Dispatch an action to update the status in Redux
    const { onUpdateCorporateStatus, onGetALabCorporate} = this.props;
    onUpdateCorporateStatus({ id: complaintId, status: "Cencel Request", shared_percentage: 0 });

    setTimeout(() => {
      onGetALabCorporate(this.state.user_id);
    }, 1000);
  };

  setInitialDropdownValue = () => {
    const { pathname } = this.props.history.location;
    let selectedValue = '';

    if (pathname.includes('/corporates-List')) {
      selectedValue = 'Pending Corporate';
    } else if (pathname.includes('/accepted-corporates-List')) {
      selectedValue = 'Accepted Corporate';
    }

    this.setState({ selectedValue });
  };
  handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    this.setState({ selectedValue });
    // Perform navigation based on the selected value
    if (selectedValue === 'Pending Corporate') {
        this.props.history.push('/corporates-List');
    }
    if (selectedValue === 'Accepted Corporate') {
        this.props.history.push('/accepted-corporates-List');
    }
}
handleNameChange = (e) => {
  this.setState({ selectedName: e.target.value });
};

handleStatusChange = (e) => {
  this.setState({ selectedStatus: e.target.value });
};
  render() {
    const { SearchBar } = Search;

    const { cemployeeDatas } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCorporateStatus, onGetALabCorporate, } =
      this.props;
    const offeredTest = this.state.offeredTest;
    const uniqueCorporateName = [...new Set(cemployeeDatas.map(data => data.name))];

    // Generate NameOptions for the <select> dropdown
    const corporateNameOptions = uniqueCorporateName.map((CorporateName, index) => (
      <option key={index} value={CorporateName}>
        {CorporateName}
      </option>
    ));

    const uniqueCorporateStatus = [...new Set(cemployeeDatas.map(data => data.corporate_status))];

    // Generate StatusOptions for the <select> dropdown
    const corporateStatusOptions = uniqueCorporateStatus.map((EmployeeStatus, index) => (
      <option key={index} value={EmployeeStatus}>
        {EmployeeStatus}
      </option>
    ));

    // Combine the filters
    const filteredData = cemployeeDatas.filter(item => {
      const { selectedName, selectedStatus } = this.state;
      const nameFilter = !selectedName || item.name === selectedName;
      const statusFilter = !selectedStatus || item.corporate_status === selectedStatus;
      return nameFilter && statusFilter;
    });
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
        <div className="page-content">
          <MetaTags>
            <title>Corporate Offered Tests List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate Offered Tests" breadcrumbItem="Corporate List" />
            <Row>
              {/* <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: If referral fee of any offered test is not entered by Labhazir, all such tests will not be online.
                                    </strong>
                                  </span>
                                  </div> */}
                                          <Row className="mb-2">
            <Col sm="4">
                <div className="ms-2 mb-4">
                    <div>
                        <Label for="accepted_corporate" className="form-label">
                            <strong>Corporate Statuses</strong>
                        </Label>
                        <select
                            className="form-control select2"
                            title="accepted_corporate"
                            name="accepted_corporate"
                            onChange={this.handleSelectChange}
                            value={this.state.selectedValue}
                        >
                            <option value="Pending Corporate">Pending Corporate</option>
                            <option value="Accepted Corporate">Accepted Corporate</option>
                        </select>
                    </div>
                </div>
            </Col>

        </Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <Row className="mb-2">        <Col lg="3" className="mt-2">
                                  <div className="mb-3">
                                    <label className="form-label">Corporate Name</label>
                                    <select
                                      value={this.state.selectedName}
                                      onChange={this.handleNameChange}
                                      className="form-control"
                                    >
                                      <option value="">All</option>
                                      {corporateNameOptions}
                                    </select>
                                  </div>
                                </Col>
                                <Col lg="3" className="mt-2">
                                  <div className="mb-3">
                                    <label className="form-label">Corporate Status</label>
                                    <select
                                      value={this.state.selectedStatus}
                                      onChange={this.handleStatusChange}
                                      className="form-control"
                                    >
                                      <option value="">All</option>
                                      {corporateStatusOptions}
                                    </select>
                                  </div>
                                </Col></Row>
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
                                      data={filteredData}
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
                                            status:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            status: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter your status"
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

                                          })}
                                          onSubmit={(values, { setSubmitting }) => {
                                            console.log("Form submitted with values:", values);
                                            setSubmitting(false);

                                            const updateCorporateStatus =
                                            {
                                              id: offeredTest.id,
                                              status:
                                                values.status,
                                            };

                                            // update PaymentStatus
                                            onUpdateCorporateStatus(
                                              updateCorporateStatus
                                            );
                                            setTimeout(() => {
                                              onGetALabCorporate(
                                                this.state.user_id
                                              );
                                            }, 1000);
                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched, isValid }) => (
                                            <Form>
                                              <Row>
                                                <FormGroup className="mb-4" row>
                                                  <Label
                                                    htmlFor="name"
                                                    md="2"
                                                    className="col-form-label"
                                                  >
                                                    Status
                                                    <span
                                                      style={{ color: "#f46a6a" }}
                                                      className="font-size-18"
                                                    >
                                                      *
                                                    </span>
                                                  </Label>
                                                  <Col md="10">
                                                    <select
                                                      name="status"
                                                      component="select"
                                                      onChange={e => this.setState({ status: e.target.value })}
                                                      defaultValue={this.state.status}
                                                      className="form-select"
                                                    >
                                                      {/* options */}
                                                      <option value="Pending">Pending</option>
                                                      <option value="Accept">Accept</option>
                                                    </select>
                                                  </Col>
                                                </FormGroup>
                                              </Row>

                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                  <button
  type="button"
  className="btn btn-success save-user"
  onClick={() => this.handleSaveButtonClick()}
>
  Save
</button>                                            </div>
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
  history: PropTypes.any,
  cemployeeDatas: PropTypes.array,
  className: PropTypes.any,
  onGetALabCorporate: PropTypes.func,
  onUpdateCorporateStatus: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetALabCorporate: id => dispatch(getALabCorporate(id)),
  onUpdateCorporateStatus: offeredTest => dispatch(updateCorporateStatus(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));