import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Select from "react-select";
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
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getBankaccounts,
  updateBankaccount,
} from "store/bankaccounts/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class BanksList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      bankaccounts: [],
      bankaccount: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      paymentStatusListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            <>{bankaccount.id}</>
          ), filter: textFilter(),
        },
        {
          dataField: "account_no",
          text: "Account No",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.account_no}</>
            // </Link>
          ), filter: textFilter(),

        },
        {
        dataField: "account_type",
        text: "Account Type",
        sort: true,
        formatter: (cellContent, bankaccount) => (
          // <Link to={`/bank-account-statements/${bankaccount.id}`}>
          <> {bankaccount.account_type}</>
          // </Link>
        ), filter: selectFilter({
          options: {
            '': 'All',
            'LABHAZIR': 'Labhazir',
            'DONATION': 'Donation',
          },
          defaultValue: 'All',
        }),
      },
        {
          dataField: "categorey",
          text: "Category",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> 
              {bankaccount.categorey == "PERSONAL" ? (
              "personal"

              ) : bankaccount.categorey == "SAVING" ? (
                "Saving"

              ) : bankaccount.categorey == "CURRENT" ? (
                "Current"
              ) : null}
            </>
            // </Link>
          ), filter: selectFilter({
            options: {
              '': 'All',
              'PERSONAL': 'Personal',
              'SAVING': 'Saving',
              'CURRENT': 'Current',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: "currency",
          text: "Currency",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> 
            {/* {bankaccount.currency} */}
            {bankaccount.currency == "RUPEESS" ? (
              "Rs"

              ) : bankaccount.currency == "DOLLAR" ? (
                "Dollar"

              ) : bankaccount.currency == "EURO" ? (
                "Euro"
              ) : null}
            </>
            // </Link>
          ), filter: selectFilter({
            options: {
              '': 'All',
              'RUPEESS': 'Rs',
              'DOLLAR': 'Dollar',
              'EURO': 'Euro',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: "opening_balance",
          text: "Opening Balance",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            <div className="text-end">
              <> {bankaccount.opening_balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</>
            </div>), filter: textFilter(),
        },
        {
          dataField: "creating_at",
          text: "Created At",
          sort: true,
          formatter: (cellContent, bank) => {
            const date = new Date(bank.creating_at);
            const day = date.getDate();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
        
            return (
                <p className="text-muted mb-0">
                    {`${day}-${month}-${year}`}
                </p>
            );
        },filter: textFilter(),
        },
        {
          dataField: "city",
          text: "Bank City",
          sort: true,
          formatter: (cellContent, bank) => (
            // <Link to={`/bank-account-statements/${bank.id}`}>
            <> {bank.city}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "address",
          text: "Bank Address",
          sort: true,
          formatter: (cellContent, bank) => (
            // <Link to={`/bank-account-statements/${bank.id}`}>
            <> {bank.address}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "branch_no",
          text: "Bank Branch No",
          sort: true,
          formatter: (cellContent, bank) => (
            // <Link to={`/bank-account-statements/${bank.id}`}>
            <> {bank.branch_no}</>
            // </Link>
          ), filter: textFilter(),
        },
        {
          dataField: "status",
          text: "Status",
          sort: true,
          formatter: (cellContent, bankaccount) => (
            // <Link to={`/bank-account-statements/${bankaccount.id}`}>
            <> {bankaccount.status}</>
            // </Link>
          ), filter: selectFilter({
            options: {
              '': 'All',
              'ACTIVE': 'Active',
              'IN_ACTIVE': 'In Active',
            },
            defaultValue: 'All',
          }),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, bankaccount) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handlePaymentStatusClick(e, bankaccount)
                  }
                ></i>
              </Link>
              </Tooltip>

            </div>
          ),
        },
      ],
    };
    this.handlePaymentStatusClick =
      this.handlePaymentStatusClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePaymentStatusClicks =
      this.handlePaymentStatusClicks.bind(this);
  }
  componentDidMount() {
    const { bankaccounts, onGetBankaccounts } = this.props;
    onGetBankaccounts(this.state.user_id);
    this.setState({ bankaccounts });

  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      bankaccount: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { bankaccounts } = this.props;
    if (
      !isEmpty(bankaccounts) &&
      size(prevProps.bankaccounts) !== size(bankaccounts)
    ) {
      this.setState({ bankaccounts: {}, isEdit: false });
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
      bankaccount: {
        id: arg.id,
        // deposited_at: arg.deposited_at,
        status: arg.status,
        account_no: arg.account_no,
        // phone: arg.phone,
        // registered_by: arg.registered_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;


    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateBankaccount,
      onGetBankaccounts,
    } = this.props;
    const bankaccount = this.state.bankaccount;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 100, // replace later with size(bankaccounts),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    const { bankaccounts } = this.props;
    const bankaccountList = [];
    for (let i = 0; i < bankaccounts.length; i++) {
      let flag = 0;
      // for (let j = 0; j < bankaccounts.length; j++) {
      //   if (banks[i].id == bankaccounts[j].bank_id) {
      //     flag = 1;
      //   }
      // }
      if (!flag) {
        bankaccountList.push(
          {
            label: `${bankaccounts[i].bank_name} - ${bankaccounts[i].account_no}`,
            value: `${bankaccounts[i].id}`,
          }
        );
      }
    }

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Bank Accounts List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Bank Accounts List"
              breadcrumbItem="Bank Accounts List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={bankaccounts}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={bankaccounts}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">

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
                                          ? "Edit Bank Account"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            account_no:
                                              (this.state.bankaccount &&
                                                this.state.bankaccount
                                                  .account_no) ||
                                              "",

                                            status:
                                              (this.state.bankaccount &&
                                                this.state.bankaccount
                                                  .status) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            deposit_slip: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload Payment Slip"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            const updateBankaccount =
                                            {
                                              id: bankaccount.id,
                                              account_no: values.account_no,
                                              status:
                                                values.status,

                                            };

                                            // update PaymentStatus
                                            onUpdateBankaccount(
                                              updateBankaccount
                                            );
                                            setTimeout(() => {
                                              onGetBankaccounts(
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
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Account No
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="account_no"
                                                      type="text"
                                                      readOnly={true}
                                                      // className="form-control"
                                                      className={
                                                        "form-control" +
                                                        (errors.account_no &&
                                                          touched.account_no
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          bankaccount: {
                                                            id: bankaccount.id,
                                                            account_no:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      value={
                                                        this.state
                                                          .bankaccount
                                                          .account_no
                                                      }
                                                    >
                                                    </Input>
                                                    <ErrorMessage
                                                      name="account_no"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Status Type
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="status"
                                                      as="select"
                                                      className={
                                                        "form-control" +
                                                        (errors.status &&
                                                          touched.status
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .bankaccount
                                                          .status
                                                      }
                                                    >
                                                      <option value="ACTIVE">Active</option>
                                                      <option value="IN_ACTIVE">In_Active</option>

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
                                    </Modal>
                                  </div>
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

BanksList.propTypes = {
  match: PropTypes.object,
  bankaccounts: PropTypes.array,
  className: PropTypes.any,
  onGetBankaccounts: PropTypes.func,
  onUpdateBankaccount: PropTypes.func,
  history: PropTypes.any,

};

const mapStateToProps = ({ bankaccounts }) => ({
  bankaccounts: bankaccounts.bankaccounts,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBankaccounts: id => dispatch(getBankaccounts(id)),
  onUpdateBankaccount: bankaccount =>
    dispatch(updateBankaccount(bankaccount)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BanksList));
