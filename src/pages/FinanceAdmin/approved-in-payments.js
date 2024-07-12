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
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getApprovedInPayments,
} from "store/finance-admin/actions";
import {
  deletePaymentout,

} from "store/payment-statuss/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      approvedInPayments: [],
      approvedInPayment: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.toggle = this.toggle.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    const { approvedInPayments, onGetApprovedInPayments } = this.props;
    onGetApprovedInPayments(this.state.user_id);
    this.setState({ approvedInPayments });
  }
  toggleDeleteModal = () => {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  onClickDelete = approvedInPayments => {
    this.setState({ approvedInPayments: approvedInPayments });
    this.setState({ deleteModal: true });
  };
  handleDeletePathologist = () => {
    const { onDeletePaymentout, onGetApprovedInPayments } = this.props;
    const { approvedInPayments } = this.state;
    if (approvedInPayments.id !== undefined) {
      onDeletePaymentout(approvedInPayments);
      setTimeout(() => {
        onGetApprovedInPayments(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { approvedInPayments } = this.props;
    if (
      !isEmpty(approvedInPayments) &&
      size(prevProps.approvedInPayments) !== size(approvedInPayments)
    ) {
      this.setState({ approvedInPayments: {}, isEdit: false });
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
    const { SearchBar } = Search;
    const columns= [
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
        text: "MOF ID",
        dataField: "id",
        sort: true,
        hidden: false,
        formatter: (cellContent, paymentStatus) => (
            <>{paymentStatus.id}</>
        ),filter: textFilter(),
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
        ),filter: textFilter(),
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
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "payment_for",
        text: "Payment To",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <strong>{paymentStatus.payment_for}</strong>
          </>
        ),filter: textFilter(),
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
      ),filter: textFilter(),
      headerStyle: { backgroundColor: '#DCDCDC' },
      },
      {
        dataField: "amount",
        text: "Amount",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
        <div className="text-end">
                <strong>{Math.abs(paymentStatus.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>            </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
        style: { backgroundColor: '	#F0F0F0' },
      },
      {
        dataField: "cheque_no",
        text: "Cheque/Online Ref#",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <span>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + paymentStatus.deposit_copy,
                }}
                target="_blank"
              >
                              <strong>{paymentStatus.cheque_no}</strong>

              </Link>

            </span>

          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
      // {
      //   dataField: "deposited_at",
      //   text: "Deposited Date",
      //   sort: true,
      // },
      
      {
        dataField: "bank",
        text: "Bank/Account#",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <span>
              <span>
                {paymentStatus.bank_name},{" "}
                {paymentStatus.account_no}
              </span>
            </span>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
     
      // {
      //   dataField: "is_settled",
      //   text: "Is Settled",
      //   sort: true,
      // },
      // {
      //   dataField: "verified_by",
      //   text: "Verified By",
      //   sort: true,
      // },
      {
        dataField: "cleared_at",
        text: "Cleared Date",
        sort: true,
        formatter: (cellContent, approvedInPayment) => {
          const date = new Date(approvedInPayment.cleared_at);
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
      //   text: "Slip",
      //   sort: true,
      //   formatter: (cellContent, approvedInPayment) => (
      //     <>
      //       <Link
      //         to={{
      //           pathname:
      //             process.env.REACT_APP_BACKENDURL +
      //             approvedInPayment.deposit_slip,
      //         }}
      //         target="_blank"
      //       >
      //         View Slip
      //       </Link>
      //     </>
      //   ),
      // },
      // {
      //   dataField: "status",
      //   text: "Status",
      //   sort: true,
      // },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Action",
        formatter: (cellContent, approvedInPayment) => (
            <div className="d-flex gap-3">
                <button
      type="submit"
      className="btn btn-danger save-user"
      onClick={() => this.onClickDelete(approvedInPayment)}

    >
      Delete
    </button>
            </div>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
    },
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Comments",
        formatter: (cellContent, approvedInPayment) => (
                  <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-financeadmin/${approvedInPayment.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
    ];
    const { approvedInPayments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetApprovedInPayments,
    } = this.props;
    const approvedInPayment = this.state.approvedInPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: approvedInPayments.length, // replace later with size(approvedInPayments),
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
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Payments In with Approvel Status | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Payments" breadcrumbItem="MIF and MOF with status is equal to Cleared." />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={approvedInPayments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={approvedInPayments}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                <div className="ms-2 mb-4">
                                                                <div>
                                      <Label for="main_lab_appointments" className="form-label">
                                      <strong>Select MIF/ MOF</strong>
                                      </Label>
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleSelectChange}
                                        
                                      >
                                        <option value="Payment Out Cleared">MOF Cleared</option>
                                        <option value="Payment In Cleared">MIF Cleared</option>
                                        <option value="Payment In Pending">MIF Pending Clearance</option>
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
                                      // striped={true}
                                      columns={columns}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={ filterFactory()}

                                    />
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

PaymentStatussList.propTypes = {
  match: PropTypes.object,
  approvedInPayments: PropTypes.array,
  className: PropTypes.any,
  onGetApprovedInPayments: PropTypes.func,
  history: PropTypes.any,
  onDeletePaymentout: PropTypes.func,

};

const mapStateToProps = ({ financeAdmin }) => ({
  approvedInPayments: financeAdmin.approvedInPayments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetApprovedInPayments: id => dispatch(getApprovedInPayments(id)),
  onDeletePaymentout: paymentCreatedStatus => dispatch(deletePaymentout(paymentCreatedStatus)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
