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
  getRFeeCorporate,
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
      cemployeeDatas: [],
      tests: [],
      labProfiles: [],
      // units: [],
      offeredTest: "",
      type: "",
      selectedcorporate: null,
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
          dataField: "corporate_name",
          text: "Corporate Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              {/* <span className="float-start">
                {offeredTest.corporate_name}
              </span> */}
              <Link
                to="#"
                onMouseEnter={e => this.openPatientModal(e, offeredTest)}
                onPointerLeave={this.handleMouseExit()}
              >
                <span className="float-start">{offeredTest.corporate_name}</span>
              </Link>
            </>
          ),
        },
        {
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span className="float-start">
                {offeredTest.lab_name}
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

              <span>{(offeredTest.shared_percentage * 100).toFixed(0)}%</span>

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

  componentDidMount() {
    const { cemployeeDatas, onGetRFeeCorporate } = this.props;
    console.log(onGetRFeeCorporate(this.state.user_id));
    this.setState({ cemployeeDatas });
  }


  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
    });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      phone: arg.phone,
      city: arg.city,
      address: arg.address,

    });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ offeredTest: selectedGroup.value });
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
        shared_percentage: arg.shared_percentage,
      },
      isEdit: true,
    });

    this.toggle();
  };
  handleSaveButtonClick = () => {
    // Your other logic...

    const { offeredTest } = this.state;

    const updateCorporateStatus = {
      id: offeredTest.id,
      shared_percentage: this.state.shared_percentage,
      status: 'Accept'

    };

    // Dispatch the action
    this.props.onUpdateCorporateStatus(updateCorporateStatus);

    // Optionally, you can handle the asynchronous behavior here
    // For example, use a promise or callback function
    setTimeout(() => {
      this.props.onGetRFeeCorporate(
        this.state.user_id
      );
    }, 1000);

    // Close the modal or perform other actions as needed
    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { cemployeeDatas } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCorporateStatus, onGetRFeeCorporate, } =
      this.props;
    const uniqueCorporateNames = [...new Set(cemployeeDatas.map(data => data.corporate_name
    ))];

    // Generate labOptions for the <select> dropdown
    const corporateOptions = uniqueCorporateNames.map((corporateName, index) => (
      <option key={index} value={corporateName}>
        {corporateName}
      </option>
    ));

    const filteredStatements = cemployeeDatas.filter((statement) => {
      const { selectedcorporate } = this.state;
      const labFilter =
        !selectedcorporate || statement.corporate_name
        === selectedcorporate;
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
                    <Col lg="3">
                      <div className="mb-3">
                        <label className="form-label">Corporate List</label>
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
                                          ? "Edit Offered Test"
                                          : "Add Offered Test"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            shared_percentage:
                                              (this.state.offeredTest &&
                                                this.state.offeredTest
                                                  .shared_percentage) ||
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
                                              shared_percentage:
                                                values.shared_percentage,
                                              status: 'Accept'
                                            };

                                            // update PaymentStatus
                                            onUpdateCorporateStatus(
                                              updateCorporateStatus
                                            );
                                            setTimeout(() => {
                                              onGetRFeeCorporate(
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
                                                    Referral Fee
                                                    <span
                                                      style={{ color: "#f46a6a" }}
                                                      className="font-size-18"
                                                    >
                                                      *
                                                    </span>
                                                  </Label>
                                                  <Field
                                                    name="shared_percentage"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.00"
                                                    max="1.00"
                                                    value={this.state.shared_percentage}
                                                    onChange={e => this.setState({ shared_percentage: e.target.value })}
                                                    className={
                                                      "form-control" +
                                                      (errors.shared_percentage &&
                                                        touched.shared_percentage
                                                        ? " is-invalid"
                                                        : "")
                                                    }
                                                  />
                                                  <ErrorMessage
                                                    name="shared_percentage"
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
  onGetRFeeCorporate: PropTypes.func,
  onUpdateCorporateStatus: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetRFeeCorporate: id => dispatch(getRFeeCorporate(id)),
  onUpdateCorporateStatus: offeredTest => dispatch(updateCorporateStatus(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));