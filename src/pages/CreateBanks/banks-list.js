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
  getBanks,
  updateBank,
} from "store/createbank/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class BanksList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      banks: [],
      bank: "",
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
          formatter: (cellContent, bank) => (
            <>{bank.id}</>
          ),filter: textFilter(),
        },
        {
          dataField: "name",
          text: "Bank Name",
          sort: true,
          formatter: (cellContent, bank) => (
            <>
<span className="float-start">
{bank.name}
</span>
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "phone",
          text: "Bank Phone",
          sort: true,
          formatter: (cellContent, bank) => (
            <>
                {bank.phone}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "email",
          text: "Bank Email",
          sort: true,
          formatter: (cellContent, bank) => (
            <>
                {bank.email}
            </>
          ),filter: textFilter(),
        },
        // {
        //   dataField: "city",
        //   text: "Bank City",
        //   sort: true,
        //   formatter: (cellContent, bank) => (
        //     // <Link to={`/bank-account-statements/${bank.id}`}>
        //     <> {bank.city}</>
        //     // </Link>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "address",
        //   text: "Bank Address",
        //   sort: true,
        //   formatter: (cellContent, bank) => (
        //     // <Link to={`/bank-account-statements/${bank.id}`}>
        //     <> {bank.address}</>
        //     // </Link>
        //   ), filter: textFilter(),
        // },
        // {
        //   dataField: "branch_no",
        //   text: "Branch No",
        //   sort: true,
        //   formatter: (cellContent, bank) => (
        //     // <Link to={`/bank-account-statements/${bank.id}`}>
        //     <> {bank.branch_no}</>
        //     // </Link>
        //   ), filter: textFilter(),
        // },
        {
          dataField: "registered_by",
          text: "Registered By",
          sort: true,
          formatter: (cellContent, bank) => (
            <>
                {bank.registered_by}
            </>
          ),filter: textFilter(),
        },
        {
          dataField: "registered_at",
          text: "Registered At",
          sort: true,
          formatter: (cellContent, bank) => {
            const date = new Date(bank.registered_at);
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
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, bank) => (
            <div>
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handlePaymentStatusClick(e, bank)
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
  // The code for converting "image source" (url) to "Base64"
  toDataURL = url =>
    fetch(url)
      .then(response => response.blob())
      .then(
        blob =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.deposit_slip);
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
    const { banks, onGetBanks } = this.props;
    onGetBanks(this.state.user_id);
    this.setState({ banks });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePaymentStatusClicks = () => {
    this.setState({
      bank: "",
      deposit_slip: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { banks } = this.props;
    if (
      !isEmpty(banks) &&
      size(prevProps.banks) !== size(banks)
    ) {
      this.setState({ banks: {}, isEdit: false });
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
      bank: {
        id: arg.id,
        // deposited_at: arg.deposited_at,
        name: arg.name,
        email: arg.email,
        phone: arg.phone,
        registered_by: arg.registered_by,
      },
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { banks } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onUpdateBank,
      onGetBanks,
    } = this.props;
    const bank = this.state.bank;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: banks.length, // replace later with size(banks),
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
            <title>Banks List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Banks List"
              breadcrumbItem="Banks List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.paymentStatusListColumns}
                      data={banks}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.paymentStatusListColumns}
                          data={banks}
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
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                      filter={ filterFactory()}
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
                                          ? "Edit Bank Details"
                                          : "Add Quality Certificate"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            // deposited_at:
                                            //   (this.state.bank &&
                                            //     this.state.bank
                                            //       .deposited_at) ||
                                            //   "",
                                            // deposit_bank: (this.state && this.state.deposit_bank) || "",
                                            // deposit_slip: (this.state && this.state.deposit_slip) || "",
                                            // status: (this.state && this.state.status) || "",


                                            name:
                                              (this.state.bank &&
                                                this.state.bank
                                                  .name) ||
                                              "",
                                            phone:
                                              (this.state.bank &&
                                                this.state.bank
                                                  .phone) ||
                                              "",
                                            email:
                                              (this.state.bank &&
                                                this.state.bank
                                                  .email) ||
                                              "",
                                            registered_by:
                                              (this.state.bank &&
                                                this.state.bank
                                                  .registered_by) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                           
                                                //   deposit_slip: Yup.string().required(
                                                //   "Please upload the file of payment slip"
                                                // ),
                                             

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
                                             // Validation for logo based on type value
                                            // type: Yup.string(),
                                            // logo: Yup.mixed().test(
                                            //   "required",
                                            //   "Please upload logo",
                                            // ),

                                           
                                          })}
                                          onSubmit={values => {
                                            const updateBank =
                                            {
                                              id: bank.id,
                                              deposited_by:
                                                values.deposited_by,
                                              name: values.name,
                                              phone: values.phone,
                                              email:
                                                values.email,
                                                
                                            };

                                          // update PaymentStatus
                                          onUpdateBank(
                                            updateBank
                                          );
                                          setTimeout(() => {
                                            onGetBanks(
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
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Bank Name
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        type="text"
                                                      value={
                                                        this.state
                                                          .bank
                                                          .name}
                                                          onChange={e => {
                                                              this.setState({
                                                                bank: {
                                                                  id: bank.id,
                                                                  phone:
                                                                    bank.phone,
                                                                  email: bank.email,
                                                                  registered_by: bank.registered_by,
                                                                  name:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.name &&
                                                              touched.name
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                          
                                                      />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Phone
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        id="phone"
                                                        name="phone"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .bank
                                                            .phone}  
                                                            onChange={e => {
                                                              this.setState({
                                                                bank: {
                                                                  id: bank.id,
                                                                  name:
                                                                    bank.name,
                                                                  email: bank.email,
                                                                  registered_by: bank.registered_by,
                                                                  phone:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.phone &&
                                                              touched.phone
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                      />
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Email
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        name="email"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .bank
                                                            .email}  
                                                            onChange={e => {
                                                              this.setState({
                                                                bank: {
                                                                  id: bank.id,
                                                                  name:
                                                                    bank.name,
                                                                  phone: bank.phone,
                                                                  registered_by: bank.registered_by,
                                                                  email:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.email &&
                                                              touched.email
                                                                ? " is-invalid"
                                                                : "")
                                                            } 
                                                      />
                                                  </div>
                                                  
                                                  {/* <div className="mb-3">
                                                    <Label
                                                      className="col-form-label"
                                                    >
                                                      Registered By
                                                      <span
                                                        style={{ color: "#f46a6a" }}
                                                        className="font-size-18"
                                                      >
                                                        *
                                                      </span>
                                                    </Label>
                                                      <Input
                                                        name="registered_by"
                                                        type="text"
                                                        value={
                                                          this.state
                                                            .bank
                                                            .registered_by}
                                                              
                                                            onChange={e => {
                                                              this.setState({
                                                                bank: {
                                                                  id: bank.id,
                                                                  name:
                                                                    bank.name,
                                                                  phone: bank.phone,
                                                                  email: bank.email,
                                                                  registered_by:
                                                                    e.target.value,
                                                                },
                                                              });
                                                            }}
                                                            className={
                                                              "form-control" +
                                                              (errors.registered_by &&
                                                              touched.registered_by
                                                                ? " is-invalid"
                                                                : "")
                                                            }                                                             
                                                      />
                                                  </div> */}
                                                   {/* Certificate Expiry date field */}

                                                   {/* <div className="mb-3">
                                                    <Label
                                                      for="Deposit at"
                                                    >
                                                      Deposit at
                                                    </Label>
                                                    <input
                                                      type="datetime-local"
                                                      id="Deposit at"
                                                      name="Deposit at"
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
                                                          bank: {
                                                            id: bank.id,
                                                            deposit_bank: bank.deposit_bank,
                                                            deposit_slip: bank.deposit_slip,
                                                            deposited_at:
                                                              e.target.value +
                                                              ":00Z",
                                                            // estimated_result_uploading_at:
                                                            //   bank.estimated_result_uploading_at,
                                                          },
                                                        });
                                                      }}
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
                                                  </div> */}

                                                  {/* <div className="mb-3">
                                                    <Label className="form-label">
                                                      Deposit Bank
                                                      <span className="text-danger font-size-12">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <select
                                                        name="deposit_bank"
                                                        component="select"
                                                        onChange={e =>
                                                          this.setState({
                                                            deposit_bank: e.target.value,
                                                          })
                                                        }
                                                        value={
                                                          this.state
                                                            .bank
                                                            .deposit_bank}                                                        className="form-select"
                                                      >
                                                        <option
                                                          value=""
                                                        >
                                                          --- Please select the Type
                                                          ---
                                                        </option> 
                                                        <option value="Hbl">Hbl</option>
                                                        <option value="Meezan">Meezan</option>
                                                      </select>

                                                    <ErrorMessage
                                                      name="deposit_bank"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div> */}

                                                   {/* Certificate field */}
                                                   {/* <div className="mb-3">
                                                      <Label for="name" className="form-label">
                                                        Deposit Slip
                                                      </Label>
                                                       <Input
                                                          id="formFile"
                                                          name="deposit_slip"
                                                          placeholder="Choose file"
                                                          type="file"
                                                          value={
                                                            this.state
                                                              .bank
                                                              .deposit_slip}   
                                                          multiple={false}
                                                          accept=".jpg,.jpeg,.png,.word,.pdf"
                                                          onChange={e => {
                                                            this.setState({
                                                              resultFile:
                                                                e.target
                                                                  .files[0],
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
                                                          bank: {
                                                            id: bank.id,
                                                            deposit_bank:
                                                              bank.deposit_bank,
                                                            // deposited_at: bank.deposit_bank,
                                                            deposit_slip: bank.deposit_slip,
                                                            status :
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={
                                                        this.state
                                                          .bank
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

BanksList.propTypes = {
  match: PropTypes.object,
  banks: PropTypes.array,
  className: PropTypes.any,
  onGetBanks: PropTypes.func,
  onUpdateBank: PropTypes.func,
};

const mapStateToProps = ({ bankAccount }) => ({
  banks: bankAccount.banks,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetBanks: id => dispatch(getBanks(id)),
  onUpdateBank: bank =>
    dispatch(updateBank(bank)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(BanksList));
