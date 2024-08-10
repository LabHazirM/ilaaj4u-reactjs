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
  getDiscountLabHazirToLabs,
  updateDiscountLabHazirToLab,
  updateDiscountAllLabHazirToLab,
} from "store/discount-labhazir-to-lab/actions";
import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class DiscountLabHazirList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      discountLabHazirToLabs: [],
      discountLabHazirToLab: "",
      modal: false,
      confirmModal: false,
    //   isEditAll: true,
      // id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      discountLabHazirListColumns: [

        {
          dataField: "id",
          text: "Test ID",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              <strong>{discountLabHazirToLab.id}</strong>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "test_name",
          text: "Test Name",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              <span className="float-start"> {discountLabHazirToLab.test_name}</span>
            </>),
          filter: textFilter(),
        },
        // {
        //   dataField: "lab_name",
        //   text: "Lab Name",
        //   sort: true,
        //   // formatter: (cellContent, discountLabHazirToLab) => (
        //   //   <>
        //   //   <p className="text-start" style={{whiteSpace:"pre-wrap", width: "200px"}}>
        //   //     <span>{discountLabHazirToLab.lab_name}</span>
        //   //     </p>
        //   //   </>
        //   // ),
        //   filter: textFilter(),
        // },
        {
          dataField: "price",
          text: "Test Price",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              {(
                 <span className="float-end"> {discountLabHazirToLab.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "discount",
          text: "Lab Discount",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              {(
                <span>{(discountLabHazirToLab.discount*100).toFixed()}%</span>
              )}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "discount_by_labhazir",
          text: "LabHazir Discount",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              {(
                <span>{(discountLabHazirToLab.discount_by_labhazir*100).toFixed()}%</span>
              )}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "discounted_price",
          text: "Price After Discount",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              {(
                 <span className="float-end"> {(discountLabHazirToLab.price-((discountLabHazirToLab.price*(discountLabHazirToLab.discount_by_labhazir + discountLabHazirToLab.discount)*100)/100)).toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                // (discountLab.price-((discountLab.price*(discountLab.discount*100))/100))
              )}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "start_date_by_labhazir",
          text: "Start Date",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              <span>
                {discountLabHazirToLab.discount_by_labhazir !== 0 ? (
                  moment(discountLabHazirToLab.start_date_by_labhazir).format("DD MMM YYYY, h:mm A")
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
          dataField: "end_date_by_labhazir",
          text: "End Date",
          sort: true,
          formatter: (cellContent, discountLabHazirToLab) => (
            <>
              <span>
                {discountLabHazirToLab.discount_by_labhazir !== 0 ? (
                  moment(discountLabHazirToLab.end_date_by_labhazir).format("DD MMM YYYY, h:mm A")
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
          formatter: (cellContent, discountLabHazirToLab) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBtnClick(discountLabHazirToLab)}
                ></i>
              </Link>
              </Tooltip>
              <Tooltip title="Add Comment">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/marketer-test-labdiscount-notes-list/${discountLabHazirToLab.id}`}
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

//   componentDidMount() {
//     const { onGetDiscountLabHazirToLabs } = this.props;
//     setTimeout(() => {
//       console.log(onGetDiscountLabHazirToLabs());

//       setTimeout(() => {
//         this.setState({ discountLabHazirToLabs: this.props.discountLabHazirToLabs });
//       }, 1000);
//     }, 1000);
//   }

  componentDidMount() {
    // const { labs, onGetlabs } = this.props;
    // if (labs && !labs.length) {
    //   onGetlabs();
    // }
    // this.setState({ labs });

    const { discountLabHazirToLabs, onGetDiscountLabHazirToLabs } = this.props;
    // if (discountLabHazirToLabs && !discountLabHazirToLabs.length) {
      onGetDiscountLabHazirToLabs(this.props.match.params.id);
    
    this.setState({ discountLabHazirToLabs });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, discountLabHazirToLab: "" });

    this.toggle();
  };

  handleAPICall = () => {
    const {
      onGetDiscountLabHazirToLabs,
      onUpdateDiscountAllLabHazirToLab,
      onUpdateDiscountLabHazirToLab,
    } = this.props;

    if (this.state.isEditAll) {
      onUpdateDiscountAllLabHazirToLab(this.state.discountLabHazirToLab);

      onGetDiscountLabHazirToLabs();

      setTimeout(() => {
        this.setState({ discountLabHazirToLabs: this.props.match.params.id});
      }, 1000);
    } else {
      onUpdateDiscountLabHazirToLab(this.state.discountLabHazirToLab);

      onGetDiscountLabHazirToLabs();

      setTimeout(() => {
        this.setState({ discountLabHazirToLabs: this.props.match.params.id });
      }, 1000);
    }

    this.toggle();
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { discountLabHazirToLabs } = this.props;
    if (
      !isEmpty(discountLabHazirToLabs) &&
      size(prevProps.discountLabHazirToLabs) !== size(discountLabHazirToLabs)
    ) {
      this.setState({
        discountLabHazirToLabs: {},
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
    const discountLabHazirToLab = arg;

    this.setState({
      isEditAll: false,
      discountLabHazirToLab: discountLabHazirToLab,
      lab_name: discountLabHazirToLab.lab_name,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { discountLabHazirToLabs } = this.props;

    const { isEdit, deleteModal } = this.state;

    const discountLabHazirToLab = this.state.discountLabHazirToLab;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: discountLabHazirToLabs.length, // replace later with size(discountLabHazirToLabs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const {
      onGetDiscountLabHazirToLabs,
      onUpdateDiscountAllLabHazirToLab,
      onUpdateDiscountLabHazirToLab,
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Discount For Lab By Labhazir | Discount Lab Hazir</title>
          </MetaTags>
          <ConfirmModal
          show={this.state.confirmModal}
          onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Discount"
            breadcrumbItem={discountLabHazirToLabs.map((lab, index) => {
                // Check if lab_name is defined and not null
                if (lab.lab_name_new !== undefined && lab.lab_name_new !== null) {
                  // Return a div for each lab_name
                  return (
                    <div key={index} className="float-end">
                       <span>Lab Hazir Discount for Lab: </span>{" "}
                      <span className="text-danger">{lab.lab_name_new}</span>
                    </div>
                  );
                }
                // Don't render anything for labs without lab_name
                return null;
              })}
             />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.discountLabHazirListColumns || this.state.LabHazirListColumns}
                      data={discountLabHazirToLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.discountLabHazirListColumns || this.state.LabHazirListColumns}
                          data={discountLabHazirToLabs}
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
                                          ? "Discount on Test"
                                          : "Discount on all tests"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            discount_by_labhazir:
                                              (discountLabHazirToLab &&
                                                discountLabHazirToLab.discount_by_labhazir) ||
                                              "",
                                            start_date_by_labhazir:
                                              (discountLabHazirToLab &&
                                                discountLabHazirToLab.start_date_by_labhazir) ||
                                              "",
                                            end_date_by_labhazir:
                                              (discountLabHazirToLab &&
                                                discountLabHazirToLab.end_date_by_labhazir) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            discount_by_labhazir: Yup.number().required(
                                              "Please enter discount from 0 to 0.9"
                                            ),
                                            start_date_by_labhazir: Yup.string(
                                              Yup.number()
                                            ).when("discount_by_labhazir", {
                                              is: discount_by_labhazir => discount_by_labhazir > 0,
                                              then: Yup.string().required(
                                                "Please select start date"
                                              ),
                                            }),
                                            end_date_by_labhazir: Yup.string(
                                              Yup.number()
                                            ).when("discount", {
                                              is: discount_by_labhazir => discount_by_labhazir > 0,
                                              then: Yup.string().required(
                                                "Please select end date"
                                              ),
                                            }),
                                          })}
                                          onSubmit={values => {
                                            if (this.state.isEditAll) {
                                              onUpdateDiscountAllLabHazirToLab(
                                                this.state.discountLabHazirToLab
                                              );
                                            } else {
                                              onUpdateDiscountLabHazirToLab(
                                                this.state.discountLabHazirToLab
                                              );
                                            }

                                            setTimeout(() => {
                                              onGetDiscountLabHazirToLabs(
                                                this.props.match.params.id
                                              );

                                              setTimeout(() => {
                                                this.setState({
                                                  discountLabHazirToLabs:
                                                    this.props
                                                      .discountLabHazirToLabs,
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
                                                      name="discount_by_labhazir"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.00"
                                                      max="1.00"
                                                      value={
                                                        this.state
                                                          .discountLabHazirToLab
                                                          .discount_by_labhazir
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          discountLabHazirToLab: {
                                                            id: this.state
                                                              .discountLabHazirToLab
                                                              .id,
                                                            discount_by_labhazir:
                                                              e.target.value,
                                                            start_date_by_labhazir:
                                                              discountLabHazirToLab.start_date_by_labhazir,
                                                            end_date_by_labhazir:
                                                              discountLabHazirToLab.end_date_by_labhazir,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.discount_by_labhazir &&
                                                        touched.discount_by_labhazir
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="discount_by_labhazir"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {this.state.discountLabHazirToLab
                                                    .discount_by_labhazir > 0 && (
                                                    <div>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          Start Date
                                                        </Label>
                                                        <Field
                                                          name="start_date_by_labhazir"
                                                          type="datetime-local"                                                          min={new Date(
                                                            new Date().toString().split("GMT")[0] +
                                                            " UTC"
                                                          )
                                                            .toISOString()
                                                            .slice(0, -8)}

                                                          value={
                                                            this.state
                                                              .discountLabHazirToLab
                                                              .start_date_by_labhazir
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              discountLabHazirToLab:
                                                                {
                                                                  id: this.state
                                                                    .discountLabHazirToLab
                                                                    .id,
                                                                  lab_id:
                                                                    this.props.match
                                                                      .params.id,
                                                                  discount_by_labhazir:
                                                                    discountLabHazirToLab.discount_by_labhazir,
                                                                  start_date_by_labhazir:
                                                                    e.target
                                                                      .value,
                                                                  end_date_by_labhazir:
                                                                    discountLabHazirToLab.end_date_by_labhazir,
                                                                },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.start_date_by_labhazir &&
                                                            touched.start_date_by_labhazir
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="start_date_by_labhazir"
                                                          component="div"
                                                          className="invalid-feedback"
                                                        />
                                                      </div>
                                                      <div className="mb-3">
                                                        <Label className="form-label">
                                                          End Date
                                                        </Label>
                                                        <Field
                                                          name="end_date_by_labhazir"
                                                          type="datetime-local"                                                          min={new Date(
                                                            new Date().toString().split("GMT")[0] +
                                                            " UTC"
                                                          )
                                                            .toISOString()
                                                            .slice(0, -8)}

                                                          value={
                                                            this.state
                                                              .discountLabHazirToLab
                                                              .end_date_by_labhazir
                                                          }
                                                          onChange={e => {
                                                            this.setState({
                                                              discountLabHazirToLab:
                                                                {
                                                                  id: this.state
                                                                    .discountLabHazirToLab
                                                                    .id,
                                                                  lab_id:
                                                                    this.props.match
                                                                      .params.id,
                                                                  discount_by_labhazir:
                                                                    discountLabHazirToLab.discount_by_labhazir,
                                                                  start_date_by_labhazir:
                                                                    discountLabHazirToLab.start_date_by_labhazir,
                                                                  end_date_by_labhazir:
                                                                    e.target
                                                                      .value,
                                                                },
                                                            });
                                                          }}
                                                          className={
                                                            "form-control" +
                                                            (errors.end_date_by_labhazir &&
                                                            touched.end_date_by_labhazir
                                                              ? " is-invalid"
                                                              : "")
                                                          }
                                                        />
                                                        <ErrorMessage
                                                          name="end_date_by_labhazir"
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
  discountLabHazirToLabs: PropTypes.array,
  className: PropTypes.any,
  onGetDiscountLabHazirToLabs: PropTypes.func,
  onUpdateDiscountLabHazirToLab: PropTypes.func,
  onUpdateDiscountAllLabHazirToLab: PropTypes.func,
};

const mapStateToProps = ({ discountLabHazirToLabs }) => ({
  discountLabHazirToLabs: discountLabHazirToLabs.discountLabHazirToLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDiscountLabHazirToLabs: id => dispatch(getDiscountLabHazirToLabs(id)),
  onUpdateDiscountLabHazirToLab: discountLabHazirToLab =>
    dispatch(updateDiscountLabHazirToLab(discountLabHazirToLab)),
  onUpdateDiscountAllLabHazirToLab: discountLabHazirToLab =>
    dispatch(updateDiscountAllLabHazirToLab(discountLabHazirToLab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DiscountLabHazirList));
