import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Select from "react-select";
import { withRouter, Link } from "react-router-dom";
import { CITIES, DISTRICTS } from "helpers/global_variables_helper";


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

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import { getAdvertisementPriceLists } from "store/advertisement-price-lists/actions";
import {
  // getAdvertisementPriceLists,
  getLabAdvertisements,
  addNewLabAdvertisement,
  updateLabAdvertisement,
  deleteLabAdvertisement,
} from "store/lab-advertisements/actions";

import {
  getTerritoriesList
} from "store/territories-list/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";
import { Tooltip } from "@material-ui/core";
import moment from 'moment';
class AdvertisementsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labAdvertisements: [],
      advertisementPriceLists: [],
      territoriesList: [],
      labAdvertisement: "",
      advertisementImg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      advertisementListColumns: [
        {
          text: "ID",
          dataField: "id",
          sort: true,
          hidden: false,
          formatter: (cellContent, labAdvertisement) => <>{labAdvertisement.id}</>,
        },
        {
          dataField: "poster",
          text: "Adv Image",
          formatter: (cellContent, labAdvertisement) => (
            <>
              {!labAdvertisement.poster ? (
                <div className="avatar-xs">
                  <span className="avatar-title rounded-circle">
                    {/* {labAdvertisement.name.charAt(0)} */}
                  </span>
                </div>
              ) : (
                <Link
                  to={{
                    pathname:
                      process.env.REACT_APP_BACKENDURL +
                      labAdvertisement.poster,
                  }}
                  target="_blank"
                >
                  <img
                    className="rounded-circle avatar-xs"
                    src={
                      process.env.REACT_APP_BACKENDURL + labAdvertisement.poster
                    }
                    alt=""
                  />
                </Link>
              )}
            </>
          ),
        },
        {
          dataField: "title",
          text: "Title",
          sort: true,
        },
        {
          dataField: "request_status",
          text: "Status",
          sort: true,
          formatter: (cellContent, labAdvertisement) => (
            <>
              {labAdvertisement.request_status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {labAdvertisement.request_status}
                </span>
              )}


              {labAdvertisement.request_status == "Accepted" && (
                <span className="badge rounded-pill badge-soft-success font-size-14 badge-soft-success">
                  {labAdvertisement.request_status}
                </span>
              )}

              {/* {labAdvertisement.request_status == "Recreated" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  Recreated
                </span>
              )} */}
              {labAdvertisement.request_status == "Recreated" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  <Link
                    to="#"
                    onClick={e => this.openPatientModal(e, labAdvertisement)}
                  >
                    {labAdvertisement.request_status}
                  </Link>
                </span>
              )}
            </>
          ),
        },
        {
          dataField: "number_of_days",
          text: "Duration In Days",
          sort: true,
        },
        {
          dataField: "amount",
          text: "Price",
          sort: true,
          formatter: (cellContent, labAdvertisement) => (
            <>
              {(
                <span className="float-end">{labAdvertisement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
              )}
            </>
          ),
        },
        {
          dataField: "payment_status",
          text: "Payment Status",
          sort: true,
          formatter: (cellContent, labAdvertisement) => (
            <>
              {labAdvertisement.payment_status == "Cleared" ? (
                <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                {labAdvertisement.payment_method},{" "}
                {labAdvertisement.payment_status}
              </span>
              ) : (
                <span>--</span>

              )}
            </>
          ),
        },
        {
          dataField: "invoice",
          text: "Invoice",
          isDummyField: true,
          editable: false,
          formatter: (cellContent, labAdvertisement) => (
            <>
              <Link
                className="btn btn-primary btn-rounded font-size-10"
                to={`/adv-invoice-detail/${labAdvertisement.id}`}
              >
                Invoice
              </Link>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, labAdvertisement) => (
            <div>
              
              {labAdvertisement.payment_status !== "Cleared" && labAdvertisement.payment_status !== "Created" && labAdvertisement.payment_status !== "Bounced" &&  (labAdvertisement.request_status === "Pending" || labAdvertisement.request_status === "Recreated") && (
                <Tooltip title="Update"> 
                  <Link className="text-success" to="#">
                    <i
                      className="mdi mdi-pencil font-size-18"
                      id="edittooltip"
                      onClick={e => this.handleAdvertisementClick(e, labAdvertisement)}
                    ></i>
                  </Link>
                </Tooltip>
              )}
              {labAdvertisement.payment_status !== "Cleared" && labAdvertisement.payment_status !== "Created" && labAdvertisement.payment_status !== "Bounced"  && (labAdvertisement.request_status === "Pending" || labAdvertisement.request_status === "Recreated") && (
                <Tooltip title="Delete"> 
                  <Link className="text-danger" to="#">
                    <i
                      className="mdi mdi-delete font-size-18"
                      id="deletetooltip"
                      onClick={() => this.onClickDelete(labAdvertisement)}
                    ></i>
                  </Link>
                </Tooltip>
              )}
               <Tooltip title="Chat">
                <Link
                  className="fas fa-comment font-size-18"
                  to={`/lab-adv-chat-box/${labAdvertisement.id}`}
                  ></Link>
              </Tooltip>
            </div>
          ),
        },
      ],
    };
    this.handleAdvertisementClick = this.handleAdvertisementClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAdvertisementClicks = this.handleAdvertisementClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.togglePatientModal = this.togglePatientModal.bind(this);
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
    const { territoriesList, onGetTerritoriesList } = this.props;
    if (territoriesList && !territoriesList.length) {
      console.log(onGetTerritoriesList(this.state.user_id));
    }
    const { labAdvertisements, onGetLabAdvertisements } = this.props;
    if (labAdvertisements && !labAdvertisements.length) {
      console.log(onGetLabAdvertisements(this.state.user_id));
    }

    const { advertisementPriceLists, onGetAdvertisementPriceLists } = this.props;
    if (advertisementPriceLists && !advertisementPriceLists.length) {
      console.log(onGetAdvertisementPriceLists(this.state.user_id));
    }

    // this.setState({ labAdvertisements });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      declined_reason: arg.declined_reason,
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
  handleAdvertisementClicks = () => {
    this.setState({
      labAdvertisement: "",
      advertisementImg: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { labAdvertisements } = this.props;
    if (
      !isEmpty(labAdvertisements) &&
      size(prevProps.labAdvertisements) !== size(labAdvertisements)
    ) {
      this.setState({ labAdvertisements: {}, isEdit: false });
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

  onClickDelete = labAdvertisements => {
    this.setState({ labAdvertisements: labAdvertisements });
    this.setState({ deleteModal: true });
  };

  handleDeleteAdvertisement = () => {
    const { onDeleteAdvertisement, onGetLabAdvertisements } = this.props;
    const { labAdvertisements } = this.state;
    if (labAdvertisements.id !== undefined) {
      onDeleteAdvertisement(labAdvertisements);
      setTimeout(() => {
        onGetLabAdvertisements(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleAdvertisementClick = (e, arg) => {
    const labAdvertisement = arg;
    const formatDateForInput = (dateString) => {
      return moment(dateString).format('YYYY-MM-DDTHH:mm'); // 'YYYY-MM-DDTHH:mm'
    };
    this.setState({
      labAdvertisement: {
        id: labAdvertisement.id,
        title: labAdvertisement.title,
        poster: process.env.REACT_APP_BACKENDURL + labAdvertisement.poster,
        posted_at: formatDateForInput(labAdvertisement.posted_at),
        posted_till: formatDateForInput(labAdvertisement.posted_till),
        km: labAdvertisement.km,
        request_status: labAdvertisement.request_status,
        payment_status: labAdvertisement.payment_status,
      },
      advertisementImg: "",
      isEdit: true,
    }, () => {
      this.toggle();
    });
  };

  render() {

    // list of city from territories
    const cityList = [];
    for (let i = 0; i < this.props.territoriesList.length; i++) {
      cityList.push({
        label: this.props.territoriesList[i].city,
        value: this.props.territoriesList[i].id,
      });
    }

    const myadvertisementPriceList = [];
    for (let i = 0; i < this.props.advertisementPriceLists.length; i++) {
      myadvertisementPriceList.push({
        label: this.props.advertisementPriceLists[i].number_of_days,
        value: this.props.advertisementPriceLists[i].id,
      });
    }
    const { SearchBar } = Search;

    const { labAdvertisements } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewLabAdvertisement,
      onUpdateLabAdvertisement,
      onGetLabAdvertisements,
    } = this.props;
    const labAdvertisement = this.state.labAdvertisement;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 10, // replace later with size(labAdvertisements),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];
    // const advertisementNumberOfDaysList = [];
    //     for (let i = 0; i < this.props.advertisementPriceLists.length; i++) {
    //       advertisementNumberOfDaysList.push({
    //         label: this.props.advertisementPriceLists[i].number_of_days,
    //         value: this.props.advertisementPriceLists[i].number_of_days,

    //       });
    //     }

    return (
      <React.Fragment>
        <DeleteModal
          show={deleteModal}
          onDeleteClick={this.handleDeleteAdvertisement}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Advertisement List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Advertisement List"
              breadcrumbItem="Advertisement List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.advertisementListColumns}
                      data={labAdvertisements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.advertisementListColumns}
                          data={labAdvertisements}
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
                                <Col sm="8">
                                  <div className="text-sm-end">
                                    <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick={this.handleAdvertisementClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Advertisement
                                    </Button>
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
                                      classes={
                                        "table align-middle table-nowrap table-hover"
                                      }
                                      bordered={false}
                                      striped={false}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
                                    />
                                    <Modal
                                      isOpen={this.state.PatientModal}
                                      className={this.props.className}
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
                                                <div className="mb-3 row">
                                                  <Label className="form-label">
                                                    Reason
                                                  </Label>
                                                  <div className="mb-9">
                                                    <textarea
                                                      name="declined-reason"
                                                      rows="3" // Set the number of rows
                                                      cols="30" // Set the number of columns
                                                      className="form-control"
                                                      readOnly={true}
                                                      value={this.state.declined_reason}
                                                    />
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                    </Modal>
                                    <Modal
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit ? "Edit Advertisement" : "Add New Advertisement"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,

                                            title:
                                              (this.state.labAdvertisement &&
                                                this.state.labAdvertisement
                                                  .title) ||
                                              "",
                                            poster:
                                              (this.state &&
                                                this.state.advertisementImg) ||
                                              "",
                                            posted_at:
                                              (this.state &&
                                                this.state.posted_at) ||
                                              "",
                                            posted_till:
                                              (this.state &&
                                                this.state.posted_till) ||
                                              "",
                                            km:
                                              (this.state.labAdvertisement && this.state.labAdvertisement.km) ||
                                              "",
                                            // number_of_days:
                                            //   (this.state &&
                                            //     this.state.number_of_days) ||
                                            //   "",
                                            // amount:
                                            //   (this.state &&
                                            //     this.state.amount) ||
                                            //   "",

                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            // title: Yup.string()
                                            //   .trim()
                                            //   .matches(
                                            //     /^[a-zA-Z][a-zA-Z ]+$/,
                                            //     "Please enter only alphabets and spaces"
                                            //   )
                                            //   .required("Please enter name"),
                                            // name: Yup.string().when(
                                            //   "region_type",
                                            //   {
                                            //     is: val => val === "Others",
                                            //     then: Yup.string()
                                            //       .trim()
                                            //       .required("Please enter test name")
                                            //       .min(
                                            //         3,
                                            //         "Please enter at least 3 characters"
                                            //       )
                                            //       .max(
                                            //         255,
                                            //         "Please enter maximum 255 characters"
                                            //       )
                                            //       .matches(
                                            //         /^[a-zA-Z][a-zA-Z ]+$/,
                                            //         "Please enter only alphabets and spaces"
                                            //       ),
                                            //   }
                                            // ),
                                            title: Yup.string().trim()
                                            .matches(
                                              /^[a-zA-Z][a-zA-Z ]+$/,
                                              "Please enter only alphabets and spaces"
                                            ).required(
                                                  "Please enter title it is necessary"
                                                ).min(
                                                  3,
                                                  "Please enter at least 3 characters"
                                                )
                                                .max(
                                                  255,
                                                  "Please enter maximum 255 characters"
                                                ),

                                            poster: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload poster it is necessary"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (
                                                !this.state.advertisementImg
                                              ) {
                                                this.toDataURL(
                                                  labAdvertisement.poster
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      labAdvertisement.poster
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    advertisementImg: fileData,
                                                  });

                                                  const updateLabAdvertisement = {
                                                    id: labAdvertisement.id,

                                                    title: values.title,
                                                    poster:
                                                      this.state
                                                        .advertisementImg,

                                                    posted_at: values.posted_at,
                                                    posted_till:
                                                      values.posted_till,
                                                    km: values.km,
                                                    // number_of_days: values.number_of_days,
                                                    // amount: values.amount,



                                                  };

                                                  // update Advertisement
                                                  onUpdateLabAdvertisement(
                                                    updateLabAdvertisement
                                                  );
                                                  setTimeout(() => {
                                                    onGetLabAdvertisements(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateLabAdvertisement = {
                                                  id: labAdvertisement.id,

                                                  title: values.title,
                                                  poster:
                                                    this.state.advertisementImg,

                                                  posted_at: values.posted_at,
                                                  posted_till:
                                                    values.posted_till,
                                                  km: values.km,
                                                  // number_of_days: values.number_of_days,
                                                  // amount: values.amount,



                                                };

                                                // update Advertisement
                                                onUpdateLabAdvertisement(
                                                  updateLabAdvertisement
                                                );
                                                setTimeout(() => {
                                                  onGetLabAdvertisements(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newAdvertisement = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,

                                                title: values.title,
                                                poster:
                                                  this.state.advertisementImg,

                                                posted_at: values.posted_at,
                                                posted_till: values.posted_till,
                                                km: values.km,
                                                // number_of_days: values.number_of_days,
                                                // amount: values.amount,


                                              };

                                              // save new Advertisement
                                              onAddNewLabAdvertisement(
                                                newAdvertisement,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetLabAdvertisements(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.toggle();
                                          }}
                                        >
                                          {({ values, errors, status, touched }) => (
                                            <Form>
                                              <Row>
                                                <Col className="col-12">
                                                  <Field
                                                    type="hidden"
                                                    className="form-control"
                                                    name="hiddenEditFlag"
                                                    value={isEdit}
                                                  />

                                                  {/* Advertisement Title field
                                                  {this.state.labAdvertisement
                                                    .region_type ===
                                                    "Others" && (
                                                  
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Advertisement title
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .labAdvertisement
                                                          .name
                                                      }
                                                      onChange={e => {
                                                        
                                                          this.setState({
                                                            labAdvertisement:
                                                              {
                                                                id: labAdvertisement.id,
                                                                region_type: labAdvertisement.region_type,
                                                                name: e.target
                                                                  .value,
                                                                type: labAdvertisement.type,
                                                                poster:
                                                                  labAdvertisement.poster,
                                                                expiry_date: labAdvertisement.expiry_date,
                                                              },
                                                          });
                                                        } 
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                               
                                                    )} */}
                                                  {/* Region Type field */}
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Title
                                                    </Label>
                                                    <Field
                                                      name="title"
                                                      type="text"
                                                      required="true"
                                                      className={
                                                        "form-control" +
                                                        (errors.title && touched.title ? " is-invalid" : "")
                                                      }                                                      onChange={e => {
                                                        this.setState({
                                                          labAdvertisement: {
                                                            id: labAdvertisement.id,

                                                            title:
                                                              e.target.value,
                                                            poster:
                                                              labAdvertisement.poster,
                                                            posted_at:
                                                              labAdvertisement.posted_at,
                                                            posted_till:
                                                              labAdvertisement.posted_till,
                                                            km: labAdvertisement.km,
                                                            // number_of_days:
                                                            //   labAdvertisement.number_of_days,
                                                            // amount: labAdvertisement.amount,

                                                          },
                                                        });
                                                      }}
                                                      multiple={false}
                                                      value={this.state.labAdvertisement.title}
                                                    >
                                                      
                                                    </Field>
                                                     <ErrorMessage
                                                        name="title"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                  </div>

                                                  {/* Display current image in edit form only */}

                                                  {labAdvertisement.poster &&
                                                    labAdvertisement.poster ? (
                                                    <CardImg
                                                      className="img-fluid"
                                                      src={labAdvertisement.poster}
                                                      alt="Responsive image"
                                                    />
                                                  ) : null}


                                                  {/* Advertisement field */}
                                                  {(labAdvertisement.request_status === "Accepted" && labAdvertisement.payment_status !== "Approved") ||
                                                    (labAdvertisement.request_status !== "Accepted" && labAdvertisement.payment_status === "Approved") ||
                                                    (labAdvertisement.request_status !== "Accepted" && labAdvertisement.payment_status !== "Approved") ? (
                                                    <div className="mb-3">
                                                      <Label for="poster" className="form-label">
                                                        Advertisement Image
                                                      </Label>
                                                      <Input
                                                        id="formFile"
                                                        name="poster"
                                                        // required="true"
                                                        placeholder="Choose image"
                                                        type="file"
                                                        // value={
                                                        //   this.state.labAdvertisement.poster
                                                        // }
                                                        multiple={false}
                                                        accept=".jpg,.jpeg,.png,.pdf"
                                                        onChange={(e) =>
                                                          this.setState({
                                                            advertisementImg: e.target.files[0],
                                                          })
                                                        }
                                                        className={
                                                          "form-control" +
                                                          (errors.poster && touched.poster ? " is-invalid" : "")
                                                        }
                                                      />

                                                      <ErrorMessage
                                                        name="poster"
                                                        component="div"
                                                        className="invalid-feedback"
                                                      />
                                                    </div>
                                                  ) : null}



                                                  {/* {labAdvertisement.request_status != "Accepted" && 
                                                    labAdvertisement.payment_status != "Approved" ? (
                                                     
                                                  ) : null} */}


                                                  {/* Advertisement posted date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Posted At
                                                    </Label>
                                                    <input
                                                      name="posted_at"
                                                      required="true"
                                                      type="datetime-local"
                                                      // value={
                                                      //   this.state.labAdvertisement.posted_till
                                                      // }
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                        " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                      onChange={e =>
                                                        this.setState({
                                                          posted_at:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                  </div>
                                                  {/* Advertisement expiry date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Posted till
                                                    </Label>
                                                    <input
                                                      name="posted_till"
                                                      required="true"
                                                      type="datetime-local"
                                                      // value={
                                                      //   this.state.labAdvertisement.posted_till
                                                      // }
                                                      min={new Date(
                                                        new Date().toString().split("GMT")[0] +
                                                        " UTC"
                                                      )
                                                        .toISOString()
                                                        .slice(0, -8)}
                                                      className="form-control"
                                                      onChange={e =>
                                                        this.setState({
                                                          posted_till:
                                                            e.target.value,
                                                        })
                                                      }
                                                    />
                                                  </div>


                                                  {/* Advertisement number of days field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Km <span className="text-danger">(Area coverd by your advertisement)</span>
                                                    </Label>
                                                    <Field
                                                      name="km"
                                                      type="number"
                                                      required="true"
                                                      step="05"
                                                      min="05"
                                                      max="2200"
                                                      value={
                                                        this.state.labAdvertisement.km
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          labAdvertisement: {
                                                            id: labAdvertisement.id,
                                                            km:
                                                              e.target.value,
                                                            poster:
                                                              labAdvertisement.poster,
                                                            title:
                                                              labAdvertisement.title,
                                                            posted_at:
                                                              labAdvertisement.posted_at,
                                                            posted_till:
                                                              labAdvertisement.posted_till,
                                                            description: labAdvertisement.description,
                                                            //   labAdvertisement.number_of_days,
                                                            // amount: labAdvertisement.amount,

                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.km &&
                                                          touched.km
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="km"
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

AdvertisementsList.propTypes = {
  match: PropTypes.object,
  labAdvertisements: PropTypes.array,
  className: PropTypes.any,
  advertisementPriceLists: PropTypes.array,
  territoriesList: PropTypes.array,
  onGetAdvertisementPriceLists: PropTypes.func,
  onGetTerritoriesList: PropTypes.func,
  onGetLabAdvertisements: PropTypes.func,
  onAddNewLabAdvertisement: PropTypes.func,
  onDeleteAdvertisement: PropTypes.func,
  onUpdateLabAdvertisement: PropTypes.func,
};

const mapStateToProps = ({ advertisementPriceLists, labAdvertisements, territoriesList }) => ({
  labAdvertisements: labAdvertisements.labAdvertisements,
  advertisementPriceLists: advertisementPriceLists.advertisementPriceLists,
  territoriesList: territoriesList.territoriesList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAdvertisementPriceLists: id => dispatch(getAdvertisementPriceLists(id)),
  onGetTerritoriesList: id => dispatch(getTerritoriesList(id)),
  onGetLabAdvertisements: id => dispatch(getLabAdvertisements(id)),
  onAddNewLabAdvertisement: (labAdvertisement, id) =>
    dispatch(addNewLabAdvertisement(labAdvertisement, id)),
  onUpdateLabAdvertisement: labAdvertisement =>
    dispatch(updateLabAdvertisement(labAdvertisement)),
  onDeleteAdvertisement: labAdvertisement =>
    dispatch(deleteLabAdvertisement(labAdvertisement)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdvertisementsList));