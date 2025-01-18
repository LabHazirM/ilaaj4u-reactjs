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

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import images from "assets/images";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import DeleteModal from "components/Common/DeleteModal";

import {
  getAdvertisementPriceLists,
  addNewAdvertisementPriceList,
  updateAdvertisementPriceList,
  deleteAdvertisementPriceList,
} from "store/advertisement-price-lists/actions";

import { isEmpty, size } from "lodash";
import "assets/scss/table.scss";

class AdvertisementsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      advertisementPriceLists: [],
      advertisementPriceList: "",
      advertisementImg: "",
      modal: false,
      deleteModal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      advertisementPriceListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, advertisementPriceList) => <>{advertisementPriceList.id}</>,
        },
      
        {
          dataField: "district",
          text: "Price",
          sort: true,
        },
        {
          dataField: "number_of_days",
          text: "Number of Days",
          sort: true,
        },
        {
          dataField: "menu",
          isDummyField: true,
          editable: false,
          text: "Action",
          formatter: (cellContent, advertisementPriceList) => (
            <div className="d-flex gap-3">
              <Link className="text-success" to="#">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="edittooltip"
                  onClick={e => this.handleAdvertisementClick(e, advertisementPriceList)}
                ></i>
              </Link>
              <Link className="text-danger" to="#">
                <i
                  className="mdi mdi-delete font-size-18"
                  id="deletetooltip"
                  onClick={() => this.onClickDelete(advertisementPriceList)}
                ></i>
              </Link>
            </div>
          ),
        },
      ],
    };
    this.handleAdvertisementClick = this.handleAdvertisementClick.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleAdvertisementClicks = this.handleAdvertisementClicks.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }



  componentDidMount() {
    const { advertisementPriceLists, onGetAdvertisementPriceLists } = this.props;
    if (advertisementPriceLists && !advertisementPriceLists.length) {
      console.log(onGetAdvertisementPriceLists(this.state.user_id));
    }
    // this.setState({ advertisementPriceLists });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  handleAdvertisementClicks = () => {
    this.setState({
      advertisementPriceList: "",
      isEdit: false,
    });
    this.toggle();
  };

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { advertisementPriceLists } = this.props;
    if (
      !isEmpty(advertisementPriceLists) &&
      size(prevProps.advertisementPriceLists) !== size(advertisementPriceLists)
    ) {
      this.setState({ advertisementPriceLists: {}, isEdit: false });
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

  onClickDelete = advertisementPriceLists => {
    this.setState({ advertisementPriceLists: advertisementPriceLists });
    this.setState({ deleteModal: true });
  };

  handleDeleteAdvertisement = () => {
    const { onDeleteAdvertisementPriceList, onGetAdvertisementPriceLists } = this.props;
    const { advertisementPriceLists } = this.state;
    if (advertisementPriceLists.id !== undefined) {
      onDeleteAdvertisementPriceList(advertisementPriceLists);
      setTimeout(() => {
        onGetAdvertisementPriceLists(this.state.user_id);
      }, 1000);
      this.setState({ deleteModal: false });
    }
  };

  handleAdvertisementClick = (e, arg) => {
    const advertisementPriceList = arg;

    this.setState({
      advertisementPriceList: {
        id: advertisementPriceList.id,
        amount: advertisementPriceList.amount,
        number_of_days: advertisementPriceList.number_of_days,
        entered_at: advertisementPriceList.entered_at,
 
      },

      isEdit: true,
    });

    this.toggle();
  };

  render() {
    const { SearchBar } = Search;

    const { advertisementPriceLists } = this.props;

    const { isEdit, deleteModal } = this.state;

    const {
      onAddNewAdvertisementPriceList,
      onUpdateAdvertisementPriceList,
      onGetAdvertisementPriceLists,
    } = this.props;
    const advertisementPriceList = this.state.advertisementPriceList;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: 10, // replace later with size(advertisementPriceLists),
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
          onDeleteClick={this.handleDeleteAdvertisement}
          onCloseClick={() => this.setState({ deleteModal: false })}
        />
        <div className="page-content">
          <MetaTags>
            <title>Advertisement Price List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Advertisement Price List"
              breadcrumbItem="Advertisement Price List"
            />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.advertisementPriceListColumns}
                      data={advertisementPriceLists}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.advertisementPriceListColumns}
                          data={advertisementPriceLists}
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
                                      Add New Advertisement Price
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
                                      isOpen={this.state.modal}
                                      className={this.props.className}
                                    >
                                      <ModalHeader
                                        toggle={this.toggle}
                                        tag="h4"
                                      >
                                        {!!isEdit
                                          ? "Edit Quality Advertisement Price"
                                          : "Add Quality Advertisement Price"}
                                      </ModalHeader>
                                      <ModalBody>
                                        <Formik
                                          enableReinitialize={true}
                                          initialValues={{
                                            hiddenEditFlag: isEdit,

                                            amount:
                                              (this.state.advertisementPriceList &&
                                                this.state.advertisementPriceList
                                                  .amount) ||
                                              "",
                                            number_of_days:
                                              (this.state.advertisementPriceList &&
                                                this.state.advertisementPriceList
                                                  .number_of_days) ||
                                              "",
                                            
                                            entered_at:
                                              (this.state &&
                                                this.state.entered_at) ||
                                              "",
                                         
                                          }}
                                         
                                          onSubmit={values => {
                                            if (isEdit) {
                                              // if (
                                              //   !this.state.advertisementImg
                                              // ) {
                                              //   this.toDataURL(
                                              //     advertisementPriceList.poster
                                              //   ).then(dataUrl => {
                                              //     var fileData =
                                              //       this.dataURLtoFile(
                                              //         dataUrl,
                                              //         advertisementPriceList.poster
                                              //           .split("/")
                                              //           .at(-1)
                                              //       );
                                              //     this.setState({
                                              //       advertisementImg: fileData,
                                              //     });
                                                  const updateAdvertisementPriceList = {
                                                    id: advertisementPriceList.id,

                                                    amount: values.amount,
                                                    number_of_days:
                                                      values.number_of_days,
                                                   
                                                    entered_at: values.entered_at,
                                                  
                                                  };
                                                  // update Advertisement
                                                  onUpdateAdvertisementPriceList(
                                                    updateAdvertisementPriceList
                                                  );
                                                  setTimeout(() => {
                                                    onGetAdvertisementPriceLists(
                                                      this.state.user_id
                                                    );
                                                  }, 1000);
                                                
                                              // } else {
                                              //   const updateAdvertisementPriceList = {
                                              //     id: advertisementPriceList.id,

                                                 
                                              //     amount: values.amount,
                                              //     number_of_days:
                                              //       values.number_of_days,
                                                 
                                              //     entered_at: values.entered_at,
                                                
                                              //   };

                                              //   // update Advertisement
                                              //   onUpdateAdvertisementPriceList(
                                              //     updateAdvertisementPriceList
                                              //   );
                                              //   setTimeout(() => {
                                              //     onGetAdvertisementPriceLists(
                                              //       this.state.user_id
                                              //     );
                                              //   }, 1000);
                                              // }
                                            } else {
                                              const newAdvertisement = {
                                                id:
                                                  Math.floor(
                                                    Math.random() * (30 - 20)
                                                  ) + 20,

                                               
                                                  amount: values.amount,
                                                  number_of_days:
                                                    values.number_of_days,
                                                 
                                                  entered_at: values.entered_at,
                                              };

                                              // save new Advertisement
                                              onAddNewAdvertisementPriceList(
                                                newAdvertisement,
                                                this.state.user_id
                                              );
                                              setTimeout(() => {
                                                onGetAdvertisementPriceLists(
                                                  this.state.user_id
                                                );
                                              }, 1000);
                                            }
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
                                                       Amount
                                                    </Label>
                                                    <Field
                                                      name="amount"
                                                      type="text"
                                                      value={
                                                        this.state.advertisementPriceList
                                                          .amount
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          advertisementPriceList: {
                                                            id: advertisementPriceList.id,

                                                            amount:
                                                              e.target.value,
                                                            
                                                            number_of_days: advertisementPriceList.number_of_days,
                                                            entered_at:
                                                              advertisementPriceList.entered_at,
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
                                                   {/* Advertisement number of days price */}

                                                   <div className="mb-3">
                                                    <Label className="form-label">
                                                      Number of Days
                                                    </Label>
                                                    <Field
                                                      name="number_of_days"
                                                      type="text"
                                                      value={
                                                        this.state.advertisementPriceList
                                                          .number_of_days
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          advertisementPriceList: {
                                                            id: advertisementPriceList.id,

                                                            amount:
                                                              advertisementPriceList.amount,
                                                            
                                                            number_of_days: e.target.value,
                                                            entered_at:
                                                              advertisementPriceList.entered_at,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.number_of_days &&
                                                        touched.number_of_days
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="number_of_days"
                                                      component="div"
                                                      className="invalid-feedback"
                                                    />
                                                  </div>
                                               

                                                  {/* Advertisement  price posted date field */}

                                                  <div className="mb-3">
                                                    <Label className="form-label">
                                                      Entered Date
                                                    </Label>
                                                    <Field
                                                      name="entered_at"
                                                      type="date"
                                                      value={
                                                        this.state.advertisementPriceList
                                                          .entered_at
                                                      }
                                                      onChange={e => {
                                                        this.setState({
                                                          advertisementPriceList: {
                                                            id: advertisementPriceList.id,

                                                            amount:
                                                              advertisementPriceList.amount,
                                                            
                                                            number_of_days: advertisementPriceList.number_of_days,
                                                            entered_at:
                                                              e.target.value,
                                                          },
                                                        });
                                                      }}
                                                      className={
                                                        "form-control" +
                                                        (errors.entered_at &&
                                                        touched.entered_at
                                                          ? " is-invalid"
                                                          : "")
                                                      }
                                                    />
                                                    <ErrorMessage
                                                      name="entered_at"
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
  advertisementPriceLists: PropTypes.array,
  className: PropTypes.any,
  onGetAdvertisementPriceLists: PropTypes.func,
  onAddNewAdvertisementPriceList: PropTypes.func,
  onDeleteAdvertisementPriceList: PropTypes.func,
  onUpdateAdvertisementPriceList: PropTypes.func,
};

const mapStateToProps = ({ advertisementPriceLists }) => ({
  advertisementPriceLists: advertisementPriceLists.advertisementPriceLists,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAdvertisementPriceLists: id => dispatch(getAdvertisementPriceLists(id)),
  onAddNewAdvertisementPriceList: (advertisementPriceList, id) =>
    dispatch(addNewAdvertisementPriceList(advertisementPriceList, id)),
  onUpdateAdvertisementPriceList: advertisementPriceList =>
    dispatch(updateAdvertisementPriceList(advertisementPriceList)),
  onDeleteAdvertisementPriceList: advertisementPriceList =>
    dispatch(deleteAdvertisementPriceList(advertisementPriceList)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AdvertisementsList));
