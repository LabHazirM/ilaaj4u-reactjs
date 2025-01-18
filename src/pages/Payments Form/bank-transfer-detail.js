import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";

import {
  Container,
  Row,
  Col,
  Table,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Card,
  FormGroup,
  Label,
  CardBody,
  CardTitle,
  Alert,
} from "reactstrap";

import classnames from "classnames";

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
  getBanks,
  getBankAccounts,
  addNewBankTransfer,
  getBankTransfer
} from "store/banktransferdetails/actions";

import { isEmpty, size } from "lodash";
import ConfirmModal from "components/Common/ConfirmModal";
import "assets/scss/table.scss";

class BankTransfersForm extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      bankTransfers: [],
      bankTransfer: "",
      modal: false,
      addmodal: false,
      confirmModal: false,
      id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      transfer_type: "",
      deposit_type: "",
      withdraw_type: "",
      bankaccount_id: "",
      from_bankaccount_id: "",
      bank_id: "",
      amount: "",
      payment_datetime: "",
      mode: "Cheque",
      cheque_no: "",
      payment_copy: "",
      deposit_copy: "",
      clearence_datetime: "",
      deposit_datetime: "",
      status: "",
      comments: "",
      checkedoutData: "",
      successMessage: "",
    };
    // this.toggleTab = this.toggleTab.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
  }

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

  handleSubmitClicks = () => {
    this.setState({
      bankTransfer: {
        transfer_type: this.state.transfer_type,
        deposit_type: this.state.deposit_type,
        withdraw_type: this.state.withdraw_type,
        bankaccount_id: this.state.bankaccount_id,
        from_bankaccount_id: this.state.from_bankaccount_id,
        amount: this.state.amount,
        mode: this.state.mode,
        payment_datetime: this.state.payment_datetime,
        clearence_datetime: this.state.clearence_datetime,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        payment_copy: this.state.payment_copy,
        deposit_datetime: this.state.deposit_datetime,
        status: "Approved",
        comments: this.state.comments,
      },
    });
  
    // API call to create a new bankTransfer record
    const { onAddNewBankTransfer } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewBankTransfer(this.state.bankTransfer, this.state.user_id)
      );
    }, 2000);
    setTimeout(() => {
        this.props.history.push("/inter-bank-details-list");
    }, 2000)
  };

  
  
  handleProceedClick = () => {
    this.setState({
      bankTransfer: {
        transfer_type: this.state.transfer_type,
        deposit_type: this.state.deposit_type,
        withdraw_type: this.state.withdraw_type,
        bankaccount_id: this.state.bankaccount_id,
        from_bankaccount_id: this.state.from_bankaccount_id,
        amount: this.state.amount,
        mode: this.state.mode,
        payment_datetime: this.state.payment_datetime,
        clearence_datetime: this.state.clearence_datetime,
        cheque_no: this.state.cheque_no,
        deposit_copy: this.state.deposit_copy,
        payment_copy: this.state.payment_copy,
        deposit_datetime: this.state.deposit_datetime,
        status: "Cleared",
        comments: this.state.comments,
      },
    });

    // API call to get the checkout items
    const { onAddNewBankTransfer } = this.props;
    setTimeout(() => {
      console.log(
        onAddNewBankTransfer(this.state.bankTransfer, this.state.user_id)
        
      );
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 2000);
    setTimeout(() => {
      this.props.history.push("/inter-bank-details-list");
  }, 2000)
  };

  componentDidMount() {
    const { banks, onGetbanks } = this.props;
    if (banks && !banks.length) {
      onGetbanks();
    }
    this.setState({ banks });

    const { bankAccounts, onGetbankAccounts } = this.props;
    if (bankAccounts && !bankAccounts.length) {
      onGetbankAccounts();
    }
    this.setState({ bankAccounts });

    const { bankTransfers, onGetBankTransfer } = this.props;
    if (bankTransfers && !bankTransfers.length) {
      onGetBankTransfer(this.props.match.params.id);
    }
    this.setState({ bankTransfers });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // Select
  handleSelectGroup = selectedGroup => {
    this.setState({ bankTransfer: selectedGroup.value });
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { bankTransfers } = this.props;
    if (
      !isEmpty(bankTransfers) &&
      size(prevProps.bankTransfers) !== size(bankTransfers)
    ) {
      this.setState({ bankTransfers: {}, isEdit: false });
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

  render() {
    const { SearchBar } = Search;

    const { bankTransfers } = this.props;


    // const { units } = this.props;

    const { onAddNewBankTransfer, onGetBankTransfer } =
      this.props;
    const bankTransfer = this.state.bankTransfer;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: bankTransfers.length, // replace later with size(bankTransfers),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const { bankAccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankAccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        if (bankAccounts[i].account_type != "DONATION") {
          bankaccountList.push(
            {
              label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no}`,
              value: `${bankAccounts[i].id}`,
            }
          );}
      }
    }

    const { banks } = this.props;
    const bankList = [];
    for (let i = 0; i < banks.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankAccounts.length; j++) {
      //   if (banks[i].id == bankAccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankList.push({
          label: banks[i].name,
          value: banks[i].id,
        });
      }
    }


    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank Transfer Details| Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Form" breadcrumbItem="Bank Transfer Details" />
            <Formik>
              <div className="checkout-tabs">
              {this.state.successMessage && <div>{this.state.successMessage}</div>}
                <Row>
                  <Col lg="1" sm="1">
                  </Col>
                  <Col lg="10" sm="9">
                    <Card>
                      <CardBody>
                        <div>
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Transfer Type
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="transfer_type"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  transfer_type: e.target.value,
                                })
                              }
                              defaultValue={this.state.transfer_type}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Transfer Type
                                ---
                              </option>
                              <option value="Deposit">Deposit</option>
                              <option value="Interbank Transfer">Interbank Transfer</option>
                              <option value="Withdraw">Withdraw</option>

                            </select>

                          </FormGroup>
                          {this.state.transfer_type == "Deposit" ? (
                             <FormGroup className="mb-0">
                             <Label htmlFor="cardnumberInput" className="fw-bolder">
                               Deposit Type
                               <span
                                 style={{ color: "#f46a6a" }}
                                 className="font-size-18"
                               >
                                 *
                               </span>
                             </Label>
                             <select
                               name="deposit_type"
                               component="select"
                               onChange={e =>
                                 this.setState({
                                   deposit_type: e.target.value,
                                 })
                               }
                               defaultValue={this.state.deposit_type}
                               className="form-select"
                             >
                               <option
                                 value=""
                               >
                                 --- Please select the Deposit Type
                                 ---
                               </option>
                               <option value="Loan Return">Loan Return</option>
                               <option value="Asset Sale">Asset Sale</option>
                               <option value="Insurance Claim">Insurance Claim</option>
                               <option value="Investments">Investments</option>
                               <option value="Others">Others</option>
 
 
                             </select>
 
                           </FormGroup>
                          ) : null}
                          {this.state.transfer_type == "Withdraw" ? (
                             <FormGroup className="mb-0">
                             <Label htmlFor="cardnumberInput" className="fw-bolder">
                               Withdraw Type
                               <span
                                 style={{ color: "#f46a6a" }}
                                 className="font-size-18"
                               >
                                 *
                               </span>
                             </Label>
                             <select
                               name="withdraw_type"
                               component="select"
                               onChange={e =>
                                 this.setState({
                                   withdraw_type: e.target.value,
                                 })
                               }
                               defaultValue={this.state.withdraw_type}
                               className="form-select"
                             >
                               <option
                                 value=""
                               >
                                 --- Please select the withdraw Type
                                 ---
                               </option>
                               <option value="Loan">Loan</option>
                               <option value="Tax">Tax</option>
                               <option value="Legal and Professional Expenses">Legal and Professional Expenses</option>
                               <option value="Investments">Investments</option>
                               <option value="Utilities">Utilities</option>
                               <option value="Salary and Wages">Salary and Wages</option>
                               <option value="Rent">Rent</option>
                               <option value="Marketing">Marketing</option>
                               <option value="Insurance and Securities">Insurance and Securities</option>
                               <option value="Employee Expense">Employee Expense</option>
                               <option value="Donation and Charity">Donation and Charity</option>
                               <option value="Delivery Expense">Delivery Expense</option>
                               <option value="Telecommunication">Telecommunication</option>
                               <option value="Travel and Tours">Travel and Tours</option>
                               <option value="Others">Others</option>
                             </select>
 
                           </FormGroup>
                          ) : null}

                          {this.state.transfer_type == "Interbank Transfer" ? (
                             <FormGroup className="mb-0">
                             <Label htmlFor="cardnumberInput" className="fw-bolder">
                               Mode
                               <span
                                 style={{ color: "#f46a6a" }}
                                 className="font-size-18"
                               >
                                 *
                               </span>
                             </Label>
                             <select
                               name="mode"
                               component="select"
                               onChange={e =>
                                 this.setState({
                                   mode: e.target.value,
                                 })
                               }
                               defaultValue={this.state.mode}
                               className="form-select"
                             >
                               <option
                                 value=""
                               >
                                 --- Please select the Mode Type
                                 ---
                               </option>
                               <option value="Cheque">Cheque</option>
                               <option value="Online">Online</option>
                               <option value="Bank Form">Bank Form</option>

                             </select>
 
                           </FormGroup>
                          ) : null}
                          {this.state.transfer_type == "Deposit" || this.state.transfer_type == "Withdraw" ? (
                             <FormGroup className="mb-0">
                             <Label htmlFor="cardnumberInput" className="fw-bolder">
                               Mode
                               <span
                                 style={{ color: "#f46a6a" }}
                                 className="font-size-18"
                               >
                                 *
                               </span>
                             </Label>
                             <select
                               name="mode"
                               component="select"
                               onChange={e =>
                                 this.setState({
                                   mode: e.target.value,
                                 })
                               }
                               defaultValue={this.state.mode}
                               className="form-select"
                             >
                               <option
                                 value=""
                               >
                                 --- Please select the Mode Type
                                 ---
                               </option>
                               <option value="Cheque">Cash</option>
                               <option value="Cheque">Cheque</option>
                               <option value="Online">Online</option>
                               <option value="Bank Form">Bank Form</option>

                             </select>
 
                           </FormGroup>
                          ) : null}
                         
                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Amount
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="number"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Amount"
                              name="amount"
                              onChange={e =>
                                this.setState({
                                  amount: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          {this.state.transfer_type == "Interbank Transfer"  || this.state.transfer_type == "Withdraw" ? (
                               bankTransfer.from_bankaccount_id &&
                                bankTransfer.from_bankaccount_id ? (
                                <div className="mb-3">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name</Label>
    
                                  <Field
                                    name="from_bankaccount_id"
                                    as="select"
                                    defaultValue={
                                      bankTransfer.from_bankaccount_id
                                    }
                                    className="form-control"
                                    readOnly={true}
                                    multiple={false}
                                  >
                                    <option
                                      key={
                                        bankTransfer.from_bankaccount_id
                                      }
                                      value={
                                        bankTransfer.from_bankaccount_id
                                      }
                                    >
                                      {
                                        bankTransfer.account_no
    
                                      }
                                    </option>
                                  </Field>
                                </div>
                              ) : (
                                <div className="mb-3 select2-container">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name (From)</Label>
    
                                  <Select
                                    name="from_bankaccount_id"
                                    component="Select"
                                    onChange={selectedGroup =>
                                      this.setState({
                                        from_bankaccount_id:
                                          selectedGroup.value,
                                      })
                                    }
                                    className={
                                      "defautSelectParent" +
                                      (!this.state.from_bankaccount_id
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
                                          .state.from_bankaccount_id
                                          ? "#f46a6a"
                                          : "#ced4da",
                                      }),
                                    }}
                                    options={bankaccountList}
                                    placeholder="Select Bank Account..."
                                  />
                                  <div className="invalid-feedback">
                                    Please select your Bank Account
                                  </div>
                                </div>
                              )
                          ) : null}

                          {this.state.transfer_type == "Interbank Transfer" ? (
                               bankTransfer.bankaccount_id &&
                                bankTransfer.bankaccount_id ? (
                                <div className="mb-3">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name</Label>
    
                                  <Field
                                    name="bankaccount_id"
                                    as="select"
                                    defaultValue={
                                      bankTransfer.bankaccount_id
                                    }
                                    className="form-control"
                                    readOnly={true}
                                    multiple={false}
                                  >
                                    <option
                                      key={
                                        bankTransfer.bankaccount_id
                                      }
                                      value={
                                        bankTransfer.bankaccount_id
                                      }
                                    >
                                      {
                                        bankTransfer.account_no
    
                                      }
                                    </option>
                                  </Field>
                                </div>
                              ) : (
                                <div className="mb-3 select2-container">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name (To)</Label>
    
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
                                  <div className="invalid-feedback">
                                    Please select your Bank Account
                                  </div>
                                </div>
                              )
                          ) : null}
                          
                          {this.state.transfer_type == "Deposit" ? (
                               bankTransfer.bankaccount_id &&
                                bankTransfer.bankaccount_id ? (
                                <div className="mb-3">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name</Label>
    
                                  <Field
                                    name="bankaccount_id"
                                    as="select"
                                    defaultValue={
                                      bankTransfer.bankaccount_id
                                    }
                                    className="form-control"
                                    readOnly={true}
                                    multiple={false}
                                  >
                                    <option
                                      key={
                                        bankTransfer.bankaccount_id
                                      }
                                      value={
                                        bankTransfer.bankaccount_id
                                      }
                                    >
                                      {
                                        bankTransfer.account_no
    
                                      }
                                    </option>
                                  </Field>
                                </div>
                              ) : (
                                <div className="mb-3 select2-container">
                                  <Label
                                    className="col-form-label fw-bolder"
                                  >
                                    Bank Account Name </Label>
    
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
                                  <div className="invalid-feedback">
                                    Please select your Bank Account
                                  </div>
                                </div>
                              )
                          ) : null}


                          {this.state.transfer_type == "Interbank Transfer" || this.state.transfer_type == "Withdraw" ? (
                             <FormGroup className="mt-4 mb-0">
                             <Label htmlFor="cardnameInput" className="fw-bolder">
                               Cheque/TT #
                               <span
                                 style={{ color: "#f46a6a" }}
                               // className="font-size-18"
                               >
                                 *
                               </span>
                             </Label>
                             <Input
                               type="text"
                               className="form-control"
                               id="cardnumberInput"
                               placeholder="0000 0000 0000 0000"
                               name="cheque_no"
                               onChange={e =>
                                 this.setState({
                                   cheque_no: e.target.value,
                                 })
                               }
                             />
                           </FormGroup>
                          ) : null}

                            <FormGroup className=" mt-4 mb-0">
                              <Label htmlFor="expirydateInput" className="fw-bolder">
                                Payment Copy
                                <span
                                  style={{ color: "#f46a6a" }}
                                  className="font-size-18"
                                >
                                  *
                                </span>
                              </Label>
                              <Input
                                id="formFile"
                                name="payment_copy"
                                type="file"
                                multiple={false}
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={e => {
                                  this.setState({
                                    payment_copy:
                                      e.target.files[0],
                                  });
                                }}
                                // className="form-control is-invalid"
                                className={
                                  "form-control" +
                                  (this.state.payment_copy.length >
                                    0 && !this.state.payment_copy
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                            </FormGroup>

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Payment DateTime
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
                              name="payment_datetime"
                              type="datetime-local"
                              // min={new Date(
                              //   new Date().toString().split("GMT")[0] +
                              //   " UTC"
                              // )
                              //   .toISOString()
                              //   .slice(0, -8)}
                                className="form-control"
                                onChange={e =>
                                this.setState({
                                  payment_datetime:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          {this.state.transfer_type == "Interbank Transfer" || 
                            this.state.transfer_type == "Deposit" ? (
                              <FormGroup className=" mt-4 mb-0">
                              <Label htmlFor="expirydateInput" className="fw-bolder">
                                Deposit Copy
                                <span
                                  style={{ color: "#f46a6a" }}
                                  className="font-size-18"
                                >
                                  *
                                </span>
                              </Label>
                              <Input
                                id="formFile"
                                name="deposit_copy"
                                type="file"
                                multiple={false}
                                accept=".jpg,.jpeg,.png,.pdf"
                                onChange={e => {
                                  this.setState({
                                    deposit_copy:
                                      e.target.files[0],
                                  });
                                }}
                                // className="form-control is-invalid"
                                className={
                                  "form-control" +
                                  (this.state.deposit_copy.length >
                                    0 && !this.state.deposit_copy
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                            </FormGroup>
                          ) : null}

                          {this.state.transfer_type == "Interbank Transfer" || 
                            this.state.transfer_type == "Deposit" ? (
                            <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Deposit DateTime
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
                              name="deposit_datetime"
                              type="datetime-local"
                              // min={new Date(
                              //   new Date().toString().split("GMT")[0] +
                              //   " UTC"
                              // )
                              //   .toISOString()
                              //   .slice(0, -8)}
                                className="form-control"
                                onChange={e =>
                                this.setState({
                                  deposit_datetime:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>
                          ) : null}


                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Clearence DateTime
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <input
                              name="clearence_datetime"
                              type="datetime-local"
                              // min={new Date(
                              //   new Date().toString().split("GMT")[0] +
                              //   " UTC"
                              // )
                              //   .toISOString()
                              //   .slice(0, -8)}
                                className="form-control"
                                onChange={e =>
                                this.setState({
                                  clearence_datetime:
                                    e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          {/* <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput">
                              Payment Method
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <select
                              name="mode"
                              component="select"
                              onChange={e =>
                                this.setState({
                                  mode: e.target.value,
                                })
                              }
                              defaultValue={this.state.mode}
                              className="form-select"
                            >
                              <option
                                value=""
                              >
                                --- Please select the Payment Type
                                ---
                              </option>
                              <option value="Cheque">Cheque</option>
                              <option value="Card">Online</option>

                            </select>
                          </FormGroup> */}

                          <FormGroup className="mb-0">
                            <Label htmlFor="cardnumberInput" className="fw-bolder">
                              Comments
                              <span
                                style={{ color: "#f46a6a" }}
                                className="font-size-18"
                              >
                                *
                              </span>
                            </Label>
                            <Input
                              type="text"
                              className="form-control"
                              id="cardnumberInput"
                              placeholder="Enter Comments"
                              name="comments"
                              onChange={e =>
                                this.setState({
                                  comments: e.target.value,
                                })
                              }
                            />
                          </FormGroup>

                          <Row className="mt-4">
                            <Col sm="6">
                              <div className="text-end">
                                <button
                                  component={Link}
                                  onClick={this.handleProceedClick}
                                  to="/dashboard-financeofficer"
                                  className="btn btn-success mb-4"
                                >
                                  <i className="mdi mdi-truck-fast me-1" /> Cleared{" "}
                                </button>
                              </div>
                            </Col>
                            <Col sm="6">
                              <button
                                to="/dashboard-financeofficer"
                                className="btn btn-danger"
                                onClick={this.handleSubmitClicks}
                              // disabled={this.state.carts.length == 0}
                              >
                                <i className="mdi mdi-truck-fast me-1" />
                                Approved
                              </button>
                            </Col>
                          </Row>

                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Formik>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

BankTransfersForm.propTypes = {
  match: PropTypes.object,
  banks: PropTypes.array,
  bankAccounts: PropTypes.array,
  history: PropTypes.object,
  // units: PropTypes.array,
  bankTransfers: PropTypes.array,
  className: PropTypes.any,
  onGetBankTransfer: PropTypes.func,
  // onGetUnits: PropTypes.func,
  onAddNewBankTransfer: PropTypes.func,
  onGetbanks: PropTypes.func,
  onGetbankAccounts: PropTypes.func,
};

const mapStateToProps = ({ bankTransfers }) => ({
  bankTransfers: bankTransfers.bankTransfers,
  banks: bankTransfers.banks,
  bankAccounts: bankTransfers.bankAccounts,


  // units: bankTransfers.units,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetbanks: () => dispatch(getBanks()),
  onGetbankAccounts: () => dispatch(getBankAccounts()),
  onGetBankTransfer: id => dispatch(getBankTransfer(id)),
  onAddNewBankTransfer: (bankTransfer, id) =>
    dispatch(addNewBankTransfer(bankTransfer, id)),

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BankTransfersForm)); 
