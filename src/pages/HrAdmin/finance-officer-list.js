import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Tooltip } from "@material-ui/core";
import {
  Card,
  CardBody,
  CardImg,
  Col,
  Container,
  Row,
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  Label,
  Input,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// import { getFinanceOfficer, updateStaff, deleteStaff } from "store/sample-collectors/actions";
import {
  getFinanceOfficerList,
  updateStaff,
  deleteStaff,
} from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class FinanceOfficerList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      financeOfficerList: [],
      staff: "",
      collectorImg: "",
      modal: false,
      deleteModal: false,
      financeOfficerListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, FinanceOfficer) => <>{FinanceOfficer.id}</>,
        },
        {
          dataField: "photo",
          text: "Name",
          sort: true,
          formatter: (cellContent, FinanceOfficer) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + FinanceOfficer.photo,
                }}
                target="_blank"
              >
                {FinanceOfficer.name}
              </Link>
            </>
          ),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Mobile No.",
          sort: true,
        },
        {
          dataField: "territory_office",
          text: "Territory Office",
          sort: true,
        },
        // {
        //   dataField: "photo",
        //   text: "Photo",
        //   sort: true,
        //   formatter: (cellContent, FinanceOfficer) => (
        //     <>
        //       <Link
        //         to={{
        //           pathname:
        //             process.env.REACT_APP_BACKENDURL + FinanceOfficer.photo,
        //         }}
        //         target="_blank"
        //       >
        //         View
        //       </Link>
        //     </>
        //   ),
        // },

        {
          dataField: "roles",
          text: "Roles",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, FinanceOfficer) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handleFinanceOfficerClick(e, FinanceOfficer)
                  }
                ></i>
              </Link>
              </Tooltip>
              <Tooltip title="Delete">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(FinanceOfficer)}
                ></i>
              </Link>
              </Tooltip>
            </div>
          ),
        },
      ],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.handleFinanceOfficerClick = this.handleFinanceOfficerClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleFinanceOfficerClicks =
      this.handleFinanceOfficerClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { onGetFinanceOfficerList } = this.props;
    onGetFinanceOfficerList();
    this.setState({ financeOfficerList: this.props.financeOfficerList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleFinanceOfficerClicks = () => {
    this.setState({ FinanceOfficer: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { financeOfficerList } = this.props;
    if (
      !isEmpty(financeOfficerList) &&
      size(prevProps.financeOfficerList) !== size(financeOfficerList)
    ) {
      this.setState({ financeOfficerList: {}, isEdit: false });
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

  onClickDelete = financeOfficerList => {
    this.setState({ financeOfficerList: financeOfficerList });
    this.setState({ deleteModal: true });
  };

  handleDeleteFinanceOfficer = () => {
    const { onDeleteStaff, onGetFinanceOfficerList } = this.props;
    const { financeOfficerList } = this.state;
    if (financeOfficerList.id !== undefined) {
      onDeleteStaff(financeOfficerList);
      setTimeout(() => {
        onGetFinanceOfficerList();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleFinanceOfficerClick = (e, arg) => {
    this.setState({
      staff: {
        id: arg.id,
        name: arg.name,
        cnic: arg.cnic,
        phone: arg.phone,
        roles: arg.roles,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { financeOfficerList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateStaff, onGetFinanceOfficerList } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: financeOfficerList.length, // replace later with size(FinanceOfficerList),
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
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteFinanceOfficer}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Finance Officer List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Finance Officer List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.financeOfficerListColumns}
                      data={financeOfficerList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.financeOfficerListColumns}
                          data={financeOfficerList}
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
                                        Edit FinanceOfficer
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name: (staff && staff.name) || "",
                                            cnic: (staff && staff.cnic) || "",
                                            phone: (staff && staff.phone) || "",
                                            roles: (staff && staff.roles) || "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string()
                                              .trim()
                                              .required("Please enter name"),
                                            cnic: Yup.string()
                                              .required(
                                                "Please enter your CNIC"
                                              )
                                              .matches(
                                                /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                                "Please enter a valid CNIC e.g. 37106-8234782-3"
                                              ),
                                            phone: Yup.string()
                                              .required("Please enter phone")
                                              .matches(
                                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                                "Please enter a valid Pakistani phone number e.g. 03123456789"
                                              ),
                                            roles: Yup.string()
                                              .trim()
                                              .required("Please enter roles"),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              const staffData = {
                                                id: staff.id,
                                                name: values.name,
                                                cnic: values.cnic,
                                                phone: values.phone,
                                                roles: values.roles,
                                              };

                                              // save new Staff
                                              onUpdateStaff(staffData);

                                              // if (this.props.staff.length != 0) {
                                              //   this.props.history.push("/add-")
                                              // }

                                              setTimeout(() => {
                                                onGetFinanceOfficerList();
                                              }, 1000);
                                            }
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
                                                      Name
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      value={
                                                        this.state.staff.name
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: e.target
                                                              .value,
                                                            cnic: staff.cnic,
                                                            phone: staff.phone,
                                                            roles: staff.roles,
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
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                    </Label>
                                                    <Field
                                                      name="cnic"
                                                      type="text"
                                                      value={
                                                        this.state.staff.cnic
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            staff: {
                                                              id: staff.id,
                                                              name: staff.name,
                                                              cnic: e.target
                                                                .value,
                                                              phone:
                                                                staff.phone,
                                                              roles:
                                                                staff.roles,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.cnic &&
                                                        touched.cnic
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="cnic"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Mobile No
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      value={
                                                        this.state.staff.phone
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: staff.name,
                                                            cnic: staff.cnic,
                                                            phone:
                                                              e.target.value,
                                                            roles: staff.roles,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                        touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Roles
                                                    </Label>
                                                    <Field
                                                      name="roles"
                                                      type="text"
                                                      value={
                                                        this.state.staff.roles
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          staff: {
                                                            id: staff.id,
                                                            name: staff.name,
                                                            cnic: staff.cnic,
                                                            phone: staff.phone,
                                                            roles:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.roles &&
                                                        touched.roles
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="roles"
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

FinanceOfficerList.propTypes = {
  match: PropTypes.object,
  financeOfficerList: PropTypes.array,
  className: PropTypes.any,
  onGetFinanceOfficerList: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  financeOfficerList: staff.financeOfficerList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetFinanceOfficerList: () => dispatch(getFinanceOfficerList()),
  onUpdateStaff: FinanceOfficer => dispatch(updateStaff(FinanceOfficer)),
  onDeleteStaff: FinanceOfficer => dispatch(deleteStaff(FinanceOfficer)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FinanceOfficerList));
