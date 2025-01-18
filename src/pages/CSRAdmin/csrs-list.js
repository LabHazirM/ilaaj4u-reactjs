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
import filterFactory, {textFilter} from "react-bootstrap-table2-filter";
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

// import { getCSR, updateStaff, deleteStaff } from "store/sample-collectors/actions";
import { getCSRList, updateStaff, deleteStaff } from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class CSRsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      csrList: [],
      staff: "",
      collectorImg: "",
      modal: false,
      deleteModal: false,
      csrListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, CSR) => <>{CSR.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
          formatter: (cellContent, CSR) => (
            <>
            <Tooltip title="View Image">
              <Link
                to={{
                  pathname: process.env.REACT_APP_BACKENDURL + CSR.photo,
                }}
                target="_blank"
              >
                {CSR.name}
              </Link>
              </Tooltip>
            </>
          ),
          filter: textFilter() // Apply text filter here
        },
        
        {
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "phone",
          text: "Mobile No.",
          sort: true,
          filter: textFilter(),
        },

        {
          dataField: "roles",
          text: "Roles",
          sort: true,
          filter: textFilter(),
        },
        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, CSR) => (
        //     <div className="d-flex gap-3">
        //       <Link className="text-success" to="#">
        //         <i
        //           className="mdi mdi-pencil font-size-18"
        //           id="edittooltip"
        //           onClick={e => this.handleCSRClick(e, CSR)}
        //         ></i>
        //       </Link>
        //       <Link className="text-danger" to="#">
        //         <i
        //           className="mdi mdi-delete font-size-18"
        //           id="deletetooltip"
        //           onClick={() => this.onClickDelete(CSR)}
        //         ></i>
        //       </Link>
        //     </div>
        //   ),
        // },
      ],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.handleCSRClick = this.handleCSRClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleCSRClicks = this.handleCSRClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { onGetCSRList } = this.props;
    onGetCSRList();
    this.setState({ csrList: this.props.csrList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleCSRClicks = () => {
    this.setState({ CSR: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { csrList } = this.props;
    if (!isEmpty(csrList) && size(prevProps.csrList) !== size(csrList)) {
      this.setState({ csrList: {}, isEdit: false });
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

  onClickDelete = csrList => {
    this.setState({ csrList: csrList });
    this.setState({ deleteModal: true });
  };

  handleDeleteCSR = () => {
    const { onDeleteStaff, onGetCSRList } = this.props;
    const { csrList } = this.state;
    if (csrList.id !== undefined) {
      onDeleteStaff(csrList);
      setTimeout(() => {
        onGetCSRList();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleCSRClick = (e, arg) => {
    console.log("arg: ", arg);

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

    const { csrList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onUpdateStaff, onGetCSRList } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: csrList.length, // replace later with size(CSRsList),
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
          onDeleteClick={this.handleDeleteCSR}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>CSR List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="CSR's List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.csrListColumns}
                      data={csrList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.csrListColumns}
                          data={csrList}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    {/* <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div> */}
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
                                      filter={filterFactory()}
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
                                        Edit CSR
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
                                                onGetCSRList();
                                              }, 1000);
                                            }
                                            this.toggle();
                                          }}
                                        ></Formik>
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

CSRsList.propTypes = {
  match: PropTypes.object,
  csrList: PropTypes.array,
  className: PropTypes.any,
  onGetCSRList: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  csrList: staff.csrList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCSRList: () => dispatch(getCSRList()),
  onUpdateStaff: CSR => dispatch(updateStaff(CSR)),
  onDeleteStaff: CSR => dispatch(deleteStaff(CSR)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CSRsList));
