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
  getDiscountLab,
  updateDiscountLab,
  updateDiscountAllLab,
} from "store/discount-lab/actions";
import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class DiscountLabHazirList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      discountLabs: [],
      discountLab: "",
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
          formatter: (cellContent, discountLab) => (
            <>
              <strong>{discountLab.id}</strong>
            </>
          ),
        },
        {
          dataField: "test_name",
          text: "Test Name",
          sort: true,
          //   headerStyle: () => {
          //     return { 
          //     style: {width: "30%",
          //       textAlign: "left"
          //   },
          // }

          // } 

        },
        {
          dataField: "price",
          text: "Price",
          sort: true,
          formatter: (cellContent, discountLab) => (
            <>
              {(
                <span>{discountLab.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
        },
        {
          dataField: "discount",
          text: "Discount",
          sort: true,
          formatter: (cellContent, discountLab) => (
            <>
              {(
                <span>{(discountLab.discount * 100).toFixed()}%</span>
              )}
            </>
          ),
        },
        {
          dataField: "discounted_price",
          text: "Price After Discount",
          sort: true,
          formatter: (cellContent, discountLab) => (
            <>
              {(
                <span>{(discountLab.price - ((discountLab.price * (discountLab.discount * 100)) / 100)).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
        },

        {
          dataField: "start_date",
          text: "Start Date",
          sort: true,
          formatter: (cellContent, discountLab) => (
            <>
              <span>
                {discountLab.discount !== 0 ? (
                  moment(discountLab.start_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "end_date",
          text: "End Date",
          sort: true,
          formatter: (cellContent, discountLab) => (
            <>
              <span>
                {discountLab.discount !== 0 ? (
                  moment(discountLab.end_date).format("DD MMM YYYY, h:mm A")
                ) : (
                  "--"
                )}
              </span>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, discountLab) => (

            <div className="d-flex gap-3">
              <Tooltip title="Update">
                <Link className="text-success" to="#">
                  <i
                    className="mdi mdi-pencil font-size-18"
                    id="edittooltip"
                    onClick={() => this.handleEditBtnClick(discountLab)}
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

  componentDidMount() {
    const { onGetDiscountLab } = this.props;
    setTimeout(() => {
      console.log(onGetDiscountLab(this.state.user_id));

      setTimeout(() => {
        this.setState({ discountLabs: this.props.discountLabs });
      }, 1000);
    }, 1000);
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

  handleEditAllBtnClicks = () => {
    this.setState({ discountLab: "", isEdit: false, lab_id: "" });
    this.toggle();
  };
  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, discountLab: "" });

    this.toggle();
  };


  // handleEditAllBtnClicks = () => {
  //   this.setState({ b2bLabShare: "", isEdit: false, lab_id: "" });
  //   this.toggle();
  // };
  // handleEditAllBtnClick = () => {
  //   this.setState({ isEditAll: true, b2bLabShare: "" });

  //   this.toggle();
  // };

  handleAPICall = () => {
    const {
      onGetDiscountLab,
      onUpdateDiscountAllLab,
      onUpdateDiscountLab,
    } = this.props;

    if (this.state.isEditAll) {
      onUpdateDiscountAllLab(this.state.discountLab);

      onGetDiscountLab(this.state.user_id);

      setTimeout(() => {
        this.setState({ discountLabs: this.props.discountLabs });
      }, 1000);
    } else {
      onUpdateDiscountLab(this.state.discountLab);

      onGetDiscountLab(this.state.user_id);

      setTimeout(() => {
        this.setState({ discountLabs: this.props.discountLabs });
      }, 1000);
    }

    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { discountLabs } = this.props;
    if (
      !isEmpty(discountLabs) &&
      size(prevProps.discountLabs) !== size(discountLabs)
    ) {
      this.setState({
        discountLabs: {},
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
    const discountLab = arg;

    this.setState({
      isEditAll: false,
      discountLab: discountLab,
      // id: discountLab.id,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { discountLabs } = this.props;

    const { isEdit, deleteModal } = this.state;

    const discountLab = this.state.discountLab;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: discountLabs.length, // replace later with size(discountLabs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const {
      onGetDiscountLab,
      onUpdateDiscountAllLab,
      onUpdateDiscountLab,
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
            <Breadcrumbs title="Discount" breadcrumbItem="Lab" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.discountLabHazirListColumns}
                      data={discountLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.discountLabHazirListColumns}
                          data={discountLabs}
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
                                        "table align-middle table-condensed table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Row className="align-items-md-center mt-30">
                                      <Col className="pagination pagination-rounded justify-content-end mb-2">
                                        <PaginationListStandalone
                                          {...paginationProps}
                                        />
                                      </Col>
                                    </Row>

                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!this.state.isEditAll
                                          ? "Discount on one test"
                                          : "Discount on all tests"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            discount:
                                              (discountLab &&
                                                discountLab.discount) ||
                                              "",
                                            start_date:
                                              (discountLab &&
                                                discountLab.start_date) ||
                                              "",
                                            end_date:
                                              (discountLab &&
                                                discountLab.end_date) ||
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
                                              onUpdateDiscountAllLab(
                                                this.state.discountLab
                                              );
                                            } else {
                                              onUpdateDiscountLab(
                                                this.state.discountLab
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetDiscountLab(this.state.user_id);

                                              setTimeout(() => {
                                                this.setState({
                                                  discountLabs:
                                                    this.props
                                                      .discountLabs,
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
                                                          .discountLab
                                                          .discount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          discountLab: {
                                                            id: this.state
                                                              .discountLab
                                                              .id,
                                                            discount:
                                                              e.target.value,
                                                            start_date:
                                                              discountLab.start_date,
                                                            end_date:
                                                              discountLab.end_date,
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

                                                  {this.state.discountLab
                                                    .discount > 0 && (
                                                      <div>
                                                        <div className="mb-3">
                                                          <Label className="form-label">
                                                            Start Date
                                                          </Label>
                                                          <Field
                                                            name="start_date"
                                                            type="datetime-local" min={new Date(
                                                              new Date().toString().split("GMT")[0] +
                                                              " UTC"
                                                            )
                                                              .toISOString()
                                                              .slice(0, -8)}
                                                            value={
                                                              this.state
                                                                .discountLab
                                                                .start_date
                                                            }
                                                            onChange={e => {
                                                              this.setState({
                                                                discountLab:
                                                                {
                                                                  id: this.state
                                                                    .discountLab
                                                                    .id,
                                                                  lab_id:
                                                                    this.state.user_id,
                                                                  discount:
                                                                    discountLab.discount,
                                                                  start_date:
                                                                    e.target
                                                                      .value,
                                                                  end_date:
                                                                    discountLab.end_date,
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
                                                            type="datetime-local"
                                                            min={new Date(
                                                              new Date().toString().split("GMT")[0] +
                                                              " UTC"
                                                            )
                                                              .toISOString()
                                                              .slice(0, -8)}
                                                            value={
                                                              this.state
                                                                .discountLab
                                                                .end_date
                                                            }
                                                            onChange={e => {
                                                              this.setState({
                                                                discountLab:
                                                                {
                                                                  id: this.state
                                                                    .discountLab
                                                                    .id,
                                                                  lab_id:
                                                                    this.state.user_id,
                                                                  discount:
                                                                    discountLab.discount,
                                                                  start_date:
                                                                    discountLab.start_date,
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

DiscountLabHazirList.propTypes = {
  match: PropTypes.object,
  discountLabs: PropTypes.array,
  className: PropTypes.any,
  onGetDiscountLab: PropTypes.func,
  onUpdateDiscountLab: PropTypes.func,
  onUpdateDiscountAllLab: PropTypes.func,
};

const mapStateToProps = ({ discountLabs }) => ({
  discountLabs: discountLabs.discountLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDiscountLab: id => dispatch(getDiscountLab(id)),
  onUpdateDiscountLab: discountLab =>
    dispatch(updateDiscountLab(discountLab)),
  onUpdateDiscountAllLab: discountLab =>
    dispatch(updateDiscountAllLab(discountLab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DiscountLabHazirList));