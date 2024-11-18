import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter,selectFilter } from 'react-bootstrap-table2-filter';
import moment from "moment";

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
  FormGroup
} from "reactstrap";
import Flatpickr from "react-flatpickr";


import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getLabToken,getLabProfile,addNewCollectionPointTestAppointment } from "store/test-appointments/actions";

import "assets/scss/table.scss";

class LabTokens extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    const now = moment();
    this.state = {
      labProfiles:[],
      token: "",
      rating:"",
      main_lab_appointments: "Main",
      end_date: now.clone().endOf('month').format('DD MMM YYYY'),
      start_date: now.clone().startOf('month').format('DD MMM YYYY'),
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
          dataField: "lab_name",
          text: "Lab Name",
          sort: true,
          formatter: (cellContent, token) => (
            <div style={{ textAlign: "left" }}>
              {token.lab_name}
              <br />
            </div>
          ),
          filter: textFilter(),
        },
        {
          dataField: "lab_type",
          text: "Lab Type",
          sort: true,
          formatter: (cellContent, token) => (
            <>
            {token.lab_type == "Main Lab" && (
              <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                {token.lab_type}
              </span>

            )}
            {token.lab_type == "Collection Point" && (
              <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                {token.lab_type}
              </span>
            )}
          </>
          ),
          filter: selectFilter({
            options: {
              '': 'Both',
              'Main Lab': 'Main Lab',
              'Collection Point': 'Collection Point',
            },
            defaultValue: 'All',
          }),
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

  handleDateChange(date, field) {
    this.setState({ [field]: moment(date).format('DD MMM YYYY') }, () => {
      // Make the API call after the state has been updated
      const { onAddNewCollectionPointTestAppointment, onGetLabTokens } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      
      // API call with updated dates and lab type
      onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id);
      setTimeout(() => {
        onGetLabTokens(this.state.user_id);
      }, 1000);
    });
  }

  handleTestAppointmentType = e => {
    const { value } = e.target;
    this.setState({ main_lab_appointments: value }, () => {
      const { onAddNewCollectionPointTestAppointment, onGetLabTokens } = this.props;
      const { start_date, end_date, main_lab_appointments, user_id } = this.state;
      const updatedTestAppointments = { main_lab_appointments, start_date, end_date };
      setTimeout(() => {
        console.log(onAddNewCollectionPointTestAppointment(updatedTestAppointments, user_id));
      });
      setTimeout(() => {
        onGetLabTokens(this.state.user_id);
      }, 1000);

    });
  };
  
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
      totalSize: appointments.length, // replace later with size(labTokens),
      custom: true,
    };

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    return (
      
      console.log("hello",this.props.labProfiles.type),
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
                    last Token Series Generated:{" "}</strong>{lab.token_starting_value} {"-"}{lab.token_ending_value}
                  </span>
                </div>
                {/* <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    last Token Used:{" "}</strong>{lab.last_used_token} 
                  </span>
                </div>        */}
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Total Tokens:{" "}</strong>{lab.total_tokens} 
                  </span>
                </div>      
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Used Tokens:{" "}</strong>{lab.used_tokens} 
                  </span>
                </div> 
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Remaining Tokens:{" "}</strong>{lab.remaining_tokens} 
                  </span>
                </div>  
                <div>
                  <br></br>
                </div>
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Total Pending appointments Tokens :{" "}</strong>{lab.pending_appointments_count} 
                  </span>
                </div>   
                <div> <span className="font-size-13">
                  <strong className="text-danger ">
                    Total Confirmed appointments Tokens :{" "}</strong>{lab.confirmed_appointments_count} 
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
                              <Row className="mb-2">
                              <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>Start Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.start_date
                            }}
                            onChange={date => this.handleDateChange(date[0], 'start_date')}
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="4">
                        <FormGroup className="mb-0">
                          <Label>End Date</Label>
                          <Flatpickr
                            className="form-control d-block"
                            placeholder="dd M yyyy"
                            options={{
                              dateFormat: "d M Y",
                              defaultDate: this.state.end_date
                            }}
                            onChange={date => this.handleDateChange(date[0], 'end_date')}
                          />
                        </FormGroup>
                      </Col>
                                {/* <Col sm="4">
                                <div className="ms-2 mb-4">
                                    <div className="position-relative">
                                    {this.props.labProfiles.type === "Main Lab" && (
                                    <div>
                                      <Label for="main_lab_appointments" className="form-label">
                                      <strong>Search By Lab Type</strong>
                                      </Label>
                                      <select
                                        className="form-control select2"
                                        title="main_lab_appointments"
                                        name="main_lab_appointments"
                                        onChange={this.handleTestAppointmentType}
                                        
                                      >
                                        <option value="Main">Main</option>
                                        <option value="Collection">Collection</option>
                                        <option value="Both">Both</option>
                                      </select>
                                      <p className="text-danger font-size-10">Filter all completed appointments at your collection points.</p>

                                    </div>
                                  )}
                                    </div>
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
  labProfiles: PropTypes.array,
  appointments: PropTypes.array,
  className: PropTypes.any,
  onGetLabTokens: PropTypes.func,
  match: PropTypes.object,
  labProfiles: PropTypes.array,
  onGetLabProfile: PropTypes.func,
  location: PropTypes.object,
  onAddNewCollectionPointTestAppointment: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
};

const mapStateToProps = ({ testAppointments }) => {
  console.log("State in mapStateToProps:", testAppointments); // Log the whole state
  return {
    lab: testAppointments.lab || {}, // Access the lab directly
    appointments: testAppointments.appointments || [],
    labTokens: testAppointments.labTokens || [], // Ensure labTokens is always an array
    labProfiles: testAppointments.labProfiles || [], // Correcting this to labProfiles
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetLabTokens: id => dispatch(getLabToken(id)),
  onGetLabProfile: id => dispatch(getLabProfile(id)),
  onAddNewCollectionPointTestAppointment: (token, id) =>
    dispatch(addNewCollectionPointTestAppointment(token, id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabTokens));
