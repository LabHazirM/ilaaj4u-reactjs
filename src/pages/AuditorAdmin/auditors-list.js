import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
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

// import { getAuditor, updateStaff, deleteStaff } from "store/sample-collectors/actions";
import { getAuditorList, deleteStaff } from "store/staff/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class AuditorsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      auditorList: [],
      staff: "",
      collectorImg: "",
      modal: false,
      auditorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, Auditor) => <>{Auditor.id}</>,
        },
        {
          dataField: "photo",
          text: "Name",
          sort: true,
          style:{ textAlign: "left"},
          formatter: (cellContent, Auditor) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + Auditor.photo,
                }}
                target="_blank"
              >
                {Auditor.name}
              </Link>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
          filter: textFilter(),
        },
        // {
        //   dataField: "cnic",
        //   text: "CNIC",
        //   sort: true,
        // },
        {
          dataField: "phone",
          text: "Mobile No.",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "territory_office",
          text: "Territory Office",
          sort: true,
          filter: textFilter(),
        },
      

        // {
        //   dataField: "menu",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, Auditor) => (
        //     <div className="d-flex gap-3">
        //       <Link className="text-success" to="#">
        //         <i
        //           className="mdi mdi-pencil font-size-18"
        //           id="edittooltip"
        //           onClick={e => this.handleAuditorClick(e, Auditor)}
        //         ></i>
        //       </Link>
        //       <Link className="text-danger" to="#">
        //         <i
        //           className="mdi mdi-delete font-size-18"
        //           id="deletetooltip"
        //           onClick={() => this.onClickDelete(Auditor)}
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
    this.handleAuditorClick = this.handleAuditorClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAuditorClicks = this.handleAuditorClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { onGetAuditorList } = this.props;
    onGetAuditorList();
    this.setState({ auditorList: this.props.auditorList });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleAuditorClicks = () => {
    this.setState({ Auditor: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { auditorList } = this.props;
    if (
      !isEmpty(auditorList) &&
      size(prevProps.auditorList) !== size(auditorList)
    ) {
      this.setState({ auditorList: {}, isEdit: false });
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

  onClickDelete = auditorList => {
    this.setState({ auditorList: auditorList });
    this.setState({ deleteModal: true });
  };

  handleDeleteAuditor = () => {
    const { onDeleteStaff, onGetAuditorList } = this.props;
    const { auditorList } = this.state;
    if (auditorList.id !== undefined) {
      onDeleteStaff(auditorList);
      setTimeout(() => {
        onGetAuditorList();
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleAuditorClick = (e, arg) => {
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

    const { auditorList } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onGetAuditorList } = this.props;
    const staff = this.state.staff;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: auditorList.length, // replace later with size(AuditorsList),
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
          onDeleteClick={this.handleDeleteAuditor}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Auditor List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Staff" breadcrumbItem="Auditors List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.auditorListColumns}
                      data={auditorList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.auditorListColumns}
                          data={auditorList}
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
                                      filter={filterFactory()}
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
                                        Edit Auditor
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
                                                onGetAuditorList();
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

AuditorsList.propTypes = {
  match: PropTypes.object,
  auditorList: PropTypes.array,
  className: PropTypes.any,
  onGetAuditorList: PropTypes.func,
  onDeleteStaff: PropTypes.func,
  onUpdateStaff: PropTypes.func,
};

const mapStateToProps = ({ staff }) => ({
  auditorList: staff.auditorList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAuditorList: () => dispatch(getAuditorList()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AuditorsList));
