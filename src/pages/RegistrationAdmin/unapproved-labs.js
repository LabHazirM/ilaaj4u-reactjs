import React, { Component, useState } from "react";
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
  Row,
  Label,
  Modal,
  ModalBody,
  ModalHeader,

} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getUnapprovedLabs,
  approveUnapproveLab,
} from "store/registration-admin/actions";
import "assets/scss/table.scss";

class UnapprovedLabs extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedLabs: [],
      id: "",
      tooltipContent: ["Worst", "Bad", "Average", "Good", "Excellent"],
      approvedLab: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      approvedLabListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, approvedLab) => <>{approvedLab.id}</>,
        },
        {
          dataField: "city",
          text: "Lab City",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
                {approvedLab.city}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Lab Name",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span style={{
                width: '200px', // Set your desired width here
                fontSize: '14px',
              
                textOverflow: 'ellipsis',
                whiteSpace: 'prewrap',
                textAlign: 'left', // Align text to the left
                display: 'block',
              }}>
                <Link
                  to="#"
                  onMouseEnter={e => this.openPatientModal(e, approvedLab)}
                  onPointerLeave={this.handleMouseExit()}
                >
                  {approvedLab.name}
                </Link>
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "type",
          text: "Lab Type",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-end">
                {approvedLab.type == "Main Lab" ? (
                  <span>Main</span>
                ) : (
                  <span>Collection</span>
                )}
              </span>
            </>
          ),
          filter: selectFilter({
            options: {
              // '': 'All',
              'Main Lab': 'Main',
              'Collection Point': 'Collection',
            },
            // defaultValue: 'Main Lab',
          }),
        },
        {
          dataField: "email",
          text: "Email",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-start">
                {approvedLab.email}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_phone",
          text: "Phone",
          // sort: true,
          formatter: (cellContent, approvedLab) => (
            <>
              <span className="float-start">
                {approvedLab.lab_phone}
              </span>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "address",
          text: "Address",
          sort: true,
          formatter: (cellContent, approvedLab) => (
            <span style={{
              width: '200px', // Set your desired width here
              fontSize: '14px',
            
              textOverflow: 'ellipsis',
              whiteSpace: 'prewrap',
              textAlign: 'left', // Align text to the left
              display: 'block',
            }}>
                {approvedLab.address}
            </span>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "data",
        //   text: "id",
        //   isDummyField: true,
        //   editable: false,
        //   text: "Action",
        //   formatter: (cellContent, pendingLab) => (
        //     <>
        //     <Tooltip title="Update">
        //       <Link
        //         className="btn btn-success btn-rounded"
        //         to="#"
        //         onClick={e => this.handleApprovedEvent(e, pendingLab.id)}
        //       >
        //         <i className="mdi mdi-check-circle font-size-14"></i>
        //       </Link></Tooltip>{" "}
        //     </>
        //   ),
        // },
      ],
    };
    this.toggle = this.toggle.bind(this);
    this.handleApprovedEvent = this.handleApprovedEvent.bind(this);
  }

  componentDidMount() {
    const { unapprovedLabs, onGetUnapprovedLabs } = this.props;
    onGetUnapprovedLabs(this.state.user_id);
    this.setState({ unapprovedLabs });
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      name: arg.name,
      registered_at: arg.registered_at,
      done_at: arg.done_at,
      isHovered: true,
    });
  };
  handleMouseExit = () => {
    this.setState({
      PatientModal: false,
      isHovered: false,
    });
  };
  togglePatientModal = () => {
    this.setState(prevState => ({
      PatientModal: !prevState.PatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleApprovedEvent = (e, arg) => {
    this.setState({
      id: arg,
    });

    this.toggle();
  };

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

  render() {
    const { SearchBar } = Search;

    const { unapprovedLabs } = this.props;
    const data = this.state.data;
    const { onApproveUnapproveLab, onGetUnapprovedLabs } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedLabs.length, // replace later with size(unapprovedLabs),
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
            <title>Unapproved Labs | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs" breadcrumbItem="Unapproved" />
            <Row>
            <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: There will be UnapprovedApproved and Inactive Labs Shown on it.
                  </strong>
                  </span>
                </div>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.approvedLabListColumns}
                      data={unapprovedLabs}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.approvedLabListColumns}
                          data={unapprovedLabs}
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
                                      classes={"table align-middle table-condensed table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={filterFactory()}

                                    />
                                    {this.state.isHovered && (
                                      <Modal
                                        isOpen={this.state.PatientModal}
                                        className={this.props.className}
                                        onPointerLeave={this.handleMouseExit}
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
                                                  {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_address
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
                                                  {/* <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div> */}
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Name
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          this.state.name
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Approvel At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.done_at).toLocaleString('en-US')
                                                        }
                                                        className="form-control"
                                                        readOnly={true}
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="mb-3 row">
                                                    <div className="col-md-3">
                                                      <Label className="form-label">
                                                        Register At
                                                      </Label>
                                                    </div>
                                                    <div className="col-md-9">
                                                      <input
                                                        type="text"
                                                        value={
                                                          new Date(this.state.registered_at).toLocaleString('en-US')
                                                        }
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
                                    )}
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <div className="modal-header">
                                        <button
                                          type="button"
                                          className="btn-close"
                                          onClick={() =>
                                            this.setState({
                                              modal: false,
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
                                            refereree_percentage:
                                              (data &&
                                                data.refereree_percentage) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            refereree_percentage:
                                              Yup.number().required(
                                                "Please enter referee fee percentage"
                                              ),
                                          })}
                                          onSubmit={values => {
                                            const data = {
                                              id: this.state.user_id,
                                              labId: this.state.id,
                                              refereree_percentage:
                                                values.refereree_percentage,
                                            };

                                            // approve lab
                                            onApproveUnapproveLab(data);

                                            // Calling to update list record
                                            setTimeout(() => {
                                              onGetUnapprovedLabs();
                                            }, 1000);

                                            this.toggle();
                                          }}
                                        >
                                          {({ errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Referee Fee Percentage
                                                    </Label>
                                                    <Field
                                                      name="refereree_percentage"
                                                      type="number"
                                                      step="0.1"
                                                      min="0"
                                                      max="0.9"
                                                      className={
                                                        "form-control" +
                                                        (errors.refereree_percentage &&
                                                        touched.refereree_percentage
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="refereree_percentage"
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

UnapprovedLabs.propTypes = {
  match: PropTypes.object,
  unapprovedLabs: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedLabs: PropTypes.func,
  onApproveUnapproveLab: PropTypes.func,
};
const mapStateToProps = ({ registrationAdmin }) => ({
  unapprovedLabs: registrationAdmin.unapprovedLabs,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onApproveUnapproveLab: data => dispatch(approveUnapproveLab(data)),
  onGetUnapprovedLabs: () => dispatch(getUnapprovedLabs()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(UnapprovedLabs));
