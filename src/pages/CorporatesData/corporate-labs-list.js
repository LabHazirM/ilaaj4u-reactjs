import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';

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
  getLabsCorporate,
  updateCemployee,
} from "store/corporatedata/actions";


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
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      offeredTestListColumns: [
        {
          text: "Id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, offeredTest) => <>{offeredTest.id}</>,
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
          ), filter: textFilter(),
        },
        {
          dataField: "lab_type",
          text: "Lab Type",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.lab_type}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "lab_phone",
          text: "Phone",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span>
                {offeredTest.lab_phone}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "lab_email",
          text: "Email",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span className="float-start">
                {offeredTest.lab_email}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "lab_city",
          text: "City",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span className="font-size-14 text-truncate">
                {offeredTest.lab_city}
              </span>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "lab_address",
          text: "Address",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
             <Tooltip title={offeredTest.lab_address}>
              <span className="font-size-14 " style={{ whiteSpace: 'nowrap', textAlign: 'left', width: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {offeredTest.lab_address}
              </span></Tooltip>
            </>
          ), filter: textFilter(),
        },
        {
          dataField: "Status",
          text: "Status",
          sort: true,
          formatter: (cellContent, offeredTest) => (
            <>
              <span style={{ color: offeredTest.Status == "Renew" ? 'red' : 'inherit'}}>
                {offeredTest.Status}
              </span>
            </>
          ), filter: textFilter(),
        },
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, offeredTest) => (
        //     <div className="d-flex gap-3" style={{ textAlign: "center", justifyContent: "center" }}>
        //       <Tooltip title="Update">
        //         <Link className="text-success" to="#">
        //           <i
        //             className="mdi mdi-pencil font-size-18"
        //             id="edittooltip"
        //             onClick={e => this.handleOfferedTestClick(e, offeredTest)}
        //           ></i>
        //         </Link>
        //       </Tooltip>
        //     </div>
        //   ),
        // },
      ],
    };
    this.handleOfferedTestClick = this.handleOfferedTestClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleOfferedTestClicks = this.handleOfferedTestClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {

    const { cemployeeDatas, onGetLabsCorporate, } = this.props;
    onGetLabsCorporate(this.state.user_id);
    this.setState({ cemployeeDatas });
    console.log("state", cemployeeDatas)

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
        name: arg.name,
        employee_code: arg.employee_code,
      },
      isEdit: true,
    });

    this.toggle();
  };
  // handleSaveButtonClick = () => {
  //   // Your other logic...
  
  //   const { offeredTest } = this.state;
  
  //   const updateCemployee = {
  //     id: offeredTest.id,
  //     name: this.state.name,
  //     employee_code: this.state.employee_code,
  //   };
  
  //   // Dispatch the action
  //   this.props.onUpdateCemployee(updateCemployee);
  
  //   // Optionally, you can handle the asynchronous behavior here
  //   // For example, use a promise or callback function
  //   setTimeout(() => {
  //     this.props.onGetLabsCorporate(
  //       this.state.user_id
  //     );
  //   }, 1000);
  
  //   // Close the modal or perform other actions as needed
  //   this.toggle();
  // };

  render() {
    const { SearchBar } = Search;

    const { cemployeeDatas } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateCemployee, onGetLabsCorporate, } =
      this.props;
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
            <title>Labs List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Corporate Offered Tests" breadcrumbItem="Labs List" />
            <Row>
              <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: The labs listed here has accepted the corporate pricing for all required tests.
                                    </strong>
                                  </span>
                                  </div>
              <Col lg="12">
                <Card>
                  <CardBody>
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
                              {/* <Row className="mb-2">
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

                              </Row> */}

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
                                      filter={ filterFactory() }

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
                                          }}
                                          validationSchema={Yup.object().shape({
                                            employee_code: Yup.number(
                                              "Please enter number only"
                                            )
                                              .required(
                                                "Please enter your employee_code"
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

                                            const updateCemployee =
                                            {
                                              id: offeredTest.id,
                                              name: values.name,
                                              employee_code:
                                                values.employee_code,
                                            };

                                            // update PaymentStatus
                                            onUpdateCemployee(
                                              updateCemployee
                                            );
                                            setTimeout(() => {
                                              onGetLabsCorporate(
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
                                                   <Label
                                                     className="col-form-label"
                                                   >
                                                     Employee Name
                                                     <span
                                                       style={{ color: "#f46a6a" }}
                                                       className="font-size-18"
                                                     >
                                                       *
                                                     </span>
                                                   </Label>
                                                     <Input
                                                      type="text"
                                                      value={this.state.offeredTest.name}
                                                      onChange={e => {this.setState({
                                                               offeredTest: {
                                                                 id: offeredTest.id,
                                                                 employee_code:
                                                                   offeredTest.employee_code,
                                                                 name:
                                                                   e.target.value,
                                                               },
                                                             });
                                                           }}
                                                           className={
                                                             "form-control" +
                                                             (errors.name &&
                                                             touched.name
                                                               ? " is-invalid"
                                                               : "")
                                                           } 
                                                     />
                                                 </div>

                                                 <div className="mb-3">
                                                   <Label
                                                     className="col-form-label"
                                                   >
                                                     Employee Code
                                                     <span
                                                       style={{ color: "#f46a6a" }}
                                                       className="font-size-18"
                                                     >
                                                       *
                                                     </span>
                                                   </Label>
                                                    <Input
                                                      id="employee_code"
                                                      name="employee_code"
                                                      type="text"
                                                      value={this.state.offeredTest.employee_code}  
                                                      onChange={e => {
                                                             this.setState({
                                                               offeredTest: {
                                                                 id: offeredTest.id,
                                                                 name:
                                                                   offeredTest.name,
                                                                 employee_code:
                                                                   e.target.value,
                                                               },
                                                             });
                                                           }}
                                                      className={
                                                        "form-control" +
                                                        (errors.employee_code &&
                                                        touched.employee_code
                                                          ? " is-invalid"
                                                          : "")
                                                      } 
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
  cemployeeDatas: PropTypes.array,
  className: PropTypes.any,
  onGetLabsCorporate: PropTypes.func,
  onUpdateCemployee: PropTypes.func,
};

const mapStateToProps = ({ cemployeeData }) => ({
  cemployeeDatas: cemployeeData.cemployeeDatas,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsCorporate: id => dispatch(getLabsCorporate(id)),
  onUpdateCemployee: offeredTest => dispatch(updateCemployee(offeredTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(OfferedTestsList));
