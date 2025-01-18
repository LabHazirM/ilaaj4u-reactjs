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

import { getLabsTesting } from "store/labs-testing/actions";
import { getLabProfile } from "../../store/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class LabsRating extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsTesting: [],
      labProfile:[],
      labsrating: "",
      rating:"",
      modal: false,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { labsTesting, onGetLabsTesting } = this.props;
    onGetLabsTesting(this.state.user_id);
    this.setState({ labsTesting });
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
    const { labsTesting } = this.props;
    if (!isEmpty(labsTesting) && size(prevProps.labsTesting) !== size(labsTesting)) {
      this.setState({ labsTesting: {}, isEdit: false });
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

    const columns=[
    
        {
          text: "id",
          dataField: "id",
          sort: true,
          hidden: true,
          formatter: (cellContent, labsrating) => <>{labsrating.id}</>,
          filter: textFilter(),
          headerStyle: { backgroundColor: '#DCDCDC' },
        },
        // {
        //   dataField: "order_id",
        //   text: "Order id",
        //   sort: true,
        //   filter: textFilter(),
        // },
      
{
  dataField: "name",
  text: "Lab Name",
  sort: true,
  formatter: (cellContent, labsrating) => (
        <div className=" text-black fw-bold p-2">
      {cellContent}</div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#D3A2A1',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "city",
  text: "City",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#ECB6B3',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "type",
  text: "Lab Type",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#C57E7C',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "address",
  text: "Address",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#ECB6B3',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "district",
  text: "District",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#C57E7C',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "registered_by",
  text: "Registered_By",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#ECB6B3',fontFamily: 'Calibri', fontSize: '16px'  },
},
{
  dataField: "email",
  text: "Email",
  sort: true,
  formatter: (cellContent, labsrating) => (
    <div className="text-black fw-bold p-2">
      {cellContent}
    </div>
  ),
  headerStyle: { backgroundColor: '#B05450',fontFamily: 'Calibri', fontSize: '16px'  },
  style: {backgroundColor: '#C57E7C',fontFamily: 'Calibri', fontSize: '16px'  },
},
        
        // {
        //   dataField: "review",
        //   text: "Review",
        //   sort: true,
        //   filter: textFilter(),
        // },
      
    ]
    const { SearchBar } = Search;

    const { labsTesting } = this.props;
    console.log("type render", typeof labProfile)


    const { onGetLabsTesting } = this.props;
    const labsrating = this.state.labsTesting;
    // const labprofile=this.state.labprofile;

    const pageOptions = {
      sizePerPage: 3,
      totalSize: labsTesting.length, // replace later with size(labsTesting),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      
      // console.log("hello",this.props.labProfile.type),
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Labs Rating List | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Labs Testing" breadcrumbItem="Labs Rating List" />
            <Row>
              <Col lg="12">
                <Card>
                  <CardBody>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={labsTesting}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={labsTesting}
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
                                {/* <Col sm="10" lg="10">
                                  <div className="text-center">
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
                                </Col> */}
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
                                      columns={columns}
                                  
                                      headerWrapperClasses={"table-dark"}
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

LabsRating.propTypes = {
  match: PropTypes.object,
  labsTesting: PropTypes.array,
  labProfile: PropTypes.array,
  className: PropTypes.any,
  onGetLabsTesting: PropTypes.func,
  match: PropTypes.object,
  onGetLabProfile: PropTypes.func,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ labsTesting}) => ({
  labsTesting: labsTesting.labsTesting,
  labProfile:labsTesting.labProfile,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabsTesting:  () => dispatch(getLabsTesting()),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsRating));
