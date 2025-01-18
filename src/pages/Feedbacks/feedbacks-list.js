import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getFeedbacks } from "store/feedbacks/actions";
import { getLabProfile } from "../../store/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class FeedbacksList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      feedbacks: [],
      labProfile:[],
      feedback: "",
      rating:"",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      feedbackListColumns: [
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, feedback) => <>{feedback.id}</>,
          filter: textFilter(),
        },
        {
          dataField: "order_id",
          text: "Order id",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Name",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "city",
          text: "City",
          sort: true,
          filter: textFilter(),
        },
        {
          dataField: "rating",
          text: "Rating",
          sort: true,
          formatter: (cellContent, feedback) => (
            <StarRatings
              rating={feedback.rating}
              starRatedColor="#F1B44C"
              starEmptyColor="#2D363F"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="3px"
            />
          ),
          filter: textFilter(),
        },
        
        {
          dataField: "review",
          text: "Review",
          sort: true,
          filter: textFilter(),
        },
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { feedbacks, onGetFeedbacks } = this.props;
    onGetFeedbacks(this.state.user_id);
    this.setState({ feedbacks });
    const { labProfile, onGetLabProfile } = this.props;
    console.log(onGetLabProfile(this.state.user_id));
    this.setState({ labProfile }); 
    console.log("state",labProfile)
    console.log("state tyoeeee", typeof labProfile)

  }
 

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { feedbacks } = this.props;
    if (!isEmpty(feedbacks) && size(prevProps.feedbacks) !== size(feedbacks)) {
      this.setState({ feedbacks: {}, isEdit: false });
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

  render() {
    const { SearchBar } = Search;

    const { feedbacks, labProfile } = this.props;
    console.log("type render", typeof labProfile)


    const { onGetFeedbacks, onGetLabProfile } = this.props;
    const feedback = this.state.feedback;
    // const labprofile=this.state.labprofile;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: feedbacks.length, // replace later with size(feedbacks),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      
      console.log("hello",this.props.labProfile.type),
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Feedbacks List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Feedbacks" breadcrumbItem="List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={feedbacks}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={feedbacks}
                          search
                        >
                          
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                {/* <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
                                  </div>
                                </Col> */}
                                <Col sm="10" lg="10">
                                  <div className="text-center">
                                    <strong>Total Rating of the Lab:</strong>
                            <StarRatings
                              rating={labProfile.rating}
                              // rating={5}
                              starRatedColor="#F1B44C"
                              starEmptyColor="#2D363F"
                              numberOfStars={5}
                              name="rating"
                              starDimension="20px"
                              starSpacing="3px"
                            />
                       
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
                                      filter={ filterFactory() }
                                    />
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

FeedbacksList.propTypes = {
  match: PropTypes.object,
  feedbacks: PropTypes.array,
  labProfile: PropTypes.array,
  className: PropTypes.any,
  onGetFeedbacks: PropTypes.func,
  match: PropTypes.object,
  onGetLabProfile: PropTypes.func,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ feedbacks}) => ({
  feedbacks: feedbacks.feedbacks,
  labProfile:feedbacks.labProfile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetFeedbacks: id => dispatch(getFeedbacks(id)),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FeedbacksList));
