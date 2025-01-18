import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

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
  getReferrelFeeLabs,
  updateReferrelFeeLab,
  updateReferrelAllFeeLab,
} from "store/referrel-fee-to-lab/actions";
import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";

import "assets/scss/table.scss";

class ReferrelLabFee extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      referrelFeeLabs: [],
      referrelFeeLab: "",
      modal: false,
      confirmModal: false,
      isEditAll: true,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      referrelFeeLabColumns: [
        {
            text: "id",
            dataField: "id",
            sort: true,
            hidden: true,
            formatter: (cellContent, referrelFeeLabs) => <>{referrelFeeLabs.id}</>,
          },
          {
            dataField: "lab_name",
            text: "Lab Name",
            sort: true,
          },
          {
            dataField: "test_name",
            text: "Test Name",
            sort: true,
            headerStyle: () => {
              return { width: "30%" };
            }  
          },
          // {
          //   dataField: "duration_required",
          //   text: "Turn Around Time",
          //   sort: true,
          // },
          // {
          //   dataField: "duration_type",
          //   text: "Duration type",
          //   sort: true,
          // },
          // {
          //   dataField: "sample_type",
          //   text: "Sample Type",
          //   sort: true,
          // },
          // {
          //   dataField: "price",
          //   text: "Price",
          //   sort: true,
          // },
          // {
          //   dataField: "is_eqa_participation",
          //   text: "EQA participation",
          //   sort: true,
          // },
          // {
          //   dataField: "is_home_sampling_available",
          //   text: "Home sampling",
          //   sort: true,
          // },
          // {
          //   dataField: "is_test_performed",
          //   text: "Test Performed",
          //   sort: true,
          // },
        {
          dataField: "shared_percentage",
          text: "Referrel Fee",
          sort: true,
        },
        // {
        //   dataField: "start_date_by_labhazir",
        //   text: "Start Date",
        //   sort: true,
        //   formatter: (cellContent, test) => (
        //     <>
        //       {!test.start_date_by_labhazir ? (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //           Date not set
        //         </span>
        //       ) : (
        //         <span>{new Date(test.start_date_by_labhazir).toLocaleString("en-US")}</span>
        //       )}
        //     </>
        //   ),
        // },
        // {
        //   dataField: "end_date_by_labhazir",
        //   text: "End Date",
        //   sort: true,
        //   formatter: (cellContent, test) => (
        //     <>
        //       {!test.end_date_by_labhazir ? (
        //         <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-secondary font-size-12 badge-soft-secondary">
        //           Date not set
        //         </span>
        //       ) : (
        //         <span>{new Date(test.end_date_by_labhazir).toLocaleString("en-US")}</span>
        //       )}
        //     </>
        //   ),
        // },
      {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, referrelFeeLab) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBtnClick(referrelFeeLab)}
                ></i>
              </Link>
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
//     const { ongetReferrelFeeLabs } = this.props;
//     setTimeout(() => {
//       console.log(ongetReferrelFeeLabs());

