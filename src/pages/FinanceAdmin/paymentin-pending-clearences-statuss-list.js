import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
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
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getDepositStatuss,
  updatePaymentInStatus,
} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      paymentStatuss: [],
      paymentStatus: "",
      modal: false,
      payment_status: "Pending Clearance",
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.handlePaymentStatusClick =
      this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePaymentStatusClicks =
      this.handlePaymentStatusClicks.bind(this);
  }

  componentDidMount() {
    const { paymentStatuss, onGetDepositStatuss } = this.props;
    onGetDepositStatuss(this.state.user_id);
    this.setState({ paymentStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      paymentStatus: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { paymentStatuss } = this.props;
    if (
      !isEmpty(paymentStatuss) &&
      size(prevProps.paymentStatuss) !== size(paymentStatuss)
    ) {
      this.setState({ paymentStatuss: {}, isEdit: false });
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


  handlePaymentStatusClick = (e, arg) => {
    this.setState({
      paymentStatus: {
        id: arg.id,
        cleared_at: arg.cleared_at,
        is_cleared: arg.is_cleared,
        payment_status: arg.payment_status,
      },
      isEdit: true,
    });

    this.toggle();
  };

  handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    // Perform navigation based on the selected value
    if (selectedValue === 'Payment Out Cleared') {
        this.props.history.push('/approved-in-payments');
    }
    if (selectedValue === 'Payment In Cleared') {
    this.props.history.push('/cleared-in-payments');
    }
    if (selectedValue === 'Payment In Pending') {
      this.props.history.push('/pending-in-payments');
      }
    if (selectedValue === 'Payment Out Pending') {
        this.props.history.push('/pending-out-payments');
        }
}

  render() {
    const columns = [
      {
        text: "id",
        dataField: "id",
        sort: true,
        hidden: true,
        formatter: (cellContent, paymentStatus) => (
          <>{paymentStatus.id}</>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        text: "MIF ID",
        dataField: "id",
        sort: true,
        hidden: false,
        formatter: (cellContent, paymentStatus) => (
          <>{paymentStatus.id}</>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "invoice_id",
        text: "invoice ID",
        sort: true,
        hidden: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <strong>{paymentStatus.invoice_id}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_for",
        text: "Payment From",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <strong>{paymentStatus.payment_for}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "lab_name",
        text: "Client Name",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <span>
              <span>
                {paymentStatus.lab_name}{" "}
                {paymentStatus.donor_name}
                {paymentStatus.advertisement_title}
              </span>
            </span>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_method",
        text: "Payment Method",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <strong>{paymentStatus.payment_method}</strong>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "cheque_no",
        text: "Cheque/Ref#",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            {paymentStatus.deposit_slip && paymentStatus.cheque_no
              ? <span><Link
              to={{
                pathname:
                    process.env.REACT_APP_BACKENDURL + paymentStatus.cheque_image,
            }}
                target="_blank"
              >
                {paymentStatus.cheque_no && (
                  <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {paymentStatus.cheque_no}
                  </span>
                )}
              </Link></span>
              : paymentStatus.deposit_slip && paymentStatus.refered_no
                ? <span><Link
                to={{
                  pathname:
                      process.env.REACT_APP_BACKENDURL + paymentStatus.cheque_image,
              }}
                  target="_blank"
                >
                  {paymentStatus.refered_no && (
                    <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                      {paymentStatus.refered_no}
                    </span>
                  )}
                </Link></span>
                : <span>--</span>
            }
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "amount",
        text: "Amount",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <div className="text-end">
              <strong>{paymentStatus.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
          </>
        ), filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
      {
        dataField: "bank",
        text: "Bank/Account#",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <span>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentStatus.deposit_slip,
                }}
                target="_blank"
              >
                <span>
                  {paymentStatus.bank_name},{" "}
                  {paymentStatus.account_no}
                </span>
              </Link>

            </span>

          </>
        ),
        filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "deposited_at",
        text: "Deposite Date",
        sort: true,
        formatter: (cellContent, paymentStatus) => {
          const date = new Date(paymentStatus.deposited_at);
          const day = date.getDate();
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const month = monthNames[date.getMonth()];
          const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year

          return (
            <p className="text-muted mb-0">
              {`${day}-${month}-${year}`}
            </p>
          );
        },
        filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
      // {
      //   dataField: "deposit_slip",
      //   text: "Deposite Slip",
      //   sort: true,
      //   formatter: (cellContent, paymentStatus) => (
      //     <>
      //       <Link
      //         to={{
      //           pathname:
      //             process.env.REACT_APP_BACKENDURL +
      //             paymentStatus.deposit_slip,
      //         }}
      //         target="_blank"
      //       >
      //         View Slip
      //       </Link>
      //     </>
      //   ),
      // },
      // {
      //   dataField: "payment_status",
      //   text: "Status",
      //   sort: true,
      // },
     
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Comments",
        formatter: (cellContent, paymentStatus) => (
                  <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-financeadmin/${paymentStatus.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
    ];
    const { SearchBar } = Search;

    const { paymentStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdatePaymentInStatus,
      onGetDepositStatuss,
    } = this.props;
    const paymentStatus = this.state.paymentStatus;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: this.props.paymentStatuss.length, // Replace with the actual data length
      custom: true,
    };
    
    // Check if there are items in the paymentStatuss array
    const hasData = paymentStatuss && paymentStatuss.length > 0;

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
            <title>MIF List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="List"
              breadcrumbItem="MIF Deposited"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={paymentStatuss}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={paymentStatuss}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="ms-2 mb-4">
                                    <div>
                                      <Label for="main_lab_appointments" className="form-label">
                                        <strong>Money In Form Statuss</strong>
                                      </Label>
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleSelectChange}


                                      >                                        
                                        <option value="Payment In Pending">MIF Pending Clearance</option>
                                         <option value="Payment In Cleared">MIF Cleared</option>
                                        <option value="Payment Out Cleared">MOF Cleared</option>
                                        <option value="Payment Out Pending">MOF Pending Clearance</option>
                                        
                                      </select>
                                    </div></div>
                                </Col>
                              </Row>
                              <Row className="mb-4">
                                <Col xl="12">
                                  <div className="table-responsive">
                                    <BootstrapTable
                                      {...toolkitprops.baseProps}
                                      {...paginationTableProps}
                                      defaultSorted={defaultSorted}
                                      classes={"table align-middle"}
                                      bordered={false}
                                      columns={columns}
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
                                        {!!isEdit
                                          ? "UpdateMIF"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            is_cleared:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .is_cleared) ||
                                              "",
                                            cleared_at:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .cleared_at) ||
                                              "",
                                            payment_status:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .payment_status) ||
                                              "",

                                          }}

                                            validationSchema={Yup.object().shape({
                                              is_cleared: Yup.string().required('Is Cleared is required'),
                                              cleared_at: Yup.string().when('is_cleared', {
                                                is: 'Yes',
                                                then: Yup.string().required('Cleared At is required'),
                                                otherwise: Yup.string(),
                                              }),

                                          })}
                                          onSubmit={values => {
                                            const updatePaymentInStatus =
                                            {
                                              id: paymentStatus.id,

                                              is_cleared: values.is_cleared,
                                              cleared_at: values.cleared_at,


                                            };

                                            // update PaymentStatus
                                            onUpdatePaymentInStatus(
                                              updatePaymentInStatus
                                            );
                                            setTimeout(() => {
                                              onGetDepositStatuss(
                                                this.state.user_id
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
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Varified By
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="is_cleared"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .is_cleared
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            status:
                                                              paymentStatus.status,
                                                            cleared_at: paymentStatus.cleared_at,
                                                            is_cleared:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.is_cleared &&
                                                        touched.is_cleared
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="is_cleared"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is Cleared
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_cleared"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.is_cleared &&
                                                          touched.is_cleared
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            // deposit_bank:
                                                            //   paymentStatus.deposit_bank,
                                                            // // deposited_at: paymentStatus.deposit_bank,
                                                            cleared_at: paymentStatus.cleared_at,
                                                            is_cleared:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .is_cleared
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select type ---
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>


                                                    </Field>
                                                    <ErrorMessage
                                                      name="is_cleared"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {this.state.paymentStatus.is_cleared == "Yes" ? (
                                                    <div className="mb-3">

                                                      <Label htmlFor="cardnumberInput">
                                                        Please select clearence date and time
                                                        <span
                                                          style={{ color: "#f46a6a" }}
                                                          className="font-size-18"
                                                        >
                                                          *
                                                        </span>
                                                      </Label>
                                                      <input
                                                        name="cleared_at"
                                                        type="datetime-local"
                                                        max={new Date(
                                                          new Date().toString().split("GMT")[0] + " UTC"
                                                        )
                                                          .toISOString()
                                                          .slice(0, -8)}
                                                        onChange={e => {
                                                          this.setState({
                                                            paymentStatus: {
                                                              id: paymentStatus.id,
                                                              // deposit_bank:
                                                              //   paymentStatus.deposit_bank,
                                                              // // deposited_at: paymentStatus.deposit_bank,
                                                              is_cleared: paymentStatus.is_cleared,
                                                              cleared_at:
                                                                e.target.value,
                                                            },
                                                          });
                                                        }}
                                                        className={
                                                          "form-control" +
                                                          (errors.is_cleared &&
                                                          touched.is_cleared
                                                            ? " is-invalid"
                                                            : "")
                                                        }
                                                      />
                                                      <ErrorMessage
                                                        name="is_cleared"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  ) : null}
                                                  {/* Certificate Type field */}
                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status Type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.status &&
                                                        touched.status
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            cleared_at: paymentStatus.cleared_at,
                                                            is_cleared: paymentStatus.is_cleared,
                                                            status :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .status
                                                      }
                                                    >
                                                      <option value="">
                                                        --- Please select
                                                        status type ---
                                                      </option>
                                                      <option value="Created">
                                                      Created
                                                      </option>
                                                      <option value="Deposited">
                                                      Deposited
                                                      </option>
                                                      <option value="Cleared">
                                                      Cleared
                                                      </option>
                                                      
                                                    </Field>
                                                    <ErrorMessage
                                                      name="status"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}


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
                              {hasData && (
                                <Row className="align-items-md-center mt-30">
                                  <Col className="pagination pagination-rounded justify-content-end mb-2">
                                    <PaginationListStandalone
                                      {...paginationProps}
                                    />
                                  </Col>
                                </Row>
                              )}
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

PaymentStatussList.propTypes = {
  match: PropTypes.object,
  paymentStatuss: PropTypes.array,
  className: PropTypes.any,
  onGetDepositStatuss: PropTypes.func,
  onUpdatePaymentInStatus: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentStatuss: paymentStatuss.paymentStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDepositStatuss: id => dispatch(getDepositStatuss(id)),
  onUpdatePaymentInStatus: paymentStatus =>
    dispatch(updatePaymentInStatus(paymentStatus)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
