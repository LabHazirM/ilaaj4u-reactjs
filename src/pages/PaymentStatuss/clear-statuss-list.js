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
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { textFilter ,selectFilter} from 'react-bootstrap-table2-filter';

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getClearStatuss,
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
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",

    };
    // this.handlePaymentStatusClick =
    //   this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    // this.handlePaymentStatusClicks =
    //   this.handlePaymentStatusClicks.bind(this);
  }

  // // The code for converting "image source" (url) to "Base64"
  // toDataURL = url =>
  //   fetch(url)
  //     .then(response => response.blob())
  //     .then(
  //       blob =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     );

  // // The code for converting "Base64" to javascript "File Object"
  // dataURLtoFile = (dataurl, filename) => {
  //   var arr = dataurl.split(","),
  //     mime = arr[0].match(/:(.*?);/)[1],
  //     bstr = atob(arr[1]),
  //     n = bstr.length,
  //     u8arr = new Uint8Array(n);
  //   while (n--) {
  //     u8arr[n] = bstr.charCodeAt(n);
  //   }
  //   return new File([u8arr], filename, { type: mime });
  // };

  componentDidMount() {
    const { paymentStatuss, onGetClearStatuss } = this.props;
    onGetClearStatuss(this.state.user_id);
    this.setState({ paymentStatuss });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // handlePaymentStatusClicks = () => {
  //   this.setState({
  //     paymentStatus: "",
  //     deposit_slip: "",
  //     isEdit: false,
  //   });
  //   this.toggle();
  // };

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


  // handlePaymentStatusClick = (e, arg) => {
  //   this.setState({
  //     paymentStatus: {
  //       id: arg.id,
  //       deposit_at: arg.deposit_at,
  //       deposit_bank: arg.deposit_bank,
  //       deposit_slip: arg.deposit_slip,
  //       status: arg.status,
  //     },
  //     isEdit: true,
  //   });

  //   this.toggle();
  // };
  handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    // Perform navigation based on the selected value
    if (selectedValue === 'Created') {
      this.props.history.push('/payment-status');
    }
    if (selectedValue === 'Pending Clearence') {
        this.props.history.push('/payment-in-pending-clearence-status');
    }
    if (selectedValue === 'Cleared') {
    this.props.history.push('/clear-status');
    }
    if (selectedValue === 'Bounced') {
    this.props.history.push('/bounced-status');
    }
}

  render() {
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
          style: { backgroundColor: ' #ffe6cc' },
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
      {
        dataField: "menu",
        isDummyField: true,
        editable: false,
        text: "Comments",
        formatter: (cellContent, approvedInPayment) => (
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/activity-log-finance/${approvedInPayment.id}`}
                  ></Link>
        ),
        headerStyle: { backgroundColor: '#DCDCDC' },
      },
        // {
        //   dataField: "deposit_slip",
        //   text: "Deposit Slip",
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

    const { paymentStatuss } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onGetClearStatuss,
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
              breadcrumbItem="MIF Cleared"
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
                                        <option value="Cleared">Cleared</option>
                                        <option value="Created">Created</option>
                                        <option value="Pending Clearence">Pending Clearence</option>
                                        <option value="Bounced">Bounced</option>
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
                                      filter={ filterFactory() }
                                    />

                                    {/* <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "UpdateQuality Certificate"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            deposit_at:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .deposit_at) ||
                                              "",
                                            deposit_bank:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .deposit_bank) ||
                                              "",
                                            deposit_slip:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .deposit_slip) ||
                                              "",
                                            status:
                                              (this.state.paymentStatus &&
                                                this.state.paymentStatus
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            

                                            // deposit_at: Yup.string().when(
                                            //   "hiddenEditFlag",
                                            //   {
                                            //     is: hiddenEditFlag =>
                                            //       hiddenEditFlag == false, //just an e.g. you can return a function
                                            //     then: Yup.string().required(
                                            //       "Please upload deposit at"
                                            //     ),
                                            //   }
                                            // ),
                                             // Validation for logo based on type value
                                            // type: Yup.string(),
                                            // logo: Yup.mixed().test(
                                            //   "required",
                                            //   "Please upload logo",
                                            // ),

                                           
                                          })}
                                          onSubmit={values => {
                                            const updatePaymentStatus =
                                            {
                                              id: paymentStatus.id,
                                              deposit_at:
                                                values.deposit_at,
                                              deposit_bank: values.deposit_bank,
                                              deposit_slip: values.deposit_slip,
                                             
                                              status:
                                                values.status,
                                            };

                                          // update PaymentStatus
                                          onUpdatePaymentStatus(
                                            updatePaymentStatus
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
                                                   {/* Payment Cleared Date and Time */}

                                                  {/* <div className="mb-3">
                                                    <Label
                                                      for="Cleared at"
                                                    >
                                                      Cleared at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Cleared at"
                                                      name="Cleared at"
                                                      min={new Date(
                                                        new Date()
                                                          .toString()
                                                          .split("GMT")[0] +
                                                          " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            cleared_at:
                                                              e.target.value +
                                                              ":00Z",
                                                            // estimated_result_uploading_at:
                                                            //   paymentStatus.estimated_result_uploading_at,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.cleared_at &&
                                                        touched.cleared_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="cleared_at"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Varified By
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="verified_by"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .paymentStatus
                                                          .verified_by
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentStatus: {
                                                            id: paymentStatus.id,
                                                            status:
                                                              paymentStatus.status,
                                                            deposit_at: paymentStatus.verified_by,
                                                            deposit_slip: paymentStatus.deposit_slip,
                                                            verified_by:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.verified_by &&
                                                        touched.verified_by
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="verified_by"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}
                                                 
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
                                                            deposit_bank:
                                                              paymentStatus.status,
                                                            deposit_at: paymentStatus.deposit_bank,
                                                            deposit_slip: paymentStatus.deposit_slip,
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
                                    </Modal> */}
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
  onGetClearStatuss: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ paymentStatuss }) => ({
  paymentStatuss: paymentStatuss.paymentStatuss,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetClearStatuss: id => dispatch(getClearStatuss(id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PaymentStatussList));
