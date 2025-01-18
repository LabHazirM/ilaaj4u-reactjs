import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
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

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import {
  getLabs,
  addNewLabShare,
  getB2bLabSharesList,
  updateLabShare,
  updateAllLabShare,
} from "store/b2b-lab-shares/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class B2bLabSharesList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2bLabSharesList: [],
      b2bLabShare: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      isEditAll: true,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      b2bLabShareListColumns: [
        {
          dataField: "id",
          text: "Lab ID",
          sort: true,
          formatter: (cellContent, b2bLabShare) => (
            <>
              <strong>{b2bLabShare.id}</strong>
            </>
          ),
        },
        {
          dataField: "name",
          text: "Lab Name",
          sort: true,
          
        },
        {
          dataField: "city",
          text: "Lab City",
          sort: true,
        },
        {
          dataField: "b2b_shares",
          text: "B2B Shares",
          sort: true,
          formatter: (cellContent, b2bLabShare) => (
            <>
              <strong>{(b2bLabShare.b2b_shares* 100).toFixed()}%</strong>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, b2bLabShare) => (
            <Col>
            <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={() => this.handleEditBtnClick(b2bLabShare)}
                ></i>
              </Link>
              </Tooltip>
            </Col>
          ),
        },
      ],
    };
    this.handleEditBtnClick = this.handleEditBtnClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleEditAllBtnClick = this.handleEditAllBtnClick.bind(this);
    this.handleb2bLabShareClicks = this.handleb2bLabShareClicks.bind(this);


  }

  componentDidMount() {
    const { labs, onGetlabs } = this.props;
    if (labs && !labs.length) {
      onGetlabs();
    }
    this.setState({ labs });

    const { b2bLabSharesList, onGetb2bLabSharesList } = this.props;
    if (b2bLabSharesList && !b2bLabSharesList.length) {
      onGetb2bLabSharesList(this.props.match.params.id);
    }
    this.setState({ b2bLabSharesList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleEditAllBtnClicks = () => {
    this.setState({ b2bLabShare: "", isEdit: false, lab_id: "" });
    this.toggle();
  };
  handleEditAllBtnClick = () => {
    this.setState({ isEditAll: true, b2bLabShare: "" });

    this.toggle();
  };
  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ b2bLabShare: selectedGroup.value });
  };

  handleAPICall = () => {
    const { onGetb2bLabSharesList, onUpdateAllLabShare, onUpdateLabShare } =
      this.props;

    if (this.state.isEditAll) {
      onUpdateAllLabShare(this.state.b2bLabShare);

      // console.log(onAddNewLabShare(this.state.b2bLabShare));

      setTimeout(() => {
        onGetb2bLabSharesList(this.props.match.params.id);

        setTimeout(() => {
          this.setState({ b2bLabSharesList: this.props.b2bLabSharesList });
        }, 1000);
      }, 1000);
    } else {
      onUpdateLabShare(this.state.b2bLabShare);

      setTimeout(() => {
        onGetb2bLabSharesList(this.props.match.params.id);

        setTimeout(() => {
          this.setState({ b2bLabSharesList: this.props.b2bLabSharesList });
        }, 1000);
      }, 1000);
    }
  };

  handleb2bLabShareClicks = () => {
    this.setState({ b2bLabShare: "", isEdit: false, lab_id: "" });
    this.setState({ addmodal: true });  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { b2bLabSharesList } = this.props;
    if (
      !isEmpty(b2bLabSharesList) &&
      size(prevProps.b2bLabSharesList) !== size(b2bLabSharesList)
    ) {
      this.setState({ b2bLabSharesList: {}, isEdit: false });
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


  handleEditBtnClick = arg => {
    const b2bLabShare = arg;

    this.setState({
      isEditAll: false,
      b2bLabShare: b2bLabShare,
      // id: discountLab.id,
    });

    this.toggle();
  };

  // /* Insert,Update Delete data */
  // handleEditBtnClick = arg => {
  //   const b2bLabShare = arg;

  //   this.setState({
  //     b2bLabShare: {
  //       id: b2bLabShare.id,
  //       lab_name: b2bLabShare.lab_name,
  //       // unit_name: offeredTest.unit_name,
  //       lab_id: b2bLabShare.lab_id,
  //       b2b_shares: b2bLabShare.b2b_shares,
  //     },
  //     isEdit: true,
  //   });

  //   this.toggle();
  // };


  render() {
    const { SearchBar } = Search;

    const { b2bLabSharesList } = this.props;
    const { labs } = this.props;
    // const { units } = this.props;

    const { isEdit, isEditAll, deleteModal } = this.state;

    const { onAddNewLabShare, onUpdateLabShare, onGetb2bLabSharesList } =
      this.props;
    const b2bLabShare = this.state.b2bLabShare;

    const pageOptions = {
      sizePerPage: 10000,
      totalSize: b2bLabSharesList.length, // replace later with size(b2bLabSharesList),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const labList = [];
    for (let i = 0; i < labs.length; i++) {
      let flag = 0;

      // Check if test available in our database is already being offered by lab
      // If yes then don't push it in labList
      for (let j = 0; j < b2bLabSharesList.length; j++) {
        if (labs[i].id == b2bLabSharesList[j].lab_id) {
          flag = 1;
        }
      }
      if (!flag) {
        labList.push({
          label: labs[i].name,
          value: labs[i].id,
        });
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Hazir | B2B Client Shares</title>
          </MetaTags>
          <ConfirmModal
          // show={this.state.confirmModal}
          // onCloseClick={() => this.setState({ confirmModal: false })}
          />
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B Client" breadcrumbItem="Shares"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.b2bLabShareListColumns}
                      data={b2bLabSharesList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.b2bLabShareListColumns}
                          data={b2bLabSharesList}
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
                                <Col sm="6">
                                  {/* <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-18 btn-block btn btn-success"
                                      onClick={this.handleEditAllBtnClick}
                                    >
                                      <i className="mdi mdi-pencil" /> Edit All
                                    </Button>
                                  </div> */}
                                </Col>
                                <Col sm="6" lg="2">
                                  <div className="text-sm-end">
                                  <Button
                                      color="primary"
                                      className="font-18 btn-block btn btn-success"
                                      onClick={this.handleEditAllBtnClick}
                                    >
                                      <i className="mdi mdi-pencil" /> Edit All
                                    </Button>
                                    {/* <Button
                                      color="primary"
                                      className="w-100 font-16 btn-block btn btn-primary"
                                      onClick={this.handleb2bLabShareClicks}
                                      disabled={labList.length == 0}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Lab
                                    </Button> */}
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
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
                                        {!!isEdit
? "Edit B2B Share"
: "Add B2B Shares"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            b2b_shares:
                                              (b2bLabShare &&
                                                b2bLabShare.b2b_shares) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            // b2b_shares:
                                            // Yup.string().required(
                                            // "Please enter patient unique id"
                                            // ),
                                          })}
                                          onSubmit={values => {
                                            const updateLabShare = {
                                              id: b2bLabShare.id,
                                              b2b_shares: values.b2b_shares,
                                            };

                                            // update TestAppointment
                                            onUpdateLabShare(updateLabShare);

                                            setTimeout(() => {
                                              onGetb2bLabSharesList(
                                                this.props.match.params.id
                                              );
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
                                                      B2B Shares
                                                    </Label>
                                                    <Field
                                                      name="b2b_shares"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.00"
                                                      max="1.00"
                                                      value={
                                                        this.state.b2bLabShare
                                                          .b2b_shares
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          b2bLabShare: {
                                                            id: this.state
                                                              .b2bLabShare.id,
                                                            b2b_id:
                                                              this.props.match
                                                                .params.id,
                                                            b2b_shares:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.b2b_shares &&
                                                          touched.b2b_shares
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="b2b_shares"
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
                                                      onClick={
                                                        this.handleAPICall
                                                      }
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
                                    <Modal
                                      isOpen={this.state.addmodal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <h4>Add New Lab</h4>
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              addmodal: false,
                                            })
                                          }
                                          data-bs-dismiss="modal"
                                          aria-label="Close"
                                        ></button>
                                      </div>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            b2b_shares:
                                              (b2bLabShare &&
                                                b2bLabShare.b2b_shares) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                          })}
                                          onSubmit={values => {
                                            console.log("Inside on submit..")
                                            if (isEdit) {
                                              const updateLabShare = {
                                                id: b2bLabShare.id,
                                                lab_id: parseInt(
                                                  values.lab_id
                                                ),
                                                b2b_shares: values.b2b_shares,
                                              };

                                              // update b2bLabShare
                                              onUpdateLabShare(
                                                updateLabShare,
                                                this.props.match.params.id
                                              );

                                              setTimeout(() => {
                                                onGetb2bLabSharesList(
                                                  this.props.match.params.id
                                                );
                                              }, 1000);
                                            } else {
                                              console.log("Inside else..");
                                              const newLabShare = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                lab_id: this.state.lab_id,
                                                b2b_shares:
                                                  values.b2b_shares,
                                              };

                                              // save new b2bLabShare
                                              onAddNewLabShare(
                                                newLabShare,
                                                this.props.match.params.id
                                              );

                                              setTimeout(() => {
                                                onGetb2bLabSharesList(
                                                  this.props.match.params.id
                                                );
                                              }, 1000);
                                            }
                                            this.setState({
                                              addmodal: false,
                                            });
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  {/* Make field readonly in case of edit form */}
                                                  {b2bLabShare.lab_id &&
                                                    b2bLabShare.lab_id ? (
                                                    <div className="mb-3">
                                                      <Label className="form-label">
                                                        Lab name
                                                      </Label>
                                                      <Field
                                                        name="lab_id"
                                                        as="select"
                                                        defaultValue={
                                                          b2bLabShare.lab_id
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                        multiple={false}
                                                      >
                                                        <option
                                                          key={
                                                            b2bLabShare.lab_id
                                                          }
                                                          value={
                                                            b2bLabShare.lab_id
                                                          }
                                                        >
                                                          {
                                                            b2bLabShare.lab_name
                                                          }
                                                        </option>
                                                      </Field>
                                                    </div>
                                                  ) : (
                                                    <div className="mb-3 select2-container">
                                                      <Label>Lab Name</Label>
                                                      <Select
                                                        name="lab_id"
                                                        component="Select"
                                                        onChange={selectedGroup =>
                                                          this.setState({
                                                            lab_id:
                                                              selectedGroup.value,
                                                          })
                                                        }
                                                        className={
                                                          "defautSelectParent" +
                                                          (!this.state.lab_id
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                        styles={{
                                                          control: (
                                                            base,
                                                            state
                                                          ) => ({
                                                            ...base,
                                                            borderColor: !this
                                                              .state.lab_id
                                                              ? "#f46a6a"
                                                              : "#ced4da",
                                                          }),
                                                        }}
                                                        options={labList}
                                                        placeholder="Select Lab..."
                                                      />

                                                      <div className="invalid-feedback">
                                                        Please select your Lab
                                                      </div>
                                                    </div>
                                                  )}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      B2B Shares
                                                    </Label>
                                                    <Field
                                                      name="b2b_shares"
                                                      type="number"
                                                      step="0.01"
                                                      min="0.00"
                                                      max="1.00"
                                                      value={
                                                        this.state.b2bLabShare
                                                          .b2b_shares
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          b2bLabShare: {
                                                            id: this.state
                                                              .b2bLabShare.id,
                                                            b2b_id:
                                                              this.props.match
                                                                .params.id,
                                                            b2b_shares:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.b2b_shares &&
                                                          touched.b2b_shares
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="b2b_shares"
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
                                                    // this.handleAPICall
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

B2bLabSharesList.propTypes = {
  match: PropTypes.object,
  labs: PropTypes.array,
  // units: PropTypes.array,
  b2bLabSharesList: PropTypes.array,
  className: PropTypes.any,
  onGetb2bLabSharesList: PropTypes.func,
  onGetlabs: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewLabShare: PropTypes.func,
  onUpdateLabShare: PropTypes.func,
  onUpdateAllLabShare: PropTypes.func,

};

const mapStateToProps = ({ b2bLabShares }) => ({
  b2bLabSharesList: b2bLabShares.b2bLabSharesList,
  labs: b2bLabShares.labs,
  // units: b2bLabSharesList.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetlabs: () => dispatch(getLabs()),
  // onGetUnits: () => dispatch(getUnits()),
  onGetb2bLabSharesList: id => dispatch(getB2bLabSharesList(id)),
  onAddNewLabShare: (b2bLabShare, id) =>
    dispatch(addNewLabShare(b2bLabShare, id)),
  onUpdateLabShare: b2bLabShare => dispatch(updateLabShare(b2bLabShare)),
  onUpdateAllLabShare: b2bLabShare => dispatch(updateAllLabShare(b2bLabShare)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(B2bLabSharesList));