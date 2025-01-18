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
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
} from "reactstrap";

import { isEmpty, map, size } from "lodash";

import "nouislider/distribute/nouislider.css";

// import Header
import Header from "components/HorizontalLayout/Header";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { any } from "prop-types";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  getPathologists,
  addNewPathologist,
  updatePathologist,
  deletePathologist,
} from "store/pathologists/actions";

import HorizontalLayout from "components/HorizontalLayout";

class LabPathologists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      pathologists: [],
      pathologist: "",
      modal: false,
      deleteModal: false,
      lab_name: "",
      // pathologistListColumns: [
      //   {
      //     text: "id",
      //     dataField: "id",
      //     sort: true,
      //     hidden: true,
      //     formatter: (cellContent, pathologist) => <>{pathologist.id}</>,
      //   },
      //   {
      //     dataField: "name",
      //     text: "Name",
      //     sort: true,
      //   },
      //   {
      //     dataField: "email",
      //     text: "Email",
      //     sort: true,
      //   },
      //   {
      //     dataField: "phone",
      //     text: "Phone No.",
      //     sort: true,
      //   },
      //   {
      //     dataField: "landline",
      //     text: "Landline",
      //     sort: true,
      //   },
      //   {
      //     dataField: "designation",
      //     text: "Designation",
      //     sort: true,
      //   },
      //   {
      //     dataField: "is_available_for_consultation",
      //     text: "Available for consultation",
      //     sort: true,
      //   },
      //   {
      //     dataField: "is_available_on_whatsapp",
      //     text: "Available on WhatsApp",
      //     sort: true,
      //   },
      //   {
      //     dataField: "is_associated_with_pap",
      //     text: "Associated with PAP",
      //     sort: true,
      //   },
      // ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { pathologists, onGetPathologists } = this.props;
    onGetPathologists();
    this.setState({ 
      pathologists,
      lab_name: this.props.pathologists.length > 0 ? this.props.pathologists[0].lab_name : ""
     });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.pathologists !== this.props.pathologists) {
      this.setState({
        pathologists: this.props.pathologists,
        lab_name: this.props.pathologists.length > 0 ? this.props.pathologists[0].lab_name : ""
      });
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   const { pathologists } = this.props;
  //   if (
  //     isEmpty(prevProps.pathologists) &&
  //     !isEmpty(pathologists) &&
  //     size(pathologists) !== size(prevProps.pathologists)
  //   ) {
  //     this.setState({ pathologists });
  //   }
  // }

  // onPaginationPageChange = page => {
  //   if (
  //     this.node &&
  //     this.node.current &&
  //     this.node.current.props &&
  //     this.node.current.props.pagination &&
  //     this.node.current.props.pagination.options
  //   ) {
  //     this.node.current.props.pagination.options.onPageChange(page);
  //   }
  // };

  render() {
    const { page, totalPage } = this.state;
    const { pathologists } = this.props.pathologists;
    const {lab_name } = this.state;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Pathologists List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            {/* <Breadcrumbs
              title="Pathologists"
              breadcrumbItem="Pathologists List"
            />{" "} */}
            <h4>Pathologists of {lab_name}</h4>
            <Row>
              <Row>
                {!isEmpty(this.props.pathologists) &&
                  this.props.pathologists.map((pathologist, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          {pathologist.photo && (
                            <div className="product-img position-relative">
                              <img
                                src={
                                  process.env.REACT_APP_BACKENDURL +
                                  pathologist.photo
                                }
                                alt="Sample Collector Photo"
                                style={{
                                  width: "300px",
                                  height: "200px",
                                  objectFit: "cover",
                                }}
                                className="img-fluid mx-auto d-block"
                              />
                            </div>
                          )}

                          <div className="mt-4 text-center">
                          <h5 className="mb-2 text-truncate">
                                {pathologist.lab_name}{" "}
                              </h5>
                            <h5 className="mb-2 text-truncate">
                              {pathologist.name}{" "}
                            </h5>
                          
                           {/* {pathologist.designation && <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-account-star"></i>{" "}
                                Designation : {pathologist.designation}{" "}
                              </span>
                            </div>
  }
                           {pathologist.email &&   <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-email"></i> Email :{" "}
                                {pathologist.email}{" "}
                              </span>
                            </div>
  }
                            {pathologist.phone && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-cellphone-android"></i>{" "}
                                  Mobile No/ WhatsApp: {pathologist.phone}{" "}
                                </span>
                              </div>
                            )} */}

                          {/* {
                              pathologist.landline && (
                                <div className="my-0">
                                  <span className="text-muted me-2">
                                    <i className="mdi mdi-phone"></i> Landline
                                    No : {pathologist.landline}{" "}
                                  </span>
                                </div>
                              )} */}
                            {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="fas fa-user-clock"></i> 
                                  {" "}
                                  Available for Consultation : {pathologist.is_available_for_consultation}{" "}
                                </span>
                              </div> */}
                            {/* <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="fas fa-user-check"></i> 
                                  {" "}
                                  Available on WhatsApp : {pathologist.is_available_on_whatsapp}{" "}
                                </span>
                              </div> */}

                            {pathologist.qualification && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-account-tie"></i>{" "}
                                  Qualification: {pathologist.qualification}{" "}
                                </span>
                              </div>
                            )}

                            {pathologist.speciality && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-account-star"></i>{" "}
                                  Speciality: {pathologist.speciality}{" "}
                                </span>
                              </div>
                            )}

                            {pathologist.pmdc_reg_no && (
                              <div className="my-0">
                                <span className="text-muted me-2">
                                  <i className="mdi mdi-card-account-details-star"></i>{" "}
                                  PMDC Reg No: {pathologist.pmdc_reg_no}{" "}
                                </span>
                              </div>
                            )}

                    {this.state.pathologists.is_available_for_consultation == "Yes" &&
                          <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-check-circle"></i>{" "}
                                      Available for Online Consultation:{" "}
                                      {pathologist.is_available_for_consultation}{" "}
                                    </span>
                                  </div>
  }
                                   {this.state.pathologists.is_available_on_whatsapp == "Yes"
                                   && <div className="my-0">
                                    <span className="text-muted me-2">
                                      <i className="mdi mdi-cellphone-message"></i>{" "}
                                      Available on WhatsApp:{" "}
                                      {pathologist.is_available_on_whatsapp}{" "}
                                    </span>
                                  </div>
  }
                    {this.state.pathologists.is_associated_with_pap == "Yes"
                           && <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="bx bxs-certification"></i>{" "}
                                Associated with PAP :{" "}
                                {pathologist.is_associated_with_pap}{" "}
                              </span>
                            </div>
  }
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.pathologists) && (
                  <Row>
                    <Col lg="12">
                      <div className=" mb-5">
                        <h4 className="text-uppercase">
                          Sorry, no result found.
                        </h4>
                      </div>
                    </Col>
                  </Row>
                )}
              </Row>
              <Row>
                <Col lg="12">
                  <Pagination className="pagination pagination-rounded justify-content-end mb-2">
                    <PaginationItem disabled={page === 1}>
                      <PaginationLink
                        previous
                        href="#"
                        onClick={() => this.handlePageClick(page - 1)}
                      />
                    </PaginationItem>
                    {map(Array(totalPage), (item, i) => (
                      <PaginationItem active={i + 1 === page} key={i}>
                        <PaginationLink
                          onClick={() => this.handlePageClick(i + 1)}
                          href="#"
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={page === totalPage}>
                      <PaginationLink
                        next
                        href="#"
                        onClick={() => this.handlePageClick(page + 1)}
                      />
                    </PaginationItem>
                  </Pagination>
                </Col>
              </Row>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabPathologists.propTypes = {
  match: PropTypes.object,
  pathologists: PropTypes.array,
  className: PropTypes.any,
  onGetPathologists: PropTypes.func,
};

const mapStateToProps = ({ pathologists }) => ({
  pathologists: pathologists.pathologists,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPathologists: () =>
    dispatch(getPathologists(ownProps.match.params.lab_account_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabPathologists));
