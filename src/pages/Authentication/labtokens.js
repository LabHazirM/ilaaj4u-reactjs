import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter,selectFilter } from 'react-bootstrap-table2-filter';

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

import { getLabToken,getLabProfile } from "store/test-appointments/actions";
import { isEmpty, size } from "lodash";

import "assets/scss/table.scss";

class LabTokens extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labProfile:[],
      token: "",
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
          formatter: (cellContent, token) => (
            <>{token.id}</>
          ),
        },
        {
          dataField: "token",
          text: "Token #",
          sort: true,
          formatter: (cellContent, token) => (
            <>
              {token.token}
              <br></br>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "order_id",
          text: "Order ID",
          sort: true,
          formatter: (cellContent, token) => (
            <>
              {token.order_id}
              <br></br>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "patient_name",
          text: "Patient Name",
          sort: true,
          formatter: (cellContent, token) => (
            <>
              {token.patient_name}
              <br></br>
            </>
          ),
          filter: textFilter(),
        },
        {
          dataField: "appointment_status",
          text: "Appointment Status",
          sort: true,
          formatter: (cellContent, token) => (
            <>
              {token.appointment_status == "Pending" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {token.appointment_status}
                </span>

              )}
              {token.appointment_status == "Confirmed" && (
                <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                  {token.appointment_status}
                </span>
              )}

              {token.appointment_status == "Sample Collected" && (
                <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                  {token.appointment_status}
                </span>
              )}

              {token.appointment_status == "Rescheduled" && (
                <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                  {token.appointment_status}
                </span>
              )}


              {token.appointment_status == "Result Uploaded" && (
                <span className="badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                  {token.appointment_status}
                </span>
              )}

            </>
          ),
          filter: selectFilter({
            options: {
              '': 'All',
              'Pending': 'Pending',
              'Confirmed': 'Confirmed',
              'Sample Collected': 'Sample Collected',
              'Rescheduled': 'Rescheduled',
              'Result Uploaded': 'Result Uploaded',
            },
            defaultValue: 'All',
          }),
        },          
      ],
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { onGetLabTokens, onGetLabProfile } = this.props;

    if (this.state.user_id) {
      onGetLabTokens(this.state.user_id);
      onGetLabProfile(this.state.user_id);
    } else {
      console.error("User ID is not defined");
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.labTokens !== this.props.labTokens) {
        console.log("labTokens updated:", this.props.labTokens);
        // Any additional logic can go here
    }
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
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

    const { lab, appointments, labTokens } = this.props;

  console.log("Lab in Render:", lab); // Log lab data
  console.log("Lab Tokens in Render:", labTokens); // Log labTokens
  console.log("Appointments in Render:", appointments); 

    // const labprofile=this.state.labprofile;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: labTokens.length, // replace later with size(labTokens),
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
            <title>Lab Token Detail Page | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs
              title="Detail"
              breadcrumbItem="Tokens Detail Page"
            />
            <Row className="justify-content-center">
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Total Tokens:{" "}</strong><b>{lab.total_tokens} </b>({lab.token_starting_value}-{lab.token_ending_value})
                  </span>
                </div>
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Tokens Used:{" "}</strong><b>{lab.used_tokens_count}</b> ({lab.used_tokens_range ? `${lab.used_tokens_range.min}-${lab.used_tokens_range.max}` : 'N/A'})
                  </span>
                </div>
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Tokens Left:{" "}</strong><b>{lab.remaining_tokens}</b>({lab.remaining_tokens_range ? `${lab.remaining_tokens_range.min}-${lab.remaining_tokens_range.max}` : 'N/A'})
                  </span>
                </div>
                
              <Col lg="8">
                <Card>
                  <CardBody>
                    
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.feedbackListColumns}
                      data={appointments}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.feedbackListColumns}
                          data={appointments}
                          search
                        >
                          
                          {toolkitprops => (
                            <React.Fragment>
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

LabTokens.propTypes = {
  match: PropTypes.object,
  labTokens: PropTypes.array,
  lab: PropTypes.object,
  labProfile: PropTypes.array,
  appointments: PropTypes.array,
  className: PropTypes.any,
  onGetLabTokens: PropTypes.func,
  match: PropTypes.object,
  onGetLabProfile: PropTypes.func,
  location: PropTypes.object,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ testAppointments }) => {
  console.log("State in mapStateToProps:", testAppointments); // Log the whole state
  return {
    lab: testAppointments.lab || {}, // Access the lab directly
    appointments: testAppointments.appointments || [],
    labTokens: testAppointments.labTokens || [], // Ensure labTokens is always an array
    labProfile: testAppointments.labProfiles || [], // Correcting this to labProfiles
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabTokens: id => dispatch(getLabToken(id)),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabTokens));
