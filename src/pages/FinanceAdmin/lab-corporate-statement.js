import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import {
  Card,
  CardBody,
  Col,
  Container,
  ModalHeader,
  Row,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import filterFactory, { textFilter, selectFilter } from 'react-bootstrap-table2-filter';
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";

//Import Breadcrumb
import * as Yup from "yup";
import Breadcrumbs from "components/Common/Breadcrumb";
import {
  getLcList,
} from "store/labs-list/actions";


class LabsLists extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      labsList: [],
      id: "",
      LabsLists: "",
      btnText: "Copy",
      selectedLab: null,
      labsData: [], // Default value is an empty array
      labsList: "",
      startDate: null,
      endDate: null,
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
        labsListListColumns: [
          {
            dataField: "id",
            text: "ID",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                <strong>{labsList.id}</strong>
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "order_id",
            text: "Order ID",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {labsList.order_id}
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "corporate_name",
            text: "Corporate Name",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
               {labsList.corporate_name}
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "patient_name",
            text: "Patient Name",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
               {labsList.patient_name}
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "lab_name",
            text: "Lab Name",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
              <span className="float-start">
                <Link
                      to="#"
                      onClick={e => this.openPatientModal(e, labsList)}
                    >
                     {labsList.lab_name}
                    </Link>
              </span>
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "is_home_sampling_availed",
            text: "Home sampling",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {labsList.is_home_sampling_availed == true || labsList.is_state_sampling_availed == true ? (
                  <span>Yes</span>
                ) : (
                  <span>No</span>
                )}
              </>
            ),
            filter: selectFilter({
              options: {
                '': 'All',
                'true': 'Yes',
                'false': 'No',
              },
              defaultValue: 'All',
            }),
          },
          {
            dataField: "status",
            text: "Payment Status",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {labsList.status == "Not Paid" ? (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                    {labsList.payment_method},{" "}
                    {labsList.status}
                  </span>
                ) : (
                  <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                    {labsList.payment_method},{" "}
                    {labsList.status}
                  </span>
                )}
              </>
            ),
            filter: selectFilter({
              options: {
                '': 'All',
                'Paid': 'Paid',
                'Allocate': 'Allocate',
              },
              defaultValue: 'All',
            }),
          },
          {
            dataField: 'appointment_status',
            text: 'Appointment Status',
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {labsList.appointment_status == "Pending" && (
                  <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {labsList.appointment_status}
                  </span>
  
                )}
                {labsList.appointment_status == "Confirmed" && (
                  <span className="badge rounded-pill badge-soft-primary font-size-12 badge-soft-info">
                    {labsList.appointment_status}
                  </span>
                )}
  
                {labsList.appointment_status == "Sample Collected" && (
                  <span className="badge rounded-pill badge-soft-warning font-size-12 badge-soft-warning">
                    {labsList.appointment_status}
                  </span>
                )}
  
                {labsList.appointment_status == "Rescheduled" && (
                  <span className="badge rounded-pill badge-soft-danger font-size-12 badge-soft-danger">
                    {labsList.appointment_status}
                  </span>
                )}
  
  
                {labsList.appointment_status == "Result Uploaded" && (
                  <span className="badge rounded-pill badge-soft-success font-size-12 badge-soft-success">
                    {labsList.appointment_status}
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
          {
            dataField: "amount",
            text: "Invoice value",
            sort: true,
            formatter: (cellContent, labsList) => (
              <span  className="float-end">
              {(labsList.amount || "--").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            ),filter: textFilter(), // Add a text filter for this column
          },
          
          {
            dataField: "Receivable",
            text: "Lab Payable",
            sort: true,
            formatter: (cellContent, labsList) => (
              <span  className="float-end">
              {(labsList.Receivable || "--").toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            ),filter: textFilter(), // Add a text filter for this column
          },
          
          {
            dataField: "plateform_fees",
            text: "LabHazir Payable",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
               {`${(labsList.plateform_fees * 100)}%`}
              </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "payable",
            text: "Referral Fee",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
              {`${(labsList.payable * 100)}%`}
            </>
            ),filter: textFilter(), // Add a text filter for this column
          },
          {
            dataField: "generated_at",
            text: "Generated At",
            sort: true,
            formatter: (cellContent, labsList) => {
              const date = new Date(labsList.generated_at);
              const day = date.getDate();
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const month = monthNames[date.getMonth()];
              const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
          
              return (
                  <p className="text-muted mb-0">
                      {`${day}-${month}-${year}`}
                  </p>
              );
          },
          filter: textFilter(),
          },
          {
            dataField: "booked_at",
            text: "Booked At",
            sort: true,
            formatter: (cellContent, labsList) => (
              <>
                {moment(labsList.booked_at).format("DD MMM YYYY")}
              </>
            ),filter: textFilter(),
          },
          {
            dataField: "paid_at",
            text: "Paid At",
            sort: true,
            formatter: (cellContent, labsList) => {
              const date = new Date(labsList.paid_at);
              const day = date.getDate();
              const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const month = monthNames[date.getMonth()];
              const year = date.getFullYear().toString().slice(-2); // Get the last 2 digits of the year
          
              return (
                  <p className="text-muted mb-0">
                      {`${day}-${month}-${year}`}
                  </p>
              );
          },
          filter: textFilter(),
          },
        ],
    };
  }
  componentDidMount() {
    
    const currentMonthStart = moment().startOf("month");
    const currentMonthEnd = moment().endOf("month");

    this.setState({
      startDate: currentMonthStart.toDate(),
      endDate: currentMonthEnd.toDate(),
    });

    this.fetchData();

  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.startDate !== this.state.startDate ||
      prevState.endDate !== this.state.endDate
    ) {
      // Fetch data based on date filters
      this.fetchData();
    }

    if (
      this.props.labsList.length > 0 &&
      this.props.labsList !== prevProps.labsList
    ) {
      const lastIndex = this.props.labsList.findIndex((statement) => {
        const statementDate = new Date(statement.booked_at);
        const labFilter = !this.state.selectedLab || statement.lab_name === this.state.selectedLab;
        return (
          statementDate >= this.state.startDate &&
          statementDate <= this.state.endDate &&
          labFilter
        );
      });

      // Do something with lastIndex if needed
    }
  }

  fetchData = () => {
    if (this.state.user_id) {
      const { onGetDonorsA } = this.props;
      const userId = this.state.user_id; // If it's always user_id, no need for conditional check

      // Only make the API call if both start and end dates are selected
      if (this.state.startDate && this.state.endDate) {
        onGetDonorsA(userId);
      }
    }
  };

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal,
    }));
  }
  openNamePatientModal = (e, arg) => {
    this.setState({
      NamePatientModal: true,
      patient_phone: arg.patient_phone,
      patient_age: arg.patient_age,
      patient_gender: arg.patient_gender,
    });
  };
  openPatientModal = (e, arg) => {
    this.setState({
      PatientModal: true,
      lab_address: arg.lab_address,
      lab_city: arg.lab_city,
      lab_phone: arg.lab_phone,
      //lab_email: arg.lab_email,
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
  toggleNamePatientModal = () => {
    this.setState(prevState => ({
      NamePatientModal: !prevState.NamePatientModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
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
    const { startDate, endDate, labsData } = this.state;
    const { labsList } = this.props;
  
    const uniqueLabNames = [...new Set(this.props.labsList.map(labsList => labsList.lab_name))];
    const uniqueCorporateNames = [...new Set(this.props.labsList.map(labsList => labsList.corporate_name))];

    // Generate labOptions for the <select> dropdown
    const labOptions = uniqueLabNames.map((labName, index) => (
      <option key={index} value={labName}>
        {labName}
      </option>
    ));
  
    const corporateOptions = uniqueCorporateNames.map((corporateName, index) => (
      <option key={index} value={corporateName}>
        {corporateName}
      </option>
    ));

    const filteredStatements = labsList.filter((statement) => {
      const orderedAt = moment(statement.booked_at);
      const labFilter = !this.state.selectedLab || statement.lab_name === this.state.selectedLab;
      const CorporateFilter = !this.state.selectedCorporate || statement.corporate_name === this.state.selectedCorporate;
      return (
        labFilter && CorporateFilter &&
        (!startDate || orderedAt.isSameOrAfter(startDate)) &&
        (!endDate || orderedAt.isSameOrBefore(endDate))
      );
    });
    
     // Sort statements based on booked_at in ascending order
     filteredStatements.sort((a, b) => {
      return moment(a.booked_at) - moment(b.booked_at);
    });

    const pageOptions = {
      sizePerPage: 1000,
      totalSize: labsList.length, 
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
        <div className="page-content">
          <MetaTags>
          <title>Lab Corporate Statement | Lab Hazir</title>
          </MetaTags>

          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="List" breadcrumbItem="Lab Corporate Statements" />
            <Row>
              <Col lg="12">

                <Card>
                  <CardBody>
                  <Row>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">Start Date:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => this.setState({ startDate: date })}
                    className="form-control"
                    dateFormat="d MMM yyyy"

                  />
                </div></Col>
              <Col lg="3">
                <div className="mb-3">
                  <label className="form-label">End Date:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    className="form-control"
                    dateFormat="d MMM yyyy"

                  />
                </div>

              </Col>
             <Col lg="3">
  <div className="mb-3">
    <label className="form-label">Select Lab</label>
    <select
      value={this.state.selectedLab}
      onChange={(e) => this.setState({ selectedLab: e.target.value })}
      className="form-control"
    >
      <option value="">All Labs</option>
      {labOptions}
    </select>
  </div>
</Col>
<Col lg="3">
  <div className="mb-3">
    <label className="form-label">Select Corporate</label>
    <select
      value={this.state.selectedCorporate}
      onChange={(e) => this.setState({ selectedCorporate: e.target.value })}
      className="form-control"
    >
      <option value="">All Corporates</option>
      {corporateOptions}
    </select>
  </div>
</Col>

            </Row>
                    <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.labsListListColumns}
                      data={labsList}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.labsListListColumns}
                          data={filteredStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    {/* <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div> */}
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
                                      filter={filterFactory()} // Enable filtering for the entire table
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
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Lab Address
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_address                                                        
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      City
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-9">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_city
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>
                                                </div>

                                                <div className="mb-3 row">
                                                  <div className="col-md-3">
                                                    <Label className="form-label">
                                                      Contact No.
                                                    </Label>
                                                  </div>
                                                  <div className="col-md-6">
                                                    <input
                                                      type="text"
                                                      value={
                                                        this.state.lab_phone
                                                      }
                                                      className="form-control"
                                                      readOnly={true}
                                                    />
                                                  </div>

                                                  <div className="col-md-3">
                                                    <button
                                                      type="button"
                                                      className="btn btn-secondary"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(
                                                          this.state.lab_phone
                                                        );
                                                        this.setState({
                                                          btnText: "Copied",
                                                        });
                                                      }}
                                                    >
                                                      {this.state.btnText}
                                                    </button>
                                                  </div>
                                                </div>
                                              </Col>
                                            </Row>
                                          </Form>
                                        </Formik>
                                      </ModalBody>
                                  </Modal>
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
                                <Col className="pagination pagination-rounded justify-content-end mb-2">
                                  <PaginationListStandalone
                                    {...paginationProps}
                                  />
                                </Col>
                              </Row> */}
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

LabsLists.propTypes = {
  match: PropTypes.object,
  labsList: PropTypes.array,
  className: PropTypes.any,
  onGetDonorsA: PropTypes.func,
};
const mapStateToProps = ({ labsList}) => ({
  labsList: labsList.labsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorsA: id => dispatch(getLcList(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabsLists));