//       setTimeout(() => {
//         this.setState({ referrelFeeLabs: this.props.referrelFeeLabs });
//       }, 1000);
//     }, 1000);
//   }

  componentDidMount() {
    // const { labs, onGetlabs } = this.props;
    // if (labs && !labs.length) {
    //   onGetlabs();
    // }
    // this.setState({ labs });

    const { referrelFeeLabs, ongetReferrelFeeLabs } = this.props;
    // if (referrelFeeLabs && !referrelFeeLabs.length) {
      ongetReferrelFeeLabs(this.props.match.params.id);
    
    this.setState({ referrelFeeLabs });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, referrelFeeLab: ""});

    this.toggle();
  };

  // handleAPICall = () => {
  //   const {
  //     ongetReferrelFeeLabs,
  //     onupdateReferrelAllFeeLab,
  //     onupdateReferrelFeeLab,
  //   } = this.props;

  //   if (this.state.isEditAll) {
  //     onupdateReferrelAllFeeLab(this.state.referrelFeeLab);

  //     // console.log(onAddNewLabShare(this.state.b2bLabShare));

  //     setTimeout(() => {
  //       ongetReferrelFeeLabs(this.props.match.params.id);

  //       setTimeout(() => {
  //         this.setState({ referrelFeeLabs: this.props.referrelFeeLabs });
  //       }, 1000);
  //     }, 1000);
  //   } else {
  //     onupdateReferrelFeeLab(this.state.b2bLabShare);

  //     setTimeout(() => {
  //       ongetReferrelFeeLabs(this.props.match.params.id);

  //       setTimeout(() => {
  //         this.setState({ referrelFeeLabs: this.props.referrelFeeLabs });
  //       }, 1000);
  //     }, 1000);
  //   }
    handleAPICall = () => {
      const {
        ongetReferrelFeeLabs,
        onupdateReferrelAllFeeLab,
        onupdateReferrelFeeLab,
      } = this.props;
  
      if (this.state.isEditAll) {
        onupdateReferrelAllFeeLab(this.state.referrelFeeLab);
  
        ongetReferrelFeeLabs();
  
        setTimeout(() => {
          this.setState({ referrelFeeLabs: this.props.match.params.id });
        }, 1000);
      } else {
        onupdateReferrelFeeLab(this.state.referrelFeeLab);
  
        ongetReferrelFeeLabs();
  
        setTimeout(() => {
          this.setState({ referrelFeeLabs: this.props.match.params.id });
        }, 1000);
      }
  
      this.toggle();
    };
    // if (this.state.isEditAll) {
    //   onupdateReferrelAllFeeLab(this.state.referrelFeeLab);

    //   ongetReferrelFeeLabs();

    //   setTimeout(() => {
    //     this.setState({ referrelFeeLabs: this.props.user_id});
    //   }, 1000);
    // } else {
    //   onupdateReferrelFeeLab(this.state.referrelFeeLab);

    //   ongetReferrelFeeLabs();

    //   setTimeout(() => {
    //     this.setState({ referrelFeeLabs: this.props.user_id });
    //   }, 1000);
    // }

    // this.toggle();
  // };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { referrelFeeLabs } = this.props;
    if (
      !isEmpty(referrelFeeLabs) &&
      size(prevProps.referrelFeeLabs) !== size(referrelFeeLabs)
    ) {
      this.setState({
        referrelFeeLabs: {},
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
    const referrelFeeLab = arg;

    this.setState({
      isEditAll: false,
      referrelFeeLab: referrelFeeLab,
      // id: referrelFeeLab.id,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { referrelFeeLabs } = this.props;

    const { isEdit, deleteModal } = this.state;

    const referrelFeeLab = this.state.referrelFeeLab;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: referrelFeeLabs.length, // replace later with size(referrelFeeLabs),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const {
      ongetReferrelFeeLabs,
      onupdateReferrelAllFeeLab,
      onupdateReferrelFeeLab,
    } = this.props;

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | Referrel Fee Lab Hazir</title>
          </MetaTags>
          <ConfirmModal
          show={this.state.confirmModal}
          onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Referrel Fee" breadcrumbItem="Lab Hazir" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.referrelFeeLabColumns}
                      data={referrelFeeLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.referrelFeeLabColumns}
                          data={referrelFeeLabs}
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
                                      <i className="mdi mdi-pencil" /> Referrel Fee
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
                                        "table align-middle table-condensed  table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
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
                                          ? "Referrel on one test"
                                          : "Referrel on all tests"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            shared_percentage:
                                              (referrelFeeLab &&
                                                referrelFeeLab.shared_percentage) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            shared_percentage: Yup.number().required(
                                              "Please enter Referrel Fee from 0 to 1.0"
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (this.state.isEditAll) {
                                              onupdateReferrelAllFeeLab(
                                                this.state.referrelFeeLab
                                              );
                                            } else {
                                              onupdateReferrelFeeLab(
                                                this.state.referrelFeeLab
                                              );
                                            }

                                            setTimeout(() => {
                                              ongetReferrelFeeLabs(
                                                this.props.match.params.id
                                              );

                                              setTimeout(() => {
                                                this.setState({
                                                  referrelFeeLabs:
                                                    this.props
                                                      .referrelFeeLabs,
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
                                                      Referrel Fee
                                                    </Label>
                                                    <Field
                                                      name="shared_percentage"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.01"
                                                      max="1.00"
                                                      value={
                                                        this.state
                                                          .referrelFeeLab
                                                          .shared_percentage
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          referrelFeeLab: {
                                                            id: this.state
                                                              .referrelFeeLab
                                                              .id,
                                                            lab_id:
                                                                  this.props.match
                                                                      .params.id,
                                                            shared_percentage:
                                                              e.target.value,
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

ReferrelLabFee.propTypes = {
  match: PropTypes.object,
  referrelFeeLabs: PropTypes.array,
  className: PropTypes.any,
  ongetReferrelFeeLabs: PropTypes.func,
  onupdateReferrelFeeLab: PropTypes.func,
  onupdateReferrelAllFeeLab: PropTypes.func,
};

const mapStateToProps = ({ referrelFeeLabs }) => ({
  referrelFeeLabs: referrelFeeLabs.referrelFeeLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  ongetReferrelFeeLabs: () => dispatch(getReferrelFeeLabs()),
  onupdateReferrelFeeLab: referrelFeeLab =>
    dispatch(updateReferrelFeeLab(referrelFeeLab)),
  onupdateReferrelAllFeeLab: referrelFeeLab =>
    dispatch(updateReferrelAllFeeLab(referrelFeeLab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ReferrelLabFee));
