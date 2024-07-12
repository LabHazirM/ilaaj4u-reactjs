import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { isEmpty, map } from "lodash";

import {
  Card,
  Input,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Label,
  Modal,
  ModalBody,
} from "reactstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";
import { getPatientsList } from "store/patients-list/actions";
import "assets/scss/table.scss";
// import { color } from "html2canvas/dist/types/css/types/color";

class PatientsList extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      patients: [],
      // id: "",
      patient: "",
      phone: "",
      guest_id: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      showNoResultMessage: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    console.log("uuuuuuid", this.props.match.params.uuid)
    const { patients, onGetPatientsList } = this.props;
    onGetPatientsList(this.state.user_id);
    this.setState({ patients });
    console.log("guest", this.props.match.params.guest_id)
  }
  handleBlur = () => {
    // Reset the showNoResultMessage state to false before performing the search
    this.setState({ showNoResultMessage: false });

    // Calling API when focus is out of the text name and setting nearby tests array
    const { onGetPatientsList } = this.props;
    const data = {
      phone: this.state.phone,
    };

    onGetPatientsList(data);

    setTimeout(() => {
      // Update the patients state with the search results
      this.setState({ patients: this.props.patients }, () => {
        // Check if the patients array is empty after the search
        if (isEmpty(this.props.patients)) {
          // Show the "Sorry no result found" message immediately
          this.setState({ showNoResultMessage: true });
        }
      });
    }, 200);
  };
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

    const { patients } = this.props;
    const { onGetPatientsList } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: patients.length, // replace later with size(patients),
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
            <title>Patients Search | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Patients" breadcrumbItem="Patients Search" />
            <Row className="mb-2 g-0">
              <Col sm="2" lg="2">
                <div className="d-flex flex-column mb-2">
                  <Label
                    for="LabType1"
                    className="form-label"
                    style={{
                      fontSize: window.innerWidth <= 576 ? "6px" : "12px",
                    }}
                  >
                    Search By Phone No
                  </Label>
                  <div className="d-flex align-items-center mt-2">
                    <Input
                      type="text"
                      className="form-control"
                      name="phone"
                      placeholder="Search Phone..."
                      onChange={(e) =>
                        this.setState({
                          phone: e.target.value,
                        })
                      }
                      value={this.state.phone}
                      style={{ width: "300px" }} // Set the width for the input
                    />
                    <button
                      onClick={this.handleBlur}
                      className="bx bx-search-alt"
                      style={{
                        fontSize: "32px",
                        color: "white",
                        background: "blue",
                        border: "none",
                        // marginLeft: "5px", // Add some space between the input and the button
                      }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Card >
              <CardBody>
                <div className="table-responsive">
                  <Table className="table-nowrap">
                    <thead>
                      <tr>
                        <th className="text-start">Account id</th>
                        <th className="text-start">Name</th>
                        <th className="text-start">Email</th>
                        <th className="text-start">City</th>
                        <th className="text-start">is_assosiatewith_anycorporate</th>
                        <th className="text-start">employee_id_card</th>
                        <th className="text-start">Appointments</th>
                        <th className="text-start"></th>



                      </tr>
                    </thead>
                    {patients.length > 0 ? (
                      patients.map((patient, key) => (
                        <tr key={"_row_" + key}>
                          <td className="text-start py-2 pl-3 pr-4">{patient.account_id}</td>
                          <td className="text-start py-2 pl-3 pr-4">
                            {patient.name}
                          </td>
                          <td className="text-start py-2 pl-3 pr-4">{patient.email}</td>
                          <td className="text-start py-2 pl-3 pr-4">{patient.city}</td>
                          <td className="text-start py-2 pl-3 pr-4">{patient.is_assosiatewith_anycorporate}</td>
                          <td className="text-start py-2 pl-3 pr-4">{patient.employee_id_card}</td>
                          <td className="text-center py-2 pl-3 pr-4">

                            <Link
                              style={{ background: 'transparent' }}
                              className="fas fa-calendar font-size-18"
                              to={
                                this.props.match.params.uuid
                                  ? `/test-appointments/${this.props.match.params.uuid}/${patient.account_id}`
                                  : `/test-appointments/${patient.account_id}`}
                            ></Link>
                          </td>
                          <td className="text-center py-2 pl-3 pr-4">
  {console.log("corporate patient", patient.is_assosiatewith_anycorporate, patient.employee_id_card)}
  {patient.is_assosiatewith_anycorporate && patient.employee_id_card ? (
    <button
      className="btn btn-primary font-size-14"
      onClick={() => {
        const uuid = this.props.match.params.uuid;
        const accountId = patient.corporate_id;
        const patientaccountId = patient.account_id;
        const url = uuid
          ? `/corporate-patients-book-appointments/${uuid}/${patientaccountId}/${accountId}`
          : `/corporate-patients-book-appointments/${patientaccountId}/${accountId}`;

        // Perform any additional actions or navigation logic here

        // For navigation, you can use react-router-dom's history or other navigation methods
        this.props.history.push(url);
      }}
    >
      Book Appointment
    </button>
  ) : (
    <button
      className="btn btn-primary font-size-14"
      onClick={() => {
        const uuid = this.props.match.params.uuid;
        const accountId = patient.account_id;
        const url = uuid
          ? `/tests-offered-labhazir/${uuid}/${accountId}`
          : `/tests-offered-labhazir/${accountId}`;

        // Perform any additional actions or navigation logic here

        // For navigation, you can use react-router-dom's history or other navigation methods
        this.props.history.push(url);
      }}
    >
      Book Appointment
    </button>
  )}
</td>


                        </tr>
                      ))
                    ) : null}

                    {isEmpty(patients) && (
                      <Row>
                        <div className=" mt-5">
                          <h4 className="text-primary" style={{ fontSize: "18px" }}>
                            &quot;Labhazir will display patient details only when you provide the correct phone number.&quot;
                          </h4>
                        </div>
                      </Row>
                    )}
                  </Table>
                </div>
              </CardBody>
            </Card>


          </Container>
        </div>
      </React.Fragment>
    );
  }
}

PatientsList.propTypes = {
  match: PropTypes.object,
  patients: PropTypes.array,
  className: PropTypes.any,
  onGetPatientsList: PropTypes.func,
  history: PropTypes.any,
};
const mapStateToProps = ({ patients }) => ({
  patients: patients.patientsList,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetPatientsList: (data) => dispatch(getPatientsList(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PatientsList));