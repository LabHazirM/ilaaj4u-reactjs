import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
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
    getPaymentStatuss,
    updatePaymentInBouncedStatus,
    getBankAccounts,
    deletePaymentout,

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
            payment_status: "",
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
        this.onClickDelete = this.onClickDelete.bind(this);

    }
    // The code for converting "image source" (url) to "Base64"
    toDataURL = url =>
        fetch(url)
            .then(response => response.blob())
            .then(
                blob =>
                    new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    })
            );

    // The code for converting "Base64" to javascript "File Object"
    dataURLtoFile = (dataurl, filename) => {
        var arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    componentDidMount() {

        const { bankAccounts, onGetbankAccounts } = this.props;
        if (bankAccounts && !bankAccounts.length) {
            onGetbankAccounts();
        }
        this.setState({ bankAccounts });

        const { paymentStatuss, onGetPaymentStatuss } = this.props;
        onGetPaymentStatuss(this.state.user_id);
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
    
      onClickDelete = paymentStatuss => {
        this.setState({ paymentStatuss: paymentStatuss });
        this.setState({ deleteModal: true });
      };
      handleDeletePathologist = () => {
        const { onDeletePaymentout, onGetPaymentStatuss } = this.props;
        const { paymentStatuss } = this.state;
        if (paymentStatuss.id !== undefined) {
          onDeletePaymentout(paymentStatuss);
          setTimeout(() => {
            onGetPaymentStatuss(this.state.user_id);
          }, 1000);
          this.setState({ deleteModal: false });
        }
      };

    handlePaymentStatusClick = (e, arg) => {
        this.setState({
            paymentStatus: {
                id: arg.id,
                verified_by: arg.verified_by,
                bankaccount_id: arg.bankaccount_id,
                deposit_slip: arg.deposit_slip,
                payment_for: arg.payment_for,
                payment_status: "Pending Clearance",
            },
            isEdit: true,
        });

        this.toggle();
    };

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
                            {paymentStatus.donor_name}{" "}
                            {paymentStatus.lab_name}{" "}
                            {paymentStatus.advertisement_title}
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
                        {paymentStatus.cheque_image && paymentStatus.cheque_no
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
                            : paymentStatus.cheque_image && paymentStatus.refered_no
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
                ),
                filter: textFilter({
                    placeholder: "Filter Cheque/Ref#",
                    getFilter: (filter) => ({
                        // Custom filter logic for both fields
                        comparator: (filterValue, cellValue, row) => {
                            return (
                                row.cheque_no.includes(filterValue) ||
                                row.refered_no.includes(filterValue)
                            );
                        },
                    }),
                }),
                headerStyle: { backgroundColor: '#DCDCDC' },
            },
            {
                dataField: "amount",
                text: "Amount",
                sort: true,
                formatter: (cellContent, paymentStatus) => (
                    <>
                        <div className="text-end">
                            <strong>{paymentStatus.amount}</strong></div>
                    </>
                ), filter: textFilter(),
                headerStyle: { backgroundColor: '#DCDCDC' },
                style: { backgroundColor: '	#F0F0F0' },
            },

            // {
            // dataField: "bank",
            // text: "Cheque/Reffer#",
            // sort: true,
            // formatter: (cellContent, paymentStatus) => (
            // <>
            // <span>
            // <span>
            // {paymentStatus.bank_name},{" "}
            // {paymentStatus.account_no}
            // </span>
            // </span>
            // </>
            // ),
            // },
            {
                dataField: "paid_at",
                text: "Payment Received Date",
                sort: true,
                formatter: (cellContent, paymentStatus) => {
                    const date = new Date(paymentStatus.paid_at);
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
                text: "Action",
                formatter: (cellContent, paymentStatus) => (
                    <div className="d-flex gap-3">
                        <button
                            type="submit"
                            className="btn btn-success save-user"
                            onClick={e => this.handlePaymentStatusClick(e, paymentStatus)}

                        >
                            Update
                        </button>
                        <button
              type="submit"
              className="btn btn-danger save-user"
              onClick={() => this.onClickDelete(paymentStatus)}

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
                formatter: (cellContent, paymentStatus) => (
                        <Link
                          className="fas fa-comment font-size-18"
                          to={`/activity-log-finance/${paymentStatus.id}`}
                          ></Link>
                ),
                headerStyle: { backgroundColor: '#DCDCDC' },
              },
        ];
        const { SearchBar } = Search;
        const isDonation = this.state.paymentStatus.payment_for === "Donor";
        // const isamount = this.state.paymentStatus.amount

        const { paymentStatuss } = this.props;

        const { isEdit, deleteModal } = this.state;

        const {
            onUpdatePaymentInBouncedStatus,
            onGetPaymentStatuss,
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

        const { bankAccounts } = this.props;
        const bankaccountList = [];
        // for (let i = 0; i < bankAccounts.length; i++) {
        //     let flag = 0;
        //     if (!flag) {
        //         bankaccountList.push({
        //             label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no} - ${bankAccounts[i].account_type}`,
        //             value: `${bankAccounts[i].id}`,
        //         });
        //     }
        // }
        for (let i = 0; i < bankAccounts.length; i++) {
            if (isDonation) {
              if (bankAccounts[i].account_type === "DONATION") {
                bankaccountList.push({
                  label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no} - ${bankAccounts[i].account_type}`,
                  value: `${bankAccounts[i].id}`,
                });
              }
            } else {
              if (bankAccounts[i].account_type != "DONATION") {
                bankaccountList.push({
                  label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no} - ${bankAccounts[i].account_type}`,
                  value: `${bankAccounts[i].id}`,
                });
              }
            }
      
          }

        // const bankaccountList = bankAccounts
        // .filter(bankaccount => {
        //   if (isDonation) {
        //     return bankaccount.current_balance > Math.abs(this.state.amount) && bankaccount.account_type === "DONATION";
        //   } else {
        //     return bankaccount.current_balance > Math.abs(this.state.amount) && bankaccount.account_type !== "DONATION";
        //   }
        // })
        // .map(bankaccount => ({
        //   label: `(Bank Name: ${bankaccount.bank_name}) - (Account No: ${bankaccount.account_no}) - (Account Type: ${bankaccount.account_type}) - (Current Balance: ${bankaccount.current_balance})`,
        //   value: bankaccount.id,
        // }));

        return (
            <React.Fragment>
                <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
                <div className="page-content">
                    <MetaTags>
                        <title>MIF List | Lab Hazir</title>
                    </MetaTags>
                    <Container fluid>
                        {/* Render Breadcrumbs */}
                        <Breadcrumbs
                            title="List"
                            breadcrumbItem="MIF Created"
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
                            <strong>Money In Form Statuses</strong>
                        </Label>
                        <select
                            className="form-control select2"
                            title="main_lab_appointments"
                            name="main_lab_appointments"
                            onChange={this.handleSelectChange}
                        >
                            <option value="Created">Created</option>
                            <option value="Pending Clearence">Pending Clearence</option>
                            <option value="Cleared">Cleared</option>
                            <option value="Bounced">Bounced</option>
                        </select>
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
                                ? "Update MIF Created"
                                : "Add Quality Certificate"}
                        </ModalHeader>
                        <ModalBody>
                            <Formik
                                enableReinitialize={true}
                                initialValues={{
                                    hiddenEditFlag: isEdit,

                                    payment_for:
                                        (this.state &&
                                            this.state.payment_for) ||
                                        "",
                                    bankaccount_id:
                                        (this.state &&
                                            this.state.bankaccount_id) ||
                                        "",
                                    deposit_slip:
                                        (this.state &&
                                            this.state.paymentStatus
                                                .deposit_slip) ||
                                        "",
                                    verified_by:
                                        (this.state.paymentStatus &&
                                            this.state.paymentStatus
                                                .verified_by) ||
                                        "",
                                    payment_status:
                                        (this.state.paymentStatus &&
                                            this.state.paymentStatus
                                                .payment_status) ||
                                        "",
                                    deposited_at:
                                        (this.state &&
                                            this.state.deposited_at) ||
                                        "",

                                }}
                                validationSchema={Yup.object().shape({
                                    hiddentEditFlag: Yup.boolean(),
                                    deposit_slip: Yup.string().required(
                                    "Please upload the file of payment slip"
                                    ),
                                    bankaccount_id: Yup.string().required(
                                        "Please select your bank account"
                                    ),
                                    verified_by: Yup.string().required(
                                        "Please enter your name"
                                      ),
                                    deposited_at: Yup.string().required(
                                        "Please select date"
                                      ),
                                })}
                                onSubmit={values => {
                                    const updatePaymentInBouncedStatus =
                                    {
                                        id: paymentStatus.id,
                                        verified_by:
                                            values.verified_by,
                                        bankaccount_id: values.bankaccount_id,
                                        deposit_slip: values.deposit_slip,
                                        deposited_at: values.deposited_at,
                                        payment_status:
                                            values.payment_status,
                                    };

                                    // update PaymentStatus
                                    onUpdatePaymentInBouncedStatus(
                                        updatePaymentInBouncedStatus
                                    );
                                    setTimeout(() => {
                                        onGetPaymentStatuss(
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

                                                {paymentStatus.bankaccount_id &&
                                                    paymentStatus.bankaccount_id ? (
                                                    <div className="mb-3">
                                                        <Label
                                                            className="col-form-label"
                                                        >
                                                            Bank Account Name</Label>

                                                        <Field
                                                            name="bankaccount_id"
                                                            as="select"
                                                            defaultValue={
                                                                paymentStatus.bankaccount_id
                                                            }
                                                            className="form-control"
                                                            readOnly={true}
                                                            multiple={false}
                                                        >
                                                            <option
                                                                key={
                                                                    paymentStatus.bankaccount_id
                                                                }
                                                                value={
                                                                    paymentStatus.bankaccount_id
                                                                }
                                                            >
                                                                {
                                                                    paymentStatus.account_no

                                                                }
                                                            </option>
                                                        </Field>
                                                    </div>
                                                ) : (
                                                    <div className="mb-3 select2-container">
                                                        <Label
                                                            className="col-form-label"
                                                        >
                                                            Bank Account Name</Label>

                                                        <Select
                                                            name="bankaccount_id"
                                                            component="Select"
                                                            onChange={selectedGroup =>
                                                                this.setState({
                                                                    bankaccount_id:
                                                                        selectedGroup.value,
                                                                })
                                                            }
                                                            className={
                                                                "defautSelectParent" +
                                                                (!this.state.bankaccount_id
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
                                                                        .state.bankaccount_id
                                                                        ? "#f46a6a"
                                                                        : "#ced4da",
                                                                }),
                                                            }}
                                                            options={bankaccountList}
                                                            placeholder="Select Bank Account..."
                                                        />
                                                    </div>
                                                )}

                                                {/* Certificate field */}
                                                <div className="mb-3">
                                                    <Label htmlFor="expirydateInput">
                                                        Deposit Slip
                                                        <span
                                                            style={{ color: "#f46a6a" }}
                                                            className="font-size-18"
                                                        >
                                                            *
                                                        </span>
                                                    </Label>
                                                    <Input
                                                        id="formFile"
                                                        name="deposit_slip"
                                                        type="file"
                                                        multiple={false}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        // onChange={e => {
                                                        //     this.setState({
                                                        //         deposit_slip:
                                                        //             e.target.files[0],
                                                        //     });
                                                        // }}
                                                        onChange={e => {
                                                            this.setState({
                                                                paymentStatus: {
                                                                    id: paymentStatus.id,
                                                                    payment_status:
                                                                        paymentStatus.payment_status,
                                                                    deposited_at: paymentStatus.deposited_at,
                                                                    verified_by: paymentStatus.verified_by,

                                                                    deposit_slip:
                                                                        e.target.files[0],
                                                                },
                                                            });
                                                        }}
                                                          className={
                                                              "form-control" +
                                                              (errors.deposit_slip &&
                                                                  touched.deposit_slip
                                                                  ? " is-invalid"
                                                                  : "")
                                                          }
                                                      />
                                                      <ErrorMessage
                                                          name="deposit_slip"
                                                          component="div"
                                                          className="invalid-feedback"
                                                    />
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label">
                                                    Deposited By
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
                                                                    payment_status:
                                                                        paymentStatus.payment_status,
                                                                    deposited_at: paymentStatus.deposited_at,
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
                                                </div>
                                                <div className="mb-3">
                                      <Label htmlFor="cardnumberInput" className="fw-bolder">
                                      Deposit Date
                                        <span
                                          style={{ color: "#f46a6a" }}
                                          className="font-size-18"
                                        >
                                          *
                                        </span>
                                      </Label>
                                      <input
                                        name="deposited_at"
                                        type="datetime-local"
                                        max={new Date(
                                          new Date().toString().split("GMT")[0] +
                                          " UTC"
                                        )
                                          .toISOString()
                                          .slice(0, -8)}
                                        onChange={e =>
                                          this.setState({
                                            deposited_at:
                                              e.target.value,
                                          })
                                        }
                                        className={
                                            "form-control" +
                                            (errors.deposited_at &&
                                                touched.deposited_at
                                                ? " is-invalid"
                                                : "")
                                        }
                                    />
                                    <ErrorMessage
                                        name="deposited_at"
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
                                                        Submit
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
    bankAccounts: PropTypes.array,
    className: PropTypes.any,
    onGetPaymentStatuss: PropTypes.func,
    onUpdatePaymentInBouncedStatus: PropTypes.func,
    onGetbankAccounts: PropTypes.func,
    history: PropTypes.any,
    paymentStatuss: PropTypes.array,
    onDeletePaymentout: PropTypes.func,
};

const mapStateToProps = ({ paymentStatuss }) => ({
    paymentStatuss: paymentStatuss.paymentStatuss,
    bankAccounts: paymentStatuss.bankAccounts,
    paymentStatuss: paymentStatuss.paymentStatuss,


});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onGetbankAccounts: () => dispatch(getBankAccounts()),

    onGetPaymentStatuss: id => dispatch(getPaymentStatuss(id)),
    onUpdatePaymentInBouncedStatus: paymentStatus =>
        dispatch(updatePaymentInBouncedStatus(paymentStatus)),
    onDeletePaymentout: paymentCreatedStatus => dispatch(deletePaymentout(paymentCreatedStatus)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(PaymentStatussList));
