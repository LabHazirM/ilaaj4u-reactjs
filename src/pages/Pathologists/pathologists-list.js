import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getPathologists,
  addNewPathologist,
  updatePathologist,
  deletePathologist,
} from "store/pathologists/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class PathologistsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pathologists: [],
      pathologist: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      pathologistListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, pathologist) => <>{pathologist.id}</>,
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Phone No.",
          sort: true,
        },
        {
          dataField: "landline",
          text: "Landline",
          sort: true,
        },
        {
          dataField: "qualification",
          text: "Qualification",
          sort: true,
        },
        {
          dataField: "speciality",
          text: "Speciality",
          sort: true,
        },
        {
          dataField: "pmdc_reg_no",
          text: "PMDC Reg No.",
          sort: true,
        },
        {
          dataField: "designation",
          text: "Designation",
          sort: true,
        },
        {
          dataField: "is_available_for_consultation",
          text: "Available for consultation",
          sort: true,
        },
        {
          dataField: "is_available_on_whatsapp",
          text: "Available on WhatsApp",
          sort: true,
        },
        {
          dataField: "is_associated_with_pap",
          text: "Associated with PAP",
          sort: true,
        },
        {
          dataField: "photo",
          text: "Photo",
          sort: true,
          formatter: (cellContent, pathologist) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + pathologist.photo,
                }}
                target="_blank"
              >
                View
              </Link>
            </>
          ),
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, pathologist) => (
            <div className="d-flex gap-3">
              <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handlePathologistClick(e, pathologist)}
                ></i>
              </Link></Tooltip>
              <Tooltip title="Delete">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(pathologist)}
                ></i>
              </Link></Tooltip>
            </div>
          ),
        },
      ],
    };
    this.handlePathologistClick = this.handlePathologistClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handlePathologistClicks = this.handlePathologistClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

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
    const { pathologists, onGetPathologists } = this.props;
    onGetPathologists(this.state.user_id);
    this.setState({ pathologists });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handlePathologistClicks = () => {
    this.setState({ pathologist: "", photo: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { pathologists } = this.props;
    if (
      !isEmpty(pathologists) &&
      size(prevProps.pathologists) !== size(pathologists)
    ) {
      this.setState({ pathologists: {}, isEdit: false });
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

  onClickDelete = pathologists => {
    this.setState({ pathologists: pathologists });
    this.setState({ deleteModal: true });
  };

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

  handleDeletePathologist = () => {
    const { onDeletePathologist, onGetPathologists } = this.props;
    const { pathologists } = this.state;
    if (pathologists.id !== undefined) {
      onDeletePathologist(pathologists);
      setTimeout(() => {
        onGetPathologists(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handlePathologistClick = (e, arg) => {
    const pathologist = arg;

    this.setState({
      pathologist: {
        id: pathologist.id,
        photo: process.env.REACT_APP_BACKENDURL + pathologist.photo,
        name: pathologist.name,
        email: pathologist.email,
        phone: pathologist.phone,
        landline: pathologist.landline,
        qualification: pathologist.qualification,
        speciality: pathologist.speciality,
        pmdc_reg_no: pathologist.pmdc_reg_no,
        designation: pathologist.designation,
        is_available_for_consultation:
          pathologist.is_available_for_consultation,
        is_available_on_whatsapp: pathologist.is_available_on_whatsapp,
        is_associated_with_pap: pathologist.is_associated_with_pap,
      },
      photo: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { pathologists } = this.props;

    const { isEdit, deleteModal } = this.state;

    const { onAddNewPathologist, onUpdatePathologist, onGetPathologists } =
      this.props;
    const pathologist = this.state.pathologist;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: pathologists.length, // replace later with size(pathologists),
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
            <title>Pathologists List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Pathologists"
              breadcrumbItem="Pathologists List"
            />
            <Row>
            <p className="text-danger">Note: Pathologist Information will scale the rating of your lab.</p>

              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.pathologistListColumns}
                      data={pathologists}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.pathologistListColumns}
                          data={pathologists}
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
                                      onClick={this.handlePathologistClicks}
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Pathologist
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
                                      classes={"table align-middle table-hover"}
                                      bordered={false}
                                      striped={true}
                                      headerWrapperClasses={"table-light"}
                                      responsive
                                      ref={this.node}
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
                                          ? "Edit Pathologist"
                                          : "Add Pathologist"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            photo:
                                              (pathologist &&
                                                pathologist.photo) ||
                                              "",
                                            name:
                                              (pathologist &&
                                                pathologist.name) ||
                                              "",
                                            email:
                                              (pathologist &&
                                                pathologist.email) ||
                                              "",
                                            photo:
                                              (this.state &&
                                                this.state.photo) ||
                                              "",
                                            phone:
                                              (pathologist &&
                                                pathologist.phone) ||
                                              "",
                                            landline:
                                              (pathologist &&
                                                pathologist.landline) ||
                                              "",
                                            qualification:
                                              (pathologist &&
                                                pathologist.qualification) ||
                                              "",
                                            speciality:
                                              (pathologist &&
                                                pathologist.speciality) ||
                                              "",
                                            pmdc_reg_no:
                                              (pathologist &&
                                                pathologist.pmdc_reg_no) ||
                                              "",
                                            designation:
                                              (pathologist &&
                                                pathologist.designation) ||
                                              "",
                                            is_available_for_consultation:
                                              (pathologist &&
                                                pathologist.is_available_for_consultation) ||
                                              "",
                                            is_available_on_whatsapp:
                                              (pathologist &&
                                                pathologist.is_available_on_whatsapp) ||
                                              "",
                                            is_associated_with_pap:
                                              (pathologist &&
                                                pathologist.is_associated_with_pap) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string()
                                              .trim()
                                              .required("Please enter name"),
                                            // email: Yup.string()
                                            //   .required("Please enter email")
                                            //   .email(
                                            //     "Please enter valid email"
                                            //   ),
                                             
                                            // landline: Yup.string()
                                            //   .required("Please enter phone")
                                            //   .matches(
                                            //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                                            //     "Please enter a valid Pakistani landline number e.g. 0512345678"
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
                                            pmdc_reg_no: Yup.string()
                                              .trim()
                                              .required(
                                                "Please enter your pmdc reg no."
                                              ),
                                            // designation: Yup.string()
                                            //   .trim()
                                            //   .required(
                                            //     "Please enter your designation"
                                            //   ),
                                            is_available_for_consultation:
                                              Yup.string()
                                                .trim()
                                                .required(
                                                  "Please select one option from dropdown"
                                                ),
                                            phone: Yup.string().when(
                                              "is_available_for_consultation",
                                              {
                                                is: is_available_for_consultation =>
                                                  is_available_for_consultation === "Yes",
                                                then: Yup.string().required(
                                                  "Please enter phone"
                                                ),
                                              }
                                            ),
                                            is_available_on_whatsapp:
                                              Yup.string()
                                                .trim()
                                                .required(
                                                  "Please select one option from dropdown"
                                                ),
                                            photo: Yup.string().when(
                                              "hiddenEditFlag",
                                              {
                                                is: hiddenEditFlag =>
                                                  hiddenEditFlag == false, //just an e.g. you can return a function
                                                then: Yup.string().required(
                                                  "Please upload photo"
                                                ),
                                              }
                                            ),
                                          })}
                                          onSubmit={values => {
                                            if (isEdit) {
                                              if (!this.state.photo) {
                                                this.toDataURL(
                                                  pathologist.photo
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      pathologist.photo
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    photo: fileData,
                                                  });

                                                  const updatePathologist = {
                                                    id: pathologist.id,
                                                    photo: this.state.photo,
                                                    name: values.name,
                                                    email: values.email,
                                                    phone: values.phone,
                                                    landline: values.landline,
                                                    qualification:
                                                      values.qualification,
                                                    speciality:
                                                      values.speciality,
                                                    pmdc_reg_no:
                                                      values.pmdc_reg_no,
                                                    designation:
                                                      values.designation,
                                                    is_available_for_consultation:
                                                      values.is_available_for_consultation,
                                                    is_available_on_whatsapp:
                                                      values.is_available_on_whatsapp,
                                                    is_associated_with_pap:
                                                      values.is_associated_with_pap,
                                                  };

                                                  // update QualityCertificate
                                                  onUpdatePathologist(
                                                    updatePathologist
                                                  );
                                                  setTimeout(() => {
                                                    onGetPathologists(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updatePathologist = {
                                                  id: pathologist.id,
                                                  photo: this.state.photo,
                                                  name: values.name,
                                                  email: values.email,
                                                  phone: values.phone,
                                                  landline: values.landline,
                                                  qualification:
                                                    values.qualification,
                                                  speciality: values.speciality,
                                                  pmdc_reg_no:
                                                    values.pmdc_reg_no,
                                                  designation:
                                                    values.designation,
                                                  is_available_for_consultation:
                                                    values.is_available_for_consultation,
                                                  is_available_on_whatsapp:
                                                    values.is_available_on_whatsapp,
                                                  is_associated_with_pap:
                                                    values.is_associated_with_pap,
                                                };

                                                // update Pathologist
                                                onUpdatePathologist(
                                                  updatePathologist
                                                );
                                                setTimeout(() => {
                                                  onGetPathologists(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newPathologist = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                photo: this.state.photo,
                                                name: values.name,
                                                email: values.email,
                                                phone: values.phone,
                                                landline: values.landline,
                                                qualification:
                                                  values.qualification,
                                                speciality: values.speciality,
                                                pmdc_reg_no: values.pmdc_reg_no,
                                                designation: values.designation,
                                                is_available_for_consultation:
                                                  values.is_available_for_consultation,
                                                is_available_on_whatsapp:
                                                  values.is_available_on_whatsapp,
                                                is_associated_with_pap:
                                                  values.is_associated_with_pap,
                                              };

                                              // save new Pathologist
                                              onAddNewPathologist(
                                                newPathologist,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetPathologists(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedPathologist: null,
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
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Name
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.name &&
                                                        touched.name
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .name
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: e.target
                                                              .value,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="name"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Email
                                                      <span className="text-danger">
                                                        (optional)
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="email"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.email &&
                                                        touched.email
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .email
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              e.target.value,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="email"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is available for
                                                      consultation?
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_available_for_consultation"
                                                      as="select"
                                                      // className="form-control"
                                                      multiple={false}
                                                      className={
                                                        "form-control" +
                                                        (errors.is_available_for_consultation &&
                                                        touched.is_available_for_consultation
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .is_available_for_consultation
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              e.target.value,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    >
                                                      <option value="">
                                                        ----- Please select
                                                        Yes/No -----
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>

                                                    <ErrorMessage
                                                      name="is_available_for_consultation"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />

                                                    <span className="text-primary font-size-12 text-bold">
                                                      <strong>
                                                        Note: Your contact
                                                        information will be
                                                        shared publicly for
                                                        consultation of the
                                                        patients with you if you
                                                        select YES.
                                                      </strong>
                                                    </span>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is available on WhatsApp?
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="is_available_on_whatsapp"
                                                      as="select"
                                                      // className="form-control"
                                                      multiple={false}
                                                      className={
                                                        "form-control" +
                                                        (errors.is_available_on_whatsapp &&
                                                        touched.is_available_on_whatsapp
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .is_available_on_whatsapp
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              e.target.value,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    >
                                                      <option value="">
                                                        ----- Please select
                                                        Yes/No -----
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>

                                                    <ErrorMessage
                                                      name="is_available_on_whatsapp"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  {pathologist.is_available_for_consultation == "Yes" || 
                                                  pathologist.is_available_on_whatsapp == "Yes" ? (
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Mobile No.
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                        touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .phone
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              e.target.value,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                                  ): null}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Landline (optional)
                                                    </Label>
                                                    <Field
                                                      name="landline"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.landline &&
                                                      //   touched.landline
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.pathologist
                                                          .landline
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              e.target.value,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label
                                                      for="photo"
                                                      className="form-label"
                                                    >
                                                      Photo
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="photo"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,"
                                                      onChange={e =>
                                                        this.setState({
                                                          photo:
                                                            e.target.files[0],
                                                        })
                                                      }
                                                      className={
                                                        "form-control" +
                                                        (errors.photo &&
                                                        touched.photo
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />

                                                    <ErrorMessage
                                                      name="photo"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      PMDC Reg No.
                                                      <span className="text-danger">
                                                        *
                                                      </span>
                                                    </Label>
                                                    <Field
                                                      name="pmdc_reg_no"
                                                      type="text"
                                                      className={
                                                        "form-control" +
                                                        (errors.pmdc_reg_no &&
                                                        touched.pmdc_reg_no
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                      value={
                                                        this.state.pathologist
                                                          .pmdc_reg_no
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              e.target.value,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="pmdc_reg_no"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Qualification (optional)
                                                    </Label>
                                                    <Field
                                                      name="qualification"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.qualification &&
                                                      //   touched.qualification
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.pathologist
                                                          .qualification
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              e.target.value,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    {/* <ErrorMessage
                                                      name="qualification"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    /> */}
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Speciality (optional)
                                                    </Label>
                                                    <Field
                                                      name="speciality"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.speciality &&
                                                      //   touched.speciality
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.pathologist
                                                          .speciality
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              e.target.value,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    {/* <ErrorMessage
                                                      name="speciality"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    /> */}
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Designation (optional)
                                                    </Label>
                                                    <Field
                                                      name="designation"
                                                      type="text"
                                                      // className={
                                                      //   "form-control" +
                                                      //   (errors.designation &&
                                                      //   touched.designation
                                                      //     ? " is-invalid"
                                                      //     : "")
                                                      // }
                                                      className="form-control"
                                                      value={
                                                        this.state.pathologist
                                                          .designation
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              e.target.value,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              pathologist.is_associated_with_pap,
                                                          },
                                                        })
                                                      }
                                                    />
                                                    {/* <ErrorMessage
                                                      name="designation"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    /> */}
                                                  </div>
                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Is associated with PAP?
                                                      (optional)
                                                    </Label>
                                                    <Field
                                                      name="is_associated_with_pap"
                                                      as="select"
                                                      className="form-control"
                                                      multiple={false}
                                                      value={
                                                        this.state.pathologist
                                                          .is_associated_with_pap
                                                      }
                                                      onChange={e =>
                                                        this.setState({
                                                          pathologist: {
                                                            id: pathologist.id,
                                                            photo:
                                                              pathologist.photo,
                                                            name: pathologist.name,
                                                            email:
                                                              pathologist.email,
                                                            phone:
                                                              pathologist.phone,
                                                            landline:
                                                              pathologist.landline,
                                                            qualification:
                                                              pathologist.qualification,
                                                            speciality:
                                                              pathologist.speciality,
                                                            pmdc_reg_no:
                                                              pathologist.pmdc_reg_no,
                                                            designation:
                                                              pathologist.designation,
                                                            is_available_for_consultation:
                                                              pathologist.is_available_for_consultation,
                                                            is_available_on_whatsapp:
                                                              pathologist.is_available_on_whatsapp,
                                                            is_associated_with_pap:
                                                              e.target.value,
                                                          },
                                                        })
                                                      }
                                                    >
                                                      <option
                                                        value=""
                                                        selected={
                                                          this.state.pathologist
                                                            .is_associated_with_pap ===
                                                            undefined ||
                                                          this.state.pathologist
                                                            .is_associated_with_pap ===
                                                            ""
                                                        }
                                                      >
                                                        ----- Please select
                                                        Yes/No -----
                                                      </option>
                                                      <option value="Yes">
                                                        Yes
                                                      </option>
                                                      <option value="No">
                                                        No
                                                      </option>
                                                    </Field>
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

PathologistsList.propTypes = {
  match: PropTypes.object,
  pathologists: PropTypes.array,
  className: PropTypes.any,
  onGetPathologists: PropTypes.func,
  onAddNewPathologist: PropTypes.func,
  onDeletePathologist: PropTypes.func,
  onUpdatePathologist: PropTypes.func,
};

const mapStateToProps = ({ pathologists }) => ({
  pathologists: pathologists.pathologists,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPathologists: id => dispatch(getPathologists(id)),
  onAddNewPathologist: (pathologist, id) =>
    dispatch(addNewPathologist(pathologist, id)),
  onUpdatePathologist: pathologist => dispatch(updatePathologist(pathologist)),
  onDeletePathologist: pathologist => dispatch(deletePathologist(pathologist)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PathologistsList));