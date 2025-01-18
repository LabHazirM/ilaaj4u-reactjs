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
  getACorporate,
} from "store/corporatedata/actions";
import {
  // getUnits,
  updateACorporateStatus,
} from "store/offered-tests/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class OfferedTestsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      cemployeeDatas: [],
      tests: [],
      labProfiles: [],
      selectedcorporate: null,
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
          dataField: "name",
          text: "Corporate Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              {/* <span className="float-start">
                {offeredTest.name}
              </span> */}
              <Link
                to="#"
                onMouseEnter={e => this.openPatientModal(e, offeredTest)}
                onPointerLeave={this.handleMouseExit()}
              >
                <span className="float-start">{offeredTest.name}</span>
              </Link>
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
          dataField: "plateform_charges",
          text: "PlateForm Charges",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>

              <span>{(offeredTest.plateform_charges * 100).toFixed(0)}%</span>

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
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={e => this.handleOfferedTestClick(e, offeredTest)}
                  ></i>
                </Link>
              </Tooltip>
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
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
    });
  };
  componentDidMount() {
    const { cemployeeDatas, onGetACorporate } = this.props;
    console.log(onGetACorporate(this.state.user_id));
    this.setState({ cemployeeDatas });
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
      phone: arg.phone,
      city: arg.city,
      address: arg.location,

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
        plateform_charges: arg.plateform_charges,
      },
      isEdit: true,
    });

    this.toggle();
  };
  handleSaveButtonClick = () => {
    // Your other logic...

    const { offeredTest } = this.state;

    const updateACorporateStatus = {
      id: offeredTest.id,
      plateform_charges: this.state.plateform_charges,
    };

    // Dispatch the action
    this.props.onUpdateACorporateStatus(updateACorporateStatus);

    // Optionally, you can handle the asynchronous behavior here
    // For example, use a promise or callback function
    setTimeout(() => {
      this.props.onGetACorporate(
        this.state.user_id
      );
    }, 1000);

    // Close the modal or perform other actions as needed
    this.toggle();
  };
  handleSelectCorporate = (selectedOption) => {
    this.setState({ selectedcorporate: selectedOption });
  };

  render() {
    const { SearchBar } = Search;

    const { cemployeeDatas } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateACorporateStatus, onGetACorporate, } =
      this.props;
    const uniqueCorporateNames = [...new Set(cemployeeDatas.map(data => data.name))];

    // Generate labOptions for the <select> dropdown
    const corporateOptions = uniqueCorporateNames.map((corporateName, index) => (
      <option key={index} value={corporateName}>
        {corporateName}
      </option>
    ));

    const filteredStatements = cemployeeDatas.filter((statement) => {
      const { selectedcorporate } = this.state;
      const labFilter =
        !selectedcorporate || statement.name === selectedcorporate;
      return labFilter;
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
        <div className="page-content">
          <MetaTags>
            <title>Corporate Offered Tests List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate PlateForm Charges" breadcrumbItem="Corporate List" />
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
                    <Col lg="3">
                      <div className="mb-3">
                        <label className="form-label">Corpotate List</label>
                        <select
                          value={this.state.selectedcorporate}
                          onChange={(e) => this.setState({ selectedcorporate: e.target.value })}
                          className="form-control"
                        >
                          <option value="">Select Corporate</option>
                          {corporateOptions}
                        </select>
                      </div>
                    </Col>
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
                                      data={filteredStatements}
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
                                                      phone
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.address
                                                      }
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
                                          ? "Update PlateForm Charges"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            plateform_charges:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .plateform_charges) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            plateform_charges: Yup.number().required(
                                              "Please enter Shared Percentage from 0 to 0.9"
                                            ),

                                          })}
                                          onSubmit={(values, { setSubmitting }) => {
                                            console.log("Form submitted with values:", values);
                                            setSubmitting(false);

                                            const updateACorporateStatus =
                                            {
                                              id: offeredTest.id,
                                              plateform_charges:
                                                values.plateform_charges,
                                            };

                                            // update PaymentStatus
                                            onUpdateACorporateStatus(
                                              updateACorporateStatus
                                            );
                                            setTimeout(() => {
                                              onGetACorporate(
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
                                                  // md="2"
                                                  // className="col-form-label"
                                                  >
                                                    PlateForm Charges
                                                    <span
                                                      style={{ color: "#f46a6a" }}
                                                      className="font-size-18"
                                                    >
                                                      *
                                                    </span>
                                                  </Label>
                                                  <Field
                                                    name="plateform_charges"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.00"
                                                    max="1.00"
                                                    value={this.state.plateform_charges}
                                                    onChange={e => this.setState({ plateform_charges: e.target.value })}
                                                    className={
                                                      "form-control" +
                                                      (errors.plateform_charges &&
                                                        touched.plateform_charges
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name="plateform_charges"
                                                    component="div"
                                                    className="invalid-feedback"
                                                  />
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
  cemployeeDatas: PropTypes.array,
  className: PropTypes.any,
  onGetACorporate: PropTypes.func,
  onUpdateACorporateStatus: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetACorporate: id => dispatch(getACorporate(id)),
  onUpdateACorporateStatus: offeredTest => dispatch(updateACorporateStatus(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));