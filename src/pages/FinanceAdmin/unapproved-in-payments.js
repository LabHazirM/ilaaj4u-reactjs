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
  getUnapprovedInPayments,
} from "store/finance-admin/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PaymentStatussList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      unapprovedInPayments: [],
      unapprovedInPayment: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { unapprovedInPayments, onGetUnapprovedInPayments } = this.props;
    onGetUnapprovedInPayments(this.state.user_id);
    this.setState({ unapprovedInPayments });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { unapprovedInPayments } = this.props;
    if (
      !isEmpty(unapprovedInPayments) &&
      size(prevProps.unapprovedInPayments) !== size(unapprovedInPayments)
    ) {
      this.setState({ unapprovedInPayments: {}, isEdit: false });
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
    if (selectedValue === 'Approved') {
        this.props.history.push('/approved-in-payments');
    }
    if (selectedValue === 'Cleared') {
    this.props.history.push('/cleared-in-payments');
    }
    if (selectedValue === 'Unapproved') {
    this.props.history.push('/unapproved-in-payments');
    }
}

  render() {
    const columns=[
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
        dataField: "payment_for",
        text: "Payment From",
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
        dataField: "cheque_no",
        text: "Cheque/Ref#",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
            <>
                {paymentStatus.cheque_no && (
                    <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                        {paymentStatus.cheque_no}
                    </span>
                )}

                {paymentStatus.cheque_no && (
                    <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                        {paymentStatus.refered_no}
                    </span>
                )}
            </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },
    },
    
      {
        dataField: "amount",
        text: "Amount",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>              <div className="text-end">
            <strong>{paymentStatus.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong></div>
          </>
        ),filter: textFilter(),
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
      
      // {
      //   dataField: "is_settled",
      //   text: "Is Settled",
      //   sort: true,
      // },
      {
        dataField: "verified_by",
        text: "Deposited By",
        sort: true,
        formatter: (cellContent, paymentStatus) => (
          <>
            <strong>{paymentStatus.verified_by}</strong>
          </>
        ),filter: textFilter(),
        headerStyle: { backgroundColor: '#DCDCDC' },

      },
      {
        dataField: "cleared_at",
        text: "Cleared Date",
        sort: true,
        formatter: (cellContent, paymentStatus) => {
          const date = new Date(paymentStatus.cleared_at);
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
      // {
      //   dataField: "payment_status",
      //   text: "Status",
      //   sort: true,
      // },
      // {
      //   dataField: "menu",
      //   isDummyField: true,
      //   editable: false,
      //   text: "Action",
      //   formatter: (cellContent, paymentStatus) => (
      //     <div className="d-flex gap-3">
      //       <Link className="text-success" to="#">
      //         <i
      //           className="mdi mdi-pencil font-size-18"
      //           id="edittooltip"
      //           onClick={e =>
      //             this.handlePaymentStatusClick(e, paymentStatus)
      //           }
      //         ></i>
      //       </Link>
            
      //     </div>
      //   ),
      // },
    ];
    const { SearchBar } = Search;

    const { unapprovedInPayments } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetUnapprovedInPayments,
    } = this.props;
    const unapprovedInPayment = this.state.unapprovedInPayment;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: unapprovedInPayments.length, // replace later with size(unapprovedInPayments),
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
            <title>Payments In with Approvel Status | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Payments In"
              breadcrumbItem=" Approvel Status List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={unapprovedInPayments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={unapprovedInPayments}
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
                                        <option value="Unapproved">Unapproved</option>
                                        <option value="Cleared">Cleared</option>
                                        <option value="Approved">Approved</option>
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
                                      classes={"table align-middle "}
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
  unapprovedInPayments: PropTypes.array,
  className: PropTypes.any,
  onGetUnapprovedInPayments: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ financeAdmin }) => ({
  unapprovedInPayments: financeAdmin.unapprovedInPayments,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetUnapprovedInPayments: id => dispatch(getUnapprovedInPayments(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
