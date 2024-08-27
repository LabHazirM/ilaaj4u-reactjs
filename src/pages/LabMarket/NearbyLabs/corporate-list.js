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
import {
  // getUnits,
  getLabCorporate,
} from "store/corporatedata/actions";import {
  // getUnits,
  addNewCorporate,
} from "store/offered-tests/actions";
import {
  getLabProfile
} from "store/test-appointments/actions";

class TestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      selectedStatus: null,
      selectedName: null,
      cemployeeDatas: [],
      labProfiles: [],
      offeredTests: [],
      offeredTest: "",
      corporate_id: "",
      assignedTo: "",
      TestsList: "",
      btnText: "Copy",
      selectedallow: "No", // Set the default value of selectedallow to "No"
      cemployeeDatas: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      testsListListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
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
              {/* <span>
              {offeredTest.offered_tests}
              </span> */}
              <Link to={`/corporate-offered-tests/${offeredTest.account_id}`}>{offeredTest.offered_tests}</Link>
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
          dataField: "corporate_status",
          text: "Status",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.corporate_status}
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
            // <div className="d-flex gap-6">
              <div className="float-middle">
               <Button
                  color="primary"
                  className="w-55  btn-block btn btn-primary"
                  onClick={e => this.handleOfferedTestClicks(e, offeredTest.id, offeredTest.allow_all, offeredTest.name)}
                >
                  <i className="mdi mdi-sticker-check-outline me-1" />
                  Accept
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
  }

  componentDidMount() {
    const { cemployeeDatas, onGetLabCorporate } = this.props;
    console.log(onGetLabCorporate(this.state.user_id));
    this.setState({ cemployeeDatas });

    const { labProfiles, onGetLabProfile } = this.props;
    onGetLabProfile(this.state.user_id);
    this.setState({
      labProfiles
    });
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
        corporate_id: arg1, // set the corporate_id value to arg
        allow_all: arg2,
        corporate_name: arg3, // set the corporate_id value to arg
        // status: arg3,
      },
      selectedcor: arg1,
      selectedallow: arg2 === "Yes" ? "Yes" : "No", // Set selectedallow based on arg2 value
      corporatename: arg3,
      // selectedstatus: arg3, 

    }
  );
    this.toggle();
  };
  handleSaveButtonClick = () => {
    // Your other logic...
    // Your other logic...
    const { selectedcor, selectedallow } = this.state; // Use selectedTest from the component state

    // If selectedallow is undefined, set it to "No"
    const { offeredTest } = this.state;
    const newOfferedTest = {

      corporate_id: selectedcor, // Use selectedTest as the corporate_id value
      status: "Accept",
      allow_all: selectedallow
     
    };

    this.props.onAddNewCorporate(newOfferedTest,this.state.user_id,  setTimeout(() => {
        this.props.history.push("/accepted-corporates-List");
    }, 2000));

    this.toggle();
  };
  handleNameChange = (e) => {
    this.setState({ selectedName: e.target.value });
  };

  handleStatusChange = (e) => {
    this.setState({ selectedStatus: e.target.value });
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
  render() {
    const { SearchBar } = Search;
    const { isEdit, deleteModal } = this.state;
    const { offeredTests } = this.props;
    const { labProfiles } = this.props;
    const offeredTest = this.state.offeredTest;
    const { cemployeeDatas } = this.props;
    const data = this.state.data;
    const { onGetLabProfile, onAddNewCorporate, onGetLabCorporate } = this.props;

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
      sizePerPage: cemployeeDatas.length,
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
            <title>Corporate Medical Tests | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Tests" breadcrumbItem="Corporations List" />
            <Row className="mb-2">
            <Col sm="4">
                <div className="ms-2 mb-4">
                    <div>
                        <Label for="pending_corporate" className="form-label">
                            <strong>Corporate Statuses</strong>
                        </Label>
                        <select
                            className="form-control select2"
                            title="pending_corporate"
                            name="pending_corporate"
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
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.testsListListColumns}
                      data={cemployeeDatas}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.testsListListColumns}
                          data={cemployeeDatas}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                              {/* <div> 
                              {this.props.labProfiles.type === "Main Lab" && (
                              <span className="text-danger font-size-12">
                              <strong>
                                Note: Here only the list of Corporations that match your Territorie will be shown.
                              </strong>
                              </span>
                              )}</div> */}
                              <div>
                                  <span className="text-danger font-size-12">
                  <strong>
                  Note: Only corporations that match the territory of your lab will be displayed. The lab has the option to accept working with these corporations, considering the test prices and payment terms.
                  </strong>
                  </span>
                  </div>
                
                  <Col lg="3" className="mt-2">
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
                                </Col>
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 mt-2 d-inline-block">
                                    <div className="position-relative">
            
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                  
                                </Col> */}
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
                                      data={filteredData}
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
                                          : "Corporate Offer"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            // status:
                                            //   (offeredTest &&
                                            //     offeredTest.status) ||
                                            //   "Accept",
                                            allow_all: 
                                            (offeredTest &&
                                              offeredTest.allow_all) ||
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
                                          // in onSubmit function
                                          onSubmit={values => {
                                            const { isEdit, selectedallow , selectedcor, corporatename} = this.state; // get isEdit and selectedTest from component state
                                            {
                                              const newOfferedTest = {
                                                corporate_id: selectedcor,
                                                name: corporatename,
                                                allow_all: selectedallow,
                                              };
                                              onAddNewCorporate(newOfferedTest, this.state.user_id);
                                              setTimeout(() => {
                                                onGetLabCorporate(this.state.user_id);
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
                                              <div className="mb-3">
                                                    <Label className="form-label">
                                                      Corporate Name
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="corporate_id"
                                                      type="text"
                                                      readOnly={true}
                                                      value= {this.state.corporatename}
                                                      className={
                                                        "form-control" +
                                                        (errors.corporate_id &&
                                                        touched.corporate_id
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="corporate_id"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                {this.props.labProfiles.type === "Main Lab" && (

                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                  <Label
                                                    htmlFor="name"
                                                    className="col-form-label"
                                                  >
                                                    Collaction Points are allowed to handel this corporate patients.
                                                    <span
                                                      style={{ color: "#f46a6a" }}
                                                      className="font-size-18"
                                                    >
                                                      *
                                                    </span>
                                                  </Label>
                                                  <Col md="10">
                                                  <select
                                                    name="allow_all"
                                                    value={this.state.selectedallow}
                                                    className="form-select"
                                                    onChange={(e) => this.setState({ selectedallow: e.target.value })}
                                                  >
                                                    {/* options */}
                                                    <option value="No">No</option>
                                                    <option value="Yes">Yes</option>
                                                  </select>

                                                  </Col>
                                                  </div>

                                                </Col>)}
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

TestsList.propTypes = {
  history: PropTypes.any,
  match: PropTypes.object,
  cemployeeDatas: PropTypes.array,
  labProfiles: PropTypes.array,
  className: PropTypes.any,
  onGetLabCorporate: PropTypes.func,
  onAddNewCorporate: PropTypes.func,
  offeredTests: PropTypes.array,
  onAssignAudit: PropTypes.func,
  onGetLabProfile: PropTypes.func,

};
const mapStateToProps = ({ cemployeeData, testAppointments }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
  labProfiles: testAppointments.labProfiles,

});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabCorporate: id => dispatch(getLabCorporate(id)),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
  onAddNewCorporate: (offeredTest, id) =>
    dispatch(addNewCorporate(offeredTest, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TestsList));
