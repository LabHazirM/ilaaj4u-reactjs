import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  Col,
  Container,
  Button,
  Row,
  Modal,
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

import {
  getSharedPercentagePendingFeeTests,
  updateSharedPercentagePendingFeeTest,
  updateSharedPercentageAllPendingFeeTest,
} from "store/shared-percentage-pending-fee/actions";
import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class SharedPercentageLabHazirList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      sharedPercentagePendingFeeTests: [],
      sharedPercentagePendingFeeTest: "",
      modal: false,
      confirmModal: false,
    //   isEditAll: true,
      // id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      discountLabHazirListColumns: [
        {
            text: "id",
            dataField: "id",
            sort: true,
            hidden: true,
            formatter: (cellContent, sharedPercentagePendingFeeTests) => <>{sharedPercentagePendingFeeTests.id}</>,
          },
          {
            text: "Test ID",
            dataField: "test_id",
            sort: true,
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
              <div className="text-start">
                   {sharedPercentageApprovedFeeTests.test_id}
              </div>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "test_name",
            text: "Test Name",
            sort: true,
            // headerStyle: () => {
            //   return { width: "30%" };
            // } 
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
              <div className="text-start">
                   {sharedPercentageApprovedFeeTests.test_name}
              </div>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "test_categories",
            text: "Test Categories",
            sort: true,
            // headerStyle: () => {
            //   return { width: "30%" };
            // } 
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
              <div className="text-start">
                   {sharedPercentageApprovedFeeTests.test_categories}
              </div>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "price",
            text: "Test Price",
            sort: true,
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
              <div className="text-end">
                   {/* {sharedPercentageApprovedFeeTests.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
              </div>
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "status",
            text: "Status",
            sort: true,
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
              <div className="text-start">
                   {sharedPercentageApprovedFeeTests.status}
              </div>
              </>
            ),filter: textFilter(),
          },
       
          {
            dataField: "shared_percentage",
            text: "Referrel (%)",
            sort: true,
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
                {(               
                                <div className="text-end">
                                {(sharedPercentageApprovedFeeTests.shared_percentage * 100).toFixed()}%</div>
  
                )}
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "shared_percentage",
            text: "Referrel Value",
            sort: true,
            formatter: (cellContent, sharedPercentageApprovedFeeTests) => (
              <>
                {(              <div className="text-end">
  
                  {(sharedPercentageApprovedFeeTests.price * sharedPercentageApprovedFeeTests.shared_percentage).toFixed()}</div>
  
                )}
              </>
            ),filter: textFilter(),
          },

      {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, sharedPercentagePendingFeeTest) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBtnClick(sharedPercentagePendingFeeTest)}
                ></i>
              </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.handleEditBtnClick = this.handleEditBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEditAllBtnClick = this.handleEditAllBtnClick.bind(this);
  }

//   componentDidMount() {
//     const { onGetSharedPercentagePendingFeeTests } = this.props;
//     setTimeout(() => {
//       console.log(onGetSharedPercentagePendingFeeTests());

//       setTimeout(() => {
//         this.setState({ sharedPercentagePendingFeeTests: this.props.sharedPercentagePendingFeeTests });
//       }, 1000);
//     }, 1000);
//   }

  componentDidMount() {
    // const { labs, onGetlabs } = this.props;
    // if (labs && !labs.length) {
    //   onGetlabs();
    // }
    // this.setState({ labs });

    const { sharedPercentagePendingFeeTests, onGetSharedPercentagePendingFeeTests } = this.props;
    // if (sharedPercentagePendingFeeTests && !sharedPercentagePendingFeeTests.length) {
      onGetSharedPercentagePendingFeeTests(this.props.match.params.id);
    
    this.setState({ sharedPercentagePendingFeeTests });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, sharedPercentagePendingFeeTest: "" });

    this.toggle();
  };

  handleAPICall = () => {
    const {
      onGetSharedPercentagePendingFeeTests,
      onUpdateSharedPercentageAllPendingFeeTest,
      onUpdateSharedPercentagePendingFeeTest,
    } = this.props;

    if (this.state.isEditAll) {
      onUpdateSharedPercentageAllPendingFeeTest(this.state.sharedPercentagePendingFeeTest);

      onGetSharedPercentagePendingFeeTests();

      setTimeout(() => {
        this.setState({ sharedPercentagePendingFeeTests: this.props.match.params.id});
      }, 1000);
    } else {
      onUpdateSharedPercentagePendingFeeTest(this.state.sharedPercentagePendingFeeTest);

      onGetSharedPercentagePendingFeeTests();

      setTimeout(() => {
        this.setState({ sharedPercentagePendingFeeTests: this.props.match.params.id });
      }, 1000);
    }

    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { sharedPercentagePendingFeeTests } = this.props;
    if (
      !isEmpty(sharedPercentagePendingFeeTests) &&
      size(prevProps.sharedPercentagePendingFeeTests) !== size(sharedPercentagePendingFeeTests)
    ) {
      this.setState({
        sharedPercentagePendingFeeTests: {},
        isEdit: false,
      });
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
  handleEditBtnClick = arg => {
    const sharedPercentagePendingFeeTest = arg;

    this.setState({
      isEditAll: false,
      sharedPercentagePendingFeeTest: sharedPercentagePendingFeeTest,
      // id: sharedPercentagePendingFeeTest.id,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { sharedPercentagePendingFeeTests } = this.props;

    const { isEdit, deleteModal } = this.state;

    const sharedPercentagePendingFeeTest = this.state.sharedPercentagePendingFeeTest;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: sharedPercentagePendingFeeTests.length, // replace later with size(sharedPercentagePendingFeeTests),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const {
      onGetSharedPercentagePendingFeeTests,
      onUpdateSharedPercentageAllPendingFeeTest,
      onUpdateSharedPercentagePendingFeeTest,
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Discount Lab Hazir</title>
          </MetaTags>
          <ConfirmModal
          show={this.state.confirmModal}
          onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Pending Shared Percentage" breadcrumbItem="Lab Hazir" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.discountLabHazirListColumns}
                      data={sharedPercentagePendingFeeTests}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.discountLabHazirListColumns}
                          data={sharedPercentagePendingFeeTests}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col>
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-18 btn-block btn btn-success"
                                      onClick={this.handleEditAllBtnClick}
                                    >
                                      <i className="mdi mdi-pencil" /> Add Referrel Fee
                                      All
                                    </Button>
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
                                      classes={
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}
                                    />

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!this.state.isEditAll
                                          ? "Shared Percentage on one test"
                                          : "Shared Percentage on all tests"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            shared_percentage:
                                              (sharedPercentagePendingFeeTest &&
                                                sharedPercentagePendingFeeTest.shared_percentage) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            shared_percentage: Yup.number().required(
                                              "Please enter Shared Percentage from 0 to 0.9"
                                            ),
                                    
                                          })}
                                          onSubmit={values => {
                                            if (this.state.isEditAll) {
                                              onUpdateSharedPercentageAllPendingFeeTest(
                                                this.state.sharedPercentagePendingFeeTest
                                              );
                                            } else {
                                              onUpdateSharedPercentagePendingFeeTest(
                                                this.state.sharedPercentagePendingFeeTest
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetSharedPercentagePendingFeeTests(
                                                this.props.match.params.id
                                              );

                                              setTimeout(() => {
                                                this.setState({
                                                  sharedPercentagePendingFeeTests:
                                                    this.props
                                                      .sharedPercentagePendingFeeTests,
                                                });
                                              }, 1000);
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
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
                                                    <Label className="form-label">
                                                    Shared Percentage LabHazir
                                                    </Label>
                                                    <Field
                                                      name="shared_percentage"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.00"
                                                      max="1.00"
                                                      value={
                                                        this.state
                                                          .sharedPercentagePendingFeeTest
                                                          .shared_percentage
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          sharedPercentagePendingFeeTest: {
                                                            id: this.state
                                                              .sharedPercentagePendingFeeTest
                                                              .id,
                                                            shared_percentage:
                                                              e.target.value,
                                                            lab_id:
                                                              this.props.match
                                                                .params.id,
                                                          },
                                                        });
                                                      }}
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
                                                  </div>
                                         
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col>
                                                  <div className="text-end">
                                                    <button
                                                      type="submit"
                                                      className="btn btn-success save-user"
                                                      // onClick={
                                                      //   this.handleAPICall
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
                              <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
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

SharedPercentageLabHazirList.propTypes = {
  match: PropTypes.object,
  sharedPercentagePendingFeeTests: PropTypes.array,
  className: PropTypes.any,
  onGetSharedPercentagePendingFeeTests: PropTypes.func,
  onUpdateSharedPercentagePendingFeeTest: PropTypes.func,
  onUpdateSharedPercentageAllPendingFeeTest: PropTypes.func,
};

const mapStateToProps = ({ sharedPercentagePendingFeeTests }) => ({
  sharedPercentagePendingFeeTests: sharedPercentagePendingFeeTests.sharedPercentagePendingFeeTests,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSharedPercentagePendingFeeTests: id => dispatch(getSharedPercentagePendingFeeTests(id)),
  onUpdateSharedPercentagePendingFeeTest: sharedPercentagePendingFeeTest =>
    dispatch(updateSharedPercentagePendingFeeTest(sharedPercentagePendingFeeTest)),
  onUpdateSharedPercentageAllPendingFeeTest: sharedPercentagePendingFeeTest =>
    dispatch(updateSharedPercentageAllPendingFeeTest(sharedPercentagePendingFeeTest)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SharedPercentageLabHazirList));