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
  getSampleCollectors,
  addNewSampleCollector,
  updateSampleCollector,
  deleteSampleCollector,
} from "store/sample-collectors/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class SampleCollectorsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      sampleCollectors: [],
      sampleCollector: "",
      collectorImg: "",
      modal: false,
      deleteModal: false,
      sampleCollectorListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, sampleCollector) => (
            <>{sampleCollector.id}</>
          ),
        },
        {
          dataField: "name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "gender",
          text: "Gender",
          sort: true,
        },
        {
          dataField: "cnic",
          text: "CNIC",
          sort: true,
        },
        {
          dataField: "phone",
          text: "Mobile No.",
          sort: true,
        },
        {
          dataField: "photo",
          text: "Photo",
          sort: true,
          formatter: (cellContent, sampleCollector) => (
            <>
              <Link
                to={{
                  pathname:
                    process.env.REACT_APP_BACKENDURL + sampleCollector.photo,
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
          formatter: (cellContent, sampleCollector) => (
            <div >
                <Tooltip title="Update">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e =>
                    this.handleSampleCollectorClick(e, sampleCollector)
                  }
                ></i>
              </Link></Tooltip>
               <Tooltip title="Delete">
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(sampleCollector)}
                ></i>
              </Link></Tooltip>
            </div>
          ),
        },
      ],
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    };
    this.handleSampleCollectorClick =
      this.handleSampleCollectorClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleSampleCollectorClicks =
      this.handleSampleCollectorClicks.bind(this);
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
    const { onGetSampleCollectors } = this.props;
    onGetSampleCollectors(this.state.user_id);
    this.setState({ sampleCollectors: this.props.sampleCollectors });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleSampleCollectorClicks = () => {
    this.setState({ sampleCollector: "", collectorImg: "", isEdit: false });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { sampleCollectors } = this.props;
    if (
      !isEmpty(sampleCollectors) &&
      size(prevProps.sampleCollectors) !== size(sampleCollectors)
    ) {
      this.setState({ sampleCollectors: {}, isEdit: false });
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

  onClickDelete = sampleCollectors => {
    this.setState({ sampleCollectors: sampleCollectors });
    this.setState({ deleteModal: true });
  };

  handleDeleteSampleCollector = () => {
    const { onDeleteSampleCollector, onGetSampleCollectors } = this.props;
    const { sampleCollectors } = this.state;
    if (sampleCollectors.id !== undefined) {
      onDeleteSampleCollector(sampleCollectors);
      setTimeout(() => {
        onGetSampleCollectors(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleSampleCollectorClick = (e, arg) => {
    const sampleCollector = arg;

    this.setState({
      sampleCollector: {
        id: sampleCollector.id,
        name: sampleCollector.name,
        gender: sampleCollector.gender,
        cnic: sampleCollector.cnic,
        phone: sampleCollector.phone,
        photo: process.env.REACT_APP_BACKENDURL + sampleCollector.photo,
      },
      collectorImg: "",
      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { sampleCollectors } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewSampleCollector,
      onUpdateSampleCollector,
      onGetSampleCollectors,
    } = this.props;
    const { selectedSampleCollector } = this.state;
    const sampleCollector = this.state.sampleCollector;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: sampleCollectors.length, // replace later with size(sampleCollectors),
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
          onDeleteClick={this.handleDeleteSampleCollector}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Home Sample Collectors List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Home Sample Collectors"
              breadcrumbItem="Collectors List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.sampleCollectorListColumns}
                      data={sampleCollectors}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.sampleCollectorListColumns}
                          data={sampleCollectors}
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
                                    {/* <Button
                                      color="primary"
                                      className="font-16 btn-block btn btn-primary"
                                      onClick="add-sample-collector"
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Collector
                                    </Button> */}
                                    <Link
                                      to="/add-sample-collector"
                                      className="font-16 btn-block btn btn-primary"
                                    >
                                      <i className="mdi mdi-plus-circle-outline me-1" />
                                      Add New Collector
                                    </Link>
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
                                          ? "Edit Home Sample Collector"
                                          : "Add Home Sample Collector"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,
                                            name:
                                              (sampleCollector &&
                                                sampleCollector.name) ||
                                              "",
                                            gender:
                                              (sampleCollector &&
                                                sampleCollector.gender) ||
                                              "Male",
                                            cnic:
                                              (sampleCollector &&
                                                sampleCollector.cnic) ||
                                              "",
                                            phone:
                                              (sampleCollector &&
                                                sampleCollector.phone) ||
                                              "",
                                            photo:
                                              (this.state &&
                                                this.state.collectorImg) ||
                                              "",
                                          }}
                                          validationSchema={Yup.object().shape({
                                            hiddentEditFlag: Yup.boolean(),
                                            name: Yup.string()
                                              .trim()
                                              .required("Please enter name"),
                                            cnic: Yup.string()
                                              .required(
                                                "Please enter your CNIC"
                                              )
                                              .matches(
                                                /^[0-9]{5}-[0-9]{7}-[0-9]$/,
                                                "Please enter a valid CNIC e.g. 37106-8234782-3"
                                              ),
                                            phone: Yup.string()
                                              .required("Please enter phone")
                                              .matches(
                                                /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/,
                                                "Please enter a valid Pakistani phone number e.g. 03123456789"
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
                                              if (!this.state.collectorImg) {
                                                this.toDataURL(
                                                  sampleCollector.photo
                                                ).then(dataUrl => {
                                                  var fileData =
                                                    this.dataURLtoFile(
                                                      dataUrl,
                                                      sampleCollector.photo
                                                        .split("/")
                                                        .at(-1)
                                                    );
                                                  this.setState({
                                                    collectorImg: fileData,
                                                  });

                                                  const updateSampleCollector =
                                                    {
                                                      id: sampleCollector.id,
                                                      name: values.name,
                                                      gender: values.gender,
                                                      cnic: values.cnic,
                                                      phone: values.phone,
                                                      photo:
                                                        this.state.collectorImg,
                                                    };

                                                  // update SampleCollector
                                                  onUpdateSampleCollector(
                                                    updateSampleCollector
                                                  );
                                                  setTimeout(() => {
                                                    onGetSampleCollectors(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                });
                                              } else {
                                                const updateSampleCollector = {
                                                  id: sampleCollector.id,
                                                  name: values.name,
                                                  gender: values.gender,
                                                  cnic: values.cnic,
                                                  phone: values.phone,
                                                  photo:
                                                    this.state.collectorImg,
                                                };

                                                // update SampleCollector
                                                onUpdateSampleCollector(
                                                  updateSampleCollector
                                                );
                                                setTimeout(() => {
                                                  onGetSampleCollectors(
                                                    this.state.user_id
                                                  );
                                                }, 1000);
                                              }
                                            } else {
                                              const newSampleCollector = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,
                                                name: values.name,
                                                gender: values.gender,
                                                cnic: values.cnic,
                                                phone: values.phone,
                                                photo: this.state.collectorImg,
                                              };

                                              // save new SampleCollector
                                              onAddNewSampleCollector(
                                                newSampleCollector,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetSampleCollectors(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
                                            this.setState({
                                              selectedSampleCollector: null,
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
                                                    </Label>
                                                    <Field
                                                      name="name"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .sampleCollector.name
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            sampleCollector: {
                                                              id: sampleCollector.id,
                                                              name: e.target
                                                                .value,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                sampleCollector.phone,
                                                              photo:
                                                                sampleCollector.photo,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            sampleCollector: {
                                                              name: e.target
                                                                .value,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                sampleCollector.phone,
                                                            },
                                                          });
                                                        }
                                                      }}
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

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Gender
                                                    </Label>
                                                    <Field
                                                      name="gender"
                                                      as="select"
                                                      className="form-control"
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            sampleCollector: {
                                                              id: sampleCollector.id,
                                                              name: sampleCollector.name,
                                                              gender:
                                                                e.target.value,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                sampleCollector.phone,
                                                              photo:
                                                                sampleCollector.photo,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            sampleCollector: {
                                                              name: sampleCollector.name,
                                                              gender:
                                                                e.target.value,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                sampleCollector.phone,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      multiple={false}
                                                    >
                                                      <option value="Male">
                                                        Male
                                                      </option>
                                                      <option value="Female">
                                                        Female
                                                      </option>
                                                    </Field>
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      CNIC
                                                    </Label>
                                                    <Field
                                                      name="cnic"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .sampleCollector.cnic
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            sampleCollector: {
                                                              id: sampleCollector.id,
                                                              name: sampleCollector.name,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: e.target
                                                                .value,
                                                              phone:
                                                                sampleCollector.phone,
                                                              photo:
                                                                sampleCollector.photo,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            sampleCollector: {
                                                              name: sampleCollector.name,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: e.target
                                                                .value,
                                                              phone:
                                                                sampleCollector.phone,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.cnic &&
                                                        touched.cnic
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="cnic"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Mobile No
                                                    </Label>
                                                    <Field
                                                      name="phone"
                                                      type="text"
                                                      value={
                                                        this.state
                                                          .sampleCollector.phone
                                                      }
                                                      onChange={e => {
                                                        if (isEdit) {
                                                          this.setState({
                                                            sampleCollector: {
                                                              id: sampleCollector.id,
                                                              name: sampleCollector.name,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                e.target.value,
                                                              photo:
                                                                sampleCollector.photo,
                                                            },
                                                          });
                                                        } else {
                                                          this.setState({
                                                            sampleCollector: {
                                                              name: sampleCollector.name,
                                                              gender:
                                                                sampleCollector.gender,
                                                              cnic: sampleCollector.cnic,
                                                              phone:
                                                                e.target.value,
                                                            },
                                                          });
                                                        }
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.phone &&
                                                        touched.phone
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="phone"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>

                                                  {/* Photo field */}
                                                  <div className="mb-3">
                                                    <Label
                                                      for="name"
                                                      className="form-label"
                                                    >
                                                      Photo
                                                    </Label>
                                                    <Input
                                                      id="formFile"
                                                      name="photo"
                                                      placeholder="Choose image"
                                                      type="file"
                                                      multiple={false}
                                                      accept=".jpg,.jpeg,.png,.pdf"
                                                      onChange={e =>
                                                        this.setState({
                                                          collectorImg:
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

SampleCollectorsList.propTypes = {
  match: PropTypes.object,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onGetSampleCollectors: PropTypes.func,
  onAddNewSampleCollector: PropTypes.func,
  onDeleteSampleCollector: PropTypes.func,
  onUpdateSampleCollector: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSampleCollectors: id => dispatch(getSampleCollectors(id)),
  onAddNewSampleCollector: (sampleCollector, id) =>
    dispatch(addNewSampleCollector(sampleCollector, id)),
  onUpdateSampleCollector: sampleCollector =>
    dispatch(updateSampleCollector(sampleCollector)),
  onDeleteSampleCollector: sampleCollector =>
    dispatch(deleteSampleCollector(sampleCollector)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SampleCollectorsList));
