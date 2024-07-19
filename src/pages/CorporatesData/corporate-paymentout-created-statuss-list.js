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
  getCCreatedOutStatuss,
  updatePaymentInBouncedStatus,
  updatePaymentOutCCreatedStatuss,
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
            paymentCreatedStatus: "",
            modal: false,
            payment_status: "",
            deleteModal: false,
            user_id: localStorage.getItem("authUser")
                ? JSON.parse(localStorage.getItem("authUser")).user_id
                : "",

        };
        this.handleCreateClick = this.handleCreateClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.toggle = this.toggle.bind(this);
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

        const { paymentStatuss, onGetCCreatedOutStatuss } = this.props;
        onGetCCreatedOutStatuss(this.state.user_id);
        this.setState({ paymentStatuss });
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal,
        }));
    }

    handlePaymentStatusClicks = () => {
        this.setState({
          paymentCreatedStatus: "",
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
        const { onDeletePaymentout, onGetCCreatedOutStatuss} = this.props;
        const { paymentStatuss } = this.state;
        if (paymentStatuss.id !== undefined) {
          onDeletePaymentout(paymentStatuss);
          setTimeout(() => {
            onGetCCreatedOutStatuss(this.state.user_id);
          }, 1000);
          this.setState({ deleteModal: false });
        }
      };

    handlePaymentStatusClick = (e, arg) => {
        this.setState({
          paymentCreatedStatus: {
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
    handleSubmitClick = (e, arg) => {
      const paymentCreatedStatus = arg;
      this.setState({
        paymentCreatedStatus: {
          id: paymentCreatedStatus.id,
          cheque_image: process.env.REACT_APP_BACKENDURL + paymentCreatedStatus.cheque_image,
          payment_for: paymentCreatedStatus.payment_for,
          test_appointment_id: paymentCreatedStatus.test_appointment_id,
          tax: paymentCreatedStatus.tax,
          lab_id: paymentCreatedStatus.lab_id,
          amount: paymentCreatedStatus.amount,
          payment_at: paymentCreatedStatus.payment_at,
          payment_method: paymentCreatedStatus.payment_method,
          cheque_no: paymentCreatedStatus.cheque_no,
          payment_status: "Paid",
          comments: paymentCreatedStatus.comments,
        },
        cheque_image: "",
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
    handleCreateClick = (e, arg) => {
      const paymentCreatedStatus = arg;
      this.setState({
        paymentCreatedStatus: {
          id: paymentCreatedStatus.id,
          cheque_image: process.env.REACT_APP_BACKENDURL + paymentCreatedStatus.cheque_image,
          payment_for: paymentCreatedStatus.payment_for,
          test_appointment_id: paymentCreatedStatus.test_appointment_id,
          tax: paymentCreatedStatus.tax,
          lab_id: paymentCreatedStatus.lab_id,
          amount: paymentCreatedStatus.amount,
          payment_at: paymentCreatedStatus.payment_at,
          payment_method: paymentCreatedStatus.payment_method,
          cheque_no: paymentCreatedStatus.cheque_no,
          payment_status: "Created",
          comments: paymentCreatedStatus.comments,
        },
        cheque_image: "",
        isEdit: true,
      });
  
      this.toggle();
    };
    render() {
        const columns= [
          {
            text: "Payment Form ID",
            dataField: "id",
            sort: true,
            hidden: false,
            formatter: (cellContent, paymentCreatedStatus) => (
            <>
              <span>{paymentCreatedStatus.id}</span>
            </>
            ),filter: textFilter(),
            headerStyle: { backgroundColor: '#DCDCDC' },
          },
          {
            dataField: "payment_for",
            text: "Payment To",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
              <span>{paymentCreatedStatus.payment_for}</span>
              </>
            ),filter: textFilter(),
            headerStyle: { backgroundColor: '#DCDCDC' },
          },
          {
            dataField: "test_appointment_id",
            text: "Test Appointments ID's",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
              <span>{paymentCreatedStatus.test_appointment_id}</span>
              </>
            ),filter: textFilter(),
            headerStyle: { backgroundColor: '#DCDCDC' },
          },
          {
            dataField: "lab_name",
            text: "Lab Name",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <span>
                {paymentCreatedStatus.lab_name != null ? paymentCreatedStatus.lab_name : "---"}
              </span>
            ),
            filter: textFilter(),
            headerStyle: { backgroundColor: '#DCDCDC' }
          }, 
           {
            dataField: "payment_method",
            text: "Payment Type.",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
              <span>{paymentCreatedStatus.payment_method}</span>
              </>
              ),filter: textFilter(),
              headerStyle: { backgroundColor: '#DCDCDC' },
          },
       
          
          {
            dataField: "cheque_no",
            text: "Cheque/Online Ref#",
            sort: true,
            formatter: (cellContent, paymentOutStatus) => (
              <>
                <span>
                  <Link
                    to={{
                      pathname:
                        process.env.REACT_APP_BACKENDURL + paymentOutStatus.cheque_image,
                    }}
                    target="_blank"
                  >
                                  <strong>{paymentOutStatus.cheque_no}</strong>
    
                  </Link>
    
                </span>
    
              </>
            ),filter: textFilter(),
            headerStyle: { backgroundColor: '#DCDCDC' },
          },
          {
            dataField: "payment_at",
            text: "Payment Date",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => {
              const date = new Date(paymentCreatedStatus.payment_at);
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
            dataField: "amount",
            text: "Amount",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
                <div className="text-end">
                  {paymentCreatedStatus && typeof paymentCreatedStatus.amount !== 'undefined' ? (
                    <strong>{Math.abs(paymentCreatedStatus.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                  ) : (
                    <span>N/A</span> // or any default value you want to display when amount is undefined
                  )}
                </div>
              </>
            ),filter: textFilter(),
              headerStyle: { backgroundColor: '#DCDCDC' },
              style: { backgroundColor: '	#F0F0F0' },
          },
          {
            dataField: "payment_status",
            text: "Payment Status",
            sort: true,
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
                <strong>{paymentCreatedStatus.payment_status}</strong>
              </>
            ),
            filter: selectFilter({
              options: {
                '': 'All',
                'Created': 'Created',
                'Paid': 'Paid',
              },
              defaultValue: 'All',
            }),
            headerStyle: { backgroundColor: '#DCDCDC' },
            style: { backgroundColor: '	#F0F0F0' },
          },
          {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Action",
            formatter: (cellContent, paymentCreatedStatus) => (
              <>
              {paymentCreatedStatus.payment_status !== "Paid" ? ( 
                <div className="d-flex gap-1">
                <button
                  type="submit"
                  className="btn btn-success save-user"
                  onClick={e => this.handleCreateClick(e, paymentCreatedStatus)}
    
                >
                  Edit
                </button>
    
                <button
                  type="submit"
                  className="btn btn-success save-user"
                  onClick={e => this.handleSubmitClick(e, paymentCreatedStatus)}
    
                >
                  Update
                </button>
                {/* <button
                  type="submit"
                  className="btn btn-danger save-user"
                  onClick={() => this.onClickDelete(paymentCreatedStatus)}
    
                >
                  Delete
                </button> */}
                {/* <Link className="text-danger" to="#">
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                    onClick={() => this.onClickDelete(paymentCreatedStatus)}
                  ></i>
                </Link> */}
              </div>
              ) : (
                "---"
              )}
              
              </>
              
            ),
            headerStyle: { backgroundColor: '#DCDCDC' },
          },
          {
            dataField: "menu",
            isDummyField: true,
            editable: false,
            text: "Comments/ Voucher",
            formatter: (cellContent, paymentCreatedStatus) => (
              <div>
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/corporate-activity-log/${paymentCreatedStatus.id}`}
                  style={{ marginRight: '10px' }} // Add space between icons
                />
                <Link
                  className="fas fa-copy font-size-18"
                  to={`/corporate-voucher/${paymentCreatedStatus.id}`}
                />
              </div>
            ),
            headerStyle: { backgroundColor: '#DCDCDC' },
          }
          
           
          
        ];
        const { SearchBar } = Search;
        const isDonation = this.state.paymentCreatedStatus.payment_for === "Donor";

        console.log("what payment type", isDonation)

        const { paymentStatuss } = this.props;

        const { isEdit, deleteModal } = this.state;

        const {
          onUpdatePaymentOutCCreatedStatuss,
          onGetCCreatedOutStatuss,
        } = this.props;
        const paymentCreatedStatus = this.state.paymentCreatedStatus;

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
        //             label: `${bankAccounts[i].bank_name} - ${bankAccounts[i].account_no}`,
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

        return (
            <React.Fragment>
                <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeletePathologist}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
                <div className="page-content">
                    <MetaTags>
                    <title>Payments List | Lab Hazir</title>
                    </MetaTags>
                    <Container fluid>
                        {/* Render Breadcrumbs */}
                        <Breadcrumbs
              title="List"
              breadcrumbItem="Payments"
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
                                                                    {/* <div className="ms-2 mb-4">
                                                                        <div>
                                                                            <Label for="main_lab_appointments" className="form-label">
                                                                                <strong>Payment Statuses</strong>
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
                                                                    </div> */}
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
                                          ? "UpdateMOF"
                                          : "Add Pathologist"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            cheque_image:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.cheque_image) ||
                                              "",
                                            amount:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.amount) ||
                                              "",
                                            payment_method:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_method) ||
                                              "",
                                            cheque_image:
                                              (this.state &&
                                                this.state.cheque_image) ||
                                              "",
                                            payment_at:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_at) ||
                                              "",
                                            cheque_no:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.cheque_no) ||
                                              "",
                                            comments:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.comments) ||
                                              "",
                                            lab_id:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.lab_id) ||
                                              "",
                                            payment_for:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_for) ||
                                              "",
                                            test_appointment_id:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.test_appointment_id) ||
                                              "",
                                            tax:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.tax) ||
                                              "",
                                            payment_status:
                                              (paymentCreatedStatus &&
                                                paymentCreatedStatus.payment_status) ||
                                              "",
                                            // payment_method:
                                            //   (paymentCreatedStatus &&
                                            //     paymentCreatedStatus.payment_method) ||
                                            //   "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            // name: Yup.string()
                                            //   .trim()
                                            //   .matches(
                                            //     /^[a-zA-Z][a-zA-Z ]+$/,
                                            //     "Please enter only alphabets and spaces"
                                            //   )
                                            //   .required("Please enter name"),
                                            // comments: Yup.string()
                                            //   .required("Please enter comments")
                                            //   .comments(
                                            //     "Please enter valid comments"
                                            //   ),
                                            // amount: Yup.string()
                                            //   .required("Please enter amount")
                                            //   .matches(
                                            //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                            //     "Please enter a valid Pakistani amount number e.g. 03123456789"
                                            //   ),
                                            // cheque_no: Yup.string()
                                            //   .required("Please enter amount")
                                            //   .matches(
                                            //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                                            //     "Please enter a valid Pakistani cheque_no number e.g. 0512345678"
                                            //   ),
                                            // qualification: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your qualification"
                                            //   ),
                                            // speciality: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your speciality"
                                            //   ),
                                            // pmdc_reg_no: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your pmdc reg no."
                                            //   ),
                                            // // designation: Yup.string()
                                            // //   .trim()
                                            // //   .required(
                                            // //     "Please enter your designation"
                                            // //   ),
                                            // payment_for:
                                            //   Yup.string()
                                            //     .trim()
                                            //     .required(
                                            //       "Please select one option from dropdown"
                                            //     ),
                                            // is_available_on_whatsapp:
                                            //   Yup.string()
                                            //     .trim()
                                            //     .required(
                                            //       "Please select one option from dropdown"
                                            //     ),
                                            // cheque_image: Yup.string().when(
                                            //   "hiddenEditFlag",
                                            //   {
                                            //     is: hiddenEditFlag =>
                                            //       hiddenEditFlag == false, //just an e.g. you can return a function
                                            //     then: Yup.string().required(
                                            //       "Please upload cheque_image"
                                            //     ),
                                            //   }
                                            // ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (!this.state.cheque_image) {
                                                this.toDataURL(
                                                  paymentCreatedStatus.cheque_image
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      paymentCreatedStatus.cheque_image
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    cheque_image: fileData,
                                                  });

                                                  const updatePaymentOutCCreatedStatuss = {
                                                    id: paymentCreatedStatus.id,
                                                    cheque_image: this.state.cheque_image,
                                                    amount: values.amount,
                                                    payment_at: values.payment_at,
                                                    cheque_no: values.cheque_no,
                                                    comments: values.comments,
                                                    payment_for:
                                                      values.payment_for,
                                                    test_appointment_id: values.test_appointment_id,
                                                    tax: values.tax,
                                                    lab_id:
                                                      values.lab_id,
                                                    payment_status:
                                                      values.payment_status,
                                                    payment_method:
                                                      values.payment_method,
                                                    // payment_method:
                                                    //   values.payment_method,
                                                  };
                                                  // update QualityCertificate
                                                  onUpdatePaymentOutCCreatedStatuss(
                                                    updatePaymentOutCCreatedStatuss
                                                  );
                                                  setTimeout(() => {
                                                    onGetCCreatedOutStatuss(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updatePaymentOutCCreatedStatuss = {
                                                  id: paymentCreatedStatus.id,
                                                  cheque_image: this.state.cheque_image,
                                                  amount: values.amount,
                                                  payment_at: values.payment_at,
                                                  cheque_no: values.cheque_no,
                                                  comments: values.comments,
                                                  payment_for:
                                                    values.payment_for,
                                                  test_appointment_id: values.test_appointment_id,
                                                  tax: values.tax,
                                                  lab_id:
                                                    values.lab_id,
                                                  payment_status:
                                                    values.payment_status,
                                                  payment_method:
                                                    values.payment_method,
                                                  // payment_method:
                                                  //   values.payment_method,
                                                };

                                                // update Pathologist
                                                onUpdatePaymentOutCCreatedStatuss(
                                                  updatePaymentOutCCreatedStatuss
                                                );
                                                setTimeout(() => {
                                                  onGetCCreatedOutStatuss(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            }

                                            this.setState({
                                              // selectedPathologist: null,
                                            });
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
                                                      Payment To
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="payment_for"
                                                      as="select"
                                                      // className="form-control"
                                                      multiple={false}
                                                      readOnly={true}
                                                      className={
                                                        "form-control" +
                                                        (errors.payment_for &&
                                                          touched.payment_for
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.paymentCreatedStatus
                                                          .payment_for
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_for:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            amount:
                                                              paymentCreatedStatus.amount,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            is_cleared:
                                                              paymentCreatedStatus.is_cleared,
                                                            cleared_at: paymentCreatedStatus.cleared_at,
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      {/* <option value="">
                                                        ----- Please select
                                                        Type-----
                                                      </option>
                                                      <option value="Lab">
                                                        Lab
                                                      </option>
                                                      <option value="B2BClient">
                                                        B2BClient
                                                      </option> */}
                                                    {/* </Field>

                                                    <ErrorMessage
                                                      name="payment_for"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    /> */}

                                                    {/* <span className="text-primary font-size-12 text-bold">
                                                      <strong>
                                                        Note: Your contact
                                                        information will be
                                                        shared publicly for
                                                        consultation of the
                                                        patients with you if you
                                                        select YES.
                                                      </strong>
                                                    </span> */}
                                                  {/* </div>  */}

                                                  <div className="mb-3">
                        <Label for="type" className="form-label">
                          Payment To
                        </Label>
                        <Field
                          name="payment_for"
                          value={
                            this.state
                              .paymentCreatedStatus.payment_for
                          }
                          // component="select"
                          disabled // Set the disabled attribute to make it read-only
                          onChange={e =>
                            this.setState({
                              payment_for: e.target.value,
                            })
                          }
                          // value={this.state.payment_for}
                          className={
                            "form-control" +
                            (errors.payment_for &&
                              touched.payment_for
                              ? " is-invalid"
                              : "")
                          }                                 >
                          {/* <option value="Main Lab">Main Lab</option>
    <option value="Collection Point">Collection Point</option> */}
                        </Field>
                      </div>

                      <div className="mb-3">
                        <Label for="type" className="form-label">
                          Test Appointment
                        </Label>
                        <Field
                          name="test_appointment_id"
                          value={
                            this.state
                              .paymentCreatedStatus.test_appointment_id
                          }
                          // component="select"
                          disabled // Set the disabled attribute to make it read-only
                          onChange={e =>
                            this.setState({
                              test_appointment_id: e.target.value,
                            })
                          }
                          // value={this.state.test_appointment_id}
                          className={
                            "form-control" +
                            (errors.test_appointment_id &&
                              touched.test_appointment_id
                              ? " is-invalid"
                              : "")
                          }                                 >
                          {/* <option value="Main Lab">Main Lab</option>
    <option value="Collection Point">Collection Point</option> */}
                        </Field>
                      </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Amount
                                                    </Label>
                                                    <Field
                                                      name="amount"
                                                      type="number"
                                                      value={
                                                        this.state
                                                          .paymentCreatedStatus.amount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            amount:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.amount &&
                                                          touched.amount
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="amount"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                        <Label className="form-label">
                          Tax
                        </Label>
                        <Field
                          type="number"
                          name="tax"
                          value={
                            this.state
                              .paymentCreatedStatus.tax
                          }
                          // component="select"
                          disabled // Set the disabled attribute to make it read-only
                          onChange={e =>
                            this.setState({
                              tax: e.target.value,
                            })
                          }
                          // value={this.state.tax}
                          className={
                            "form-control" +
                            (errors.tax &&
                              touched.tax
                              ? " is-invalid"
                              : "")
                          }                        >
                          {/* <option value="Main Lab">Main Lab</option>
    <option value="Collection Point">Collection Point</option> */}
                        </Field>
                      </div>

                                              

                                                  <div className="mb-3">
                                                    <Label
                                                      for="Estimated sample
                                                      collection at"
                                                    >
                                                      Payment Date
                                                    </Label>
                                                    <input
                                                      name="payment_at"
                                                      type="datetime-local"
                                                      value={
                                                        this.state
                                                          .paymentCreatedStatus.payment_at
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_at:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            amount:
                                                              paymentCreatedStatus.amount,
                                                            cheque_no:
                                                              paymentCreatedStatus.cheque_no,
                                                            payment_for: paymentCreatedStatus.payment_for,
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            comments:
                                                              paymentCreatedStatus.comments,

                                                          },
                                                        });
                                                      }}
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                        " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                    // onChange={e =>
                                                    //   this.setState({
                                                    //     payment_at:
                                                    //       e.target.value,
                                                    //   })
                                                    // }
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Cheque/Online Ref#
                                                    </Label>
                                                    <Field
                                                      name="cheque_no"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.cheque_no &&
                                                      //   touched.cheque_no
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.paymentCreatedStatus
                                                          .cheque_no
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            cheque_no:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            comments: paymentCreatedStatus.comments,
                                                            
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label
                                                      for="cheque_image"
                                                      className="form-label"
                                                    >
                                                      Payment Copy
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="cheque_image"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,"
                                                      onChange={e =>
                                                        this.setState({
                                                          cheque_image:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.cheque_image &&
                                                          touched.cheque_image
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="cheque_image"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Payment Type
                                                    </Label>
                                                    <Field
                                                      name="payment_method"
                                                      as="select"
                                                      className="form-control"
                                                      multiple={false}
                                                      value={
                                                        this.state.paymentCreatedStatus
                                                          .payment_method
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            payment_method:
                                                              e.target
                                                                .value,

                                                            comments:
                                                              paymentCreatedStatus.comments,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    >
                                                      <option
                                                        value=""
                                                        selected={
                                                          this.state.paymentCreatedStatus
                                                            .payment_method ===
                                                          undefined ||
                                                          this.state.paymentCreatedStatus
                                                            .payment_method ===
                                                          ""
                                                        }
                                                      >
                                                        ----- Please select
                                                        Type -----
                                                      </option>
                                                      <option value="Cheque">
                                                        Cheque
                                                      </option>
                                                      <option value="Card">
                                                        Online
                                                      </option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Comments
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      name="comments"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.comments &&
                                                          touched.comments
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.paymentCreatedStatus
                                                          .comments
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          paymentCreatedStatus: {
                                                            id: paymentCreatedStatus.id,
                                                            lab_id:
                                                              paymentCreatedStatus.lab_id,
                                                            invoice_id:
                                                              paymentCreatedStatus.invoice_id,
                                                            comments:
                                                              e.target
                                                                .value,

                                                            payment_method:
                                                              paymentCreatedStatus.payment_method,
                                                            payment_for:
                                                              paymentCreatedStatus.payment_for,
                                                            payment_at:
                                                              paymentCreatedStatus.payment_at,
                                                            cheque_no: paymentCreatedStatus.cheque_no,
                                                            
                                                            cheque_image:
                                                              paymentCreatedStatus.cheque_image,
                                                            
                                                            payment_status: paymentCreatedStatus.payment_status,
                                                            amount:
                                                              paymentCreatedStatus.amount,

                                                          },
                                                        });
                                                      }}
                                                    />
                                                    <ErrorMessage
                                                      name="comments"
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
    onGetCCreatedOutStatuss: PropTypes.func,
    onUpdatePaymentOutCCreatedStatuss: PropTypes.func,
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

    onGetCCreatedOutStatuss: id => dispatch(getCCreatedOutStatuss(id)),
    onUpdatePaymentOutCCreatedStatuss: paymentCreatedStatus =>
        dispatch(updatePaymentOutCCreatedStatuss(paymentCreatedStatus)),
    onDeletePaymentout: paymentCreatedStatus => dispatch(deletePaymentout(paymentCreatedStatus)),

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(PaymentStatussList));
