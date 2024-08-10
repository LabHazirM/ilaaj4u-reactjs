import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import moment from 'moment';
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getDiscountLabHazirs,
  updateDiscountLabHazir,
  updateDiscountAllLabHazir,
} from "store/discount-labhazir/actions";
import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class DiscountLabHazirList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      discountLabHazirs: [],
      discountLabHazir: "",
      modal: false,
      confirmModal: false,
      isEditAll: true,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      discountLabHazirListColumns: [
        {
          dataField: "id",
          text: "Test ID",
          sort: true,
          formatter: (cellContent, discountLabHazir) => (
            <>
              <strong>{discountLabHazir.id}</strong>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Test Name",
          sort: true,
          // headerStyle: {
          //   // width: "330px",
          //   textAlign: "left",
          // },
          formatter: (cellContent, discountLabHazir) => (
            <>
                <span>
                <p className="float-start">
                 
                    {discountLabHazir.name}</p>
                </span>
              
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "discount",
          text: "Discount",
          sort: true,
          formatter: (cellContent, discountLabHazir) => (
            <>
              {(
                <span>{(discountLabHazir.discount*100).toFixed()}%</span>
              )}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "start_date",
          text: "Start Date",
          sort: true,
          formatter: (cellContent, discountLabHazir) => (
            <>
              <span>
                {discountLabHazir.discount !== 0 ? (
                  moment(discountLabHazir.start_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
          filter: textFilter({
            placeholder: 'Enter Start Date',
          }),
        },
        {
          dataField: "end_date",
          text: "End Date",
          sort: true,
          formatter: (cellContent, discountLabHazir) => (
            <>
              <span>
                {discountLabHazir.discount !== 0 ? (
                  moment(discountLabHazir.end_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
          filter: textFilter({
            placeholder: 'Enter End Date',
          }),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, discountLabHazir) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBtnClick(discountLabHazir)}
                ></i>
              </Link>
              </Tooltip>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/marketer-test-discount-notes-list/${discountLabHazir.id}`}
                ></Link>
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

  componentDidMount() {
    const { discountLabHazirs, onGetDiscountLabHazirs } = this.props;
    onGetDiscountLabHazirs(this.state.user_id);
    this.setState({ discountLabHazirs });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  toggleConfirmModal = () => {
    this.setState(prevState => ({
      confirmModal: !prevState.confirmModal,
    }));
  };

  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, discountLabHazir: "" });

    this.toggle();
  };

  handleAPICall = () => {
    const {
      onGetDiscountLabHazirs,
      onUpdateDiscountAllLabHazir,
      onUpdateDiscountLabHazir,
    } = this.props;

    if (this.state.isEditAll) {
      onUpdateDiscountAllLabHazir(this.state.discountLabHazir);

      onGetDiscountLabHazirs();

      setTimeout(() => {
        this.setState({ discountLabHazirs: this.props.discountLabHazirs });
      }, 1000);
    } else {
      onUpdateDiscountLabHazir(this.state.discountLabHazir);

      onGetDiscountLabHazirs();

      setTimeout(() => {
        this.setState({ discountLabHazirs: this.props.discountLabHazirs });
      }, 1000);
    }

    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { discountLabHazirs } = this.props;
    if (
      !isEmpty(discountLabHazirs) &&
      size(prevProps.discountLabHazirs) !== size(discountLabHazirs)
    ) {
      this.setState({
        discountLabHazirs: {},
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
    const discountLabHazir = arg;

    this.setState({
      isEditAll: false,
      discountLabHazir: discountLabHazir,
      // id: discountLabHazir.id,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { discountLabHazirs } = this.props;

    const { isEdit, deleteModal } = this.state;

    const discountLabHazir = this.state.discountLabHazir;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: discountLabHazirs.length, // replace later with size(discountLabHazirs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const {
      onGetDiscountLabHazirs,
      onUpdateDiscountAllLabHazir,
      onUpdateDiscountLabHazir,
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Discount Lab Hazir</title>
          </MetaTags>
          <ConfirmModal
          // show={this.state.confirmModal}
          // onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Discount" breadcrumbItem="Lab Hazir Discount For All Tests" />
            <Row>
              <p className="text-danger">Note: The Price of Test is not shown in the following table beacuse discount entered Against any specific Test is for all Labs.</p>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.discountLabHazirListColumns}
                      data={discountLabHazirs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.discountLabHazirListColumns}
                          data={discountLabHazirs}
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
                                      <i className="mdi mdi-pencil" /> Discount
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
                                        "table align-middle table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      filter={filterFactory()}
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
                                        {!this.state.isEditAll
                                          ? "Discount on one test for all Labs"
                                          : "Discount on all tests"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            discount:
                                              (discountLabHazir &&
                                                discountLabHazir.discount) ||
                                              "",
                                            start_date:
                                              (discountLabHazir &&
                                                discountLabHazir.start_date) ||
                                              "",
                                            end_date:
                                              (discountLabHazir &&
                                                discountLabHazir.end_date) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            discount: Yup.number().required(
                                              "Please enter discount from 0 to 0.9"
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
                                          onSubmit={values => {
                                            if (this.state.isEditAll) {
                                              onUpdateDiscountAllLabHazir(
                                                this.state.discountLabHazir
                                              );
                                            } else {
                                              onUpdateDiscountLabHazir(
                                                this.state.discountLabHazir
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetDiscountLabHazirs();

                                              setTimeout(() => {
                                                this.setState({
                                                  discountLabHazirs:
                                                    this.props
                                                      .discountLabHazirs,
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
                                                      Discount LabHazir
                                                    </Label>
                                                    <Field
                                                      name="discount"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.00"
                                                      max="1.00"
                                                      value={
                                                        this.state
                                                          .discountLabHazir
                                                          .discount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          discountLabHazir: {
                                                            id: this.state
                                                              .discountLabHazir
                                                              .id,
                                                            discount:
                                                              e.target.value,
                                                            start_date:
                                                              discountLabHazir.start_date,
                                                            end_date:
                                                              discountLabHazir.end_date,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.discount &&
                                                        touched.discount
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="discount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {this.state.discountLabHazir
                                                    .discount > 0 && (
                                                    <div>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Start Date
                                                        </Label>
                                                        <Field
                                                          name="start_date"
                                                          type="datetime-local"                                                          min={new Date(
                                                            new Date().toString().split("GMT")[0] +
                                                            " UTC"
                                                          )
                                                            .toISOString()
                                                            .slice(0, -8)}
                                                          onChange={e => {
                                                            this.setState({
                                                              discountLabHazir:
                                                                {
                                                                  id: this.state
                                                                    .discountLabHazir
                                                                    .id,
                                                                  // b2b_id:
                                                                  //   this.props.match
                                                                  //     .params.id,
                                                                  discount:
                                                                    discountLabHazir.discount,
                                                                  start_date:
                                                                    e.target
                                                                      .value,
                                                                  end_date:
                                                                    discountLabHazir.end_date,
                                                                },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.start_date &&
                                                            touched.start_date
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
                                                        </Label>
                                                        <Field
                                                          name="end_date"
                                                          type="datetime-local"                                                          min={new Date(
                                                            new Date().toString().split("GMT")[0] +
                                                            " UTC"
                                                          )
                                                            .toISOString()
                                                            .slice(0, -8)}
                                                          value={
                                                            this.state
                                                              .discountLabHazir
                                                              .end_date
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              discountLabHazir:
                                                                {
                                                                  id: this.state
                                                                    .discountLabHazir
                                                                    .id,
                                                                  // b2b_id:
                                                                  //   this.props.match
                                                                  //     .params.id,
                                                                  discount:
                                                                    discountLabHazir.discount,
                                                                  start_date:
                                                                    discountLabHazir.start_date,
                                                                  end_date:
                                                                    e.target
                                                                      .value,
                                                                },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.end_date &&
                                                            touched.end_date
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
                                                    </div>
                                                  )}
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

DiscountLabHazirList.propTypes = {
  match: PropTypes.object,
  discountLabHazirs: PropTypes.array,
  className: PropTypes.any,
  onGetDiscountLabHazirs: PropTypes.func,
  onUpdateDiscountLabHazir: PropTypes.func,
  onUpdateDiscountAllLabHazir: PropTypes.func,
};

const mapStateToProps = ({ discountLabHazirs }) => ({
  discountLabHazirs: discountLabHazirs.discountLabHazirs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDiscountLabHazirs: id => dispatch(getDiscountLabHazirs(id)),
  onUpdateDiscountLabHazir: discountLabHazir =>
    dispatch(updateDiscountLabHazir(discountLabHazir)),
  onUpdateDiscountAllLabHazir: discountLabHazir =>
    dispatch(updateDiscountAllLabHazir(discountLabHazir)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DiscountLabHazirList));
