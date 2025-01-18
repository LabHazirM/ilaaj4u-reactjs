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

import { getSampleCollectors } from "store/sample-collectors/actions";
import HorizontalLayout from "components/HorizontalLayout";

class LabSampleCollectors extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      sampleCollectors: [],
      sampleCollector: "",
      collectorImg: "",
      modal: false,
      deleteModal: false,
      lab_name: "",
      // sampleCollectorListColumns: [
      //   {
      //     text: "id",
      //     dataField: "id",
      //     sort: true,
      //     hidden: true,
      //     formatter: (cellContent, sampleCollector) => (
      //       <>{sampleCollector.id}</>
      //     ),
      //   },
      //   {
      //     dataField: "img",
      //     text: "#",
      //     formatter: (cellContent, sampleCollector) => (
      //       <>
      //         {!sampleCollector.photo ? (
      //           <div className="avatar-sm">
      //             <span className="avatar-title rounded-circle">
      //               {sampleCollector.name.charAt(0)}
      //             </span>
      //           </div>
      //         ) : (
      //           <div>
      //             <img
      //               className="rounded-circle avatar-sm"
      //               src={
      //                 process.env.REACT_APP_BACKENDURL + sampleCollector.photo
      //               }
      //               alt=""
      //             />
      //           </div>
      //         )}
      //       </>
      //     ),
      //   },
      //   {
      //     dataField: "name",
      //     text: "Name",
      //     sort: true,
      //   },
      //   {
      //     dataField: "gender",
      //     text: "Gender",
      //     sort: true,
      //   },
      //   {
      //     dataField: "cnic",
      //     text: "CNIC",
      //     sort: true,
      //   },
      //   {
      //     dataField: "phone",
      //     text: "Mobile No.",
      //     sort: true,
      //   },
      // ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { sampleCollectors, onGetSampleCollectors } = this.props;
    onGetSampleCollectors();
    this.setState({ sampleCollectors,
      lab_name: this.props.sampleCollectors.length > 0 ? this.props.sampleCollectors[0].lab_name : ""
     });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.sampleCollectors !== this.props.sampleCollectors) {
      this.setState({
        sampleCollectors: this.props.sampleCollectors,
        lab_name: this.props.sampleCollectors.length > 0 ? this.props.sampleCollectors[0].lab_name : ""
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
  //   const { sampleCollectors } = this.props;
  //   if (
  //     isEmpty(prevProps.sampleCollectors) &&
  //     !isEmpty(sampleCollectors) &&
  //     size(sampleCollectors) !== size(prevProps.sampleCollectors)
  //   ) {
  //     this.setState({ sampleCollectors });
  //   }
  // }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  handlePageClick = page => {
    this.setState({ page });
  };

  render() {
    const { page, totalPage } = this.state;
    const { sampleCollectors } = this.props.sampleCollectors;
    const {lab_name } = this.state;
    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Home Sample Collectors List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            {/* <Breadcrumbs
              title="Home Sample Collectors"
              breadcrumbItem="Collectors List"
            /> */}
            <h4>Sample Collectors of {lab_name}</h4>
            <Row className="mb-3">
              <Row>
                {!isEmpty(this.props.sampleCollectors) &&
                  this.props.sampleCollectors.map((sampleCollector, key) => (
                    <Col xl="4" sm="6" key={"_col_" + key}>
                      <Card>
                        <CardBody>
                          <div className="product-img position-relative">
                            <img
                              src={
                                process.env.REACT_APP_BACKENDURL +
                                sampleCollector.photo
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

                          <div className="mt-4 text-center">
                            <h5 className="mb-2 text-truncate">
                                {sampleCollector.lab_name}{" "}
                            </h5>
                            <h5 className="mb-2 text-truncate">
                              {sampleCollector.name}{" "}
                            </h5>
                          

                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-account-question"></i>{" "}
                                Gender: {sampleCollector.gender}{" "}
                              </span>
                            </div> */}
                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-card-account-details"></i>{" "}
                                CNIC: {sampleCollector.cnic}{" "}
                              </span>
                            </div> */}
                            {/* <div className="my-0">
                              <span className="text-muted me-2">
                                <i className="mdi mdi-cellphone-android"></i>{" "}
                                Mobile No : {sampleCollector.phone}{" "}
                              </span>
                            </div> */}
                          </div>
                        </CardBody>
                      </Card>
                    </Col>
                  ))}

                {isEmpty(this.props.sampleCollectors) && (
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

              {/* <Row>
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
              </Row> */}
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabSampleCollectors.propTypes = {
  match: PropTypes.object,
  sampleCollectors: PropTypes.array,
  className: PropTypes.any,
  onGetSampleCollectors: PropTypes.func,
};

const mapStateToProps = ({ sampleCollectors }) => ({
  sampleCollectors: sampleCollectors.sampleCollectors,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetSampleCollectors: () =>
    dispatch(getSampleCollectors(ownProps.match.params.lab_account_id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabSampleCollectors));
