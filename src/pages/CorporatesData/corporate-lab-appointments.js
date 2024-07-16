import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import {
  Card, CardBody, Col, Button, Table, Container, Label, Row, Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { isEmpty, map } from "lodash";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getCLabAccountStatements } from "store/b2b-account-statements/actions";
import "assets/scss/table.scss";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Formik, Field, Form, ErrorMessage } from "formik";


class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.state = {
      b2baccountStatements: [],
      b2baccountStatement: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
      selectedCorporate: "", // Added state for selected corporate name
      isSettledFilter: "",
    };
    this.toggle = this.toggle.bind(this);
    this.toggleLabModal = this.toggleLabModal.bind(this);
  }

  handleFilterChange = (isSettledFilter) => {
    this.setState({ isSettledFilter });
  }

  componentDidMount() {
    if (this.state.user_id) {
      const { onGetCLabAccountStatements } = this.props;
      onGetCLabAccountStatements(this.state.user_id);
    }
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  handleCorporateSelect = (selectedCorporate) => {
    this.setState({ selectedCorporate });
  };

  getFilteredTotal = (data) => {
    const totalAmount = data.reduce((acc, statement) => acc + statement.amount, 0);
    const totalReceivable = data.reduce((acc, statement) => acc + statement.receivable, 0);
    const totalPayable = data.reduce((acc, statement) => acc + statement.plateform_fees, 0);

    return {
      totalAmount,
      totalReceivable,
      totalPayable,
    };
  };

  onPaginationPageChange = (page) => {
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
  // exportToExcel = () => {
  //   const { b2baccountStatements } = this.props;
  //   const fileType =
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  //   const fileExtension = ".xlsx";
  //   const ws = XLSX.utils.json_to_sheet(b2baccountStatements);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const data = new Blob([excelBuffer], { type: fileType });
  //   const fileName = "account_statements" + fileExtension;
  //   saveAs(data, fileName);
  // };
  exportToExcel = () => {
    const { b2baccountStatements } = this.props;
    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // Define fields to export
    const fieldsToExport = [
      "lab_name",
      "order_id",
      // "employee_id",
      "employee_name",
      "appointment_status",
      "payment_method",
      "payment_status",
      "amount",
      "receivable",
      "plateform_fees",
      "is_settled",
    ];

    // Map each row to an object with only the desired fields
    const dataToExport = b2baccountStatements.map(statement => {
      const rowData = {};
      fieldsToExport.forEach(field => {
        rowData[field] = statement[field];
      });
      return rowData;
    });

    // Convert data to Excel format and save as file
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    const fileName = "account_statements" + fileExtension;
    saveAs(data, fileName);
  };

  openLabModal = (e, arg) => {
    this.setState({
      LabModal: true,

      lab_phone: arg.lab_phone,
      lab_city: arg.lab_city,
      lab_address: arg.lab_address,
    });
  };
  toggleLabModal = () => {
    this.setState(prevState => ({
      LabModal: !prevState.LabModal,
    }));
    this.state.btnText === "Copy"
      ? this.setState({ btnText: "Copied" })
      : this.setState({ btnText: "Copy" });
  };

  render() {
    const { isSettledFilter } = this.state;
    const { SearchBar } = Search;

    const { b2baccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2baccountStatements.length,
      custom: true,
    };
    const uniqueLabNames = [...new Set(b2baccountStatements.map((statement) => statement.lab_name))];

    const filteredData = b2baccountStatements.filter(
      (statement) =>
        (!this.state.selectedCorporate || statement.lab_name === this.state.selectedCorporate) &&
        (!this.state.isSettledFilter ||
          (this.state.isSettledFilter === "true" ? statement.is_settled === true : statement.is_settled === false))
    );

    const filteredTotal = this.getFilteredTotal(filteredData);

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Appointment Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Corporate" breadcrumbItem="Appointment Statements" />
            <div> <span className="text-danger font-size-12">
                                    <strong> 
                                    Note: Settled Appointments indicate that payment has been made to both the respective lab where the corporate employee tests were performed and to Lab Hazir.                                    
                                    </strong>
                                  </span>
                                  </div>
            <Row>
              <Col lg="12" style={{ marginLeft: "87%" }}>
                <Button onClick={this.exportToExcel} className="mb-3">Export to Excel</Button>
              </Col>
            </Row>
            {isEmpty(this.props.b2baccountStatements) && (
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead className="table-light">
                            <tr>
                            <th scope="col">Employee ID</th>
                              <th scope="col">Employee Name</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Lab Name</th>
                              <th scope="col">Lab Type</th>
                              <th scope="col">Appointment Status</th>
                              <th scope="col">Payment Method/ Status</th>
                              <th scope="col">Invoice Value</th>
                              <th scope="col">Lab Payable</th>
                              <th scope="col">Labhazir Payable</th>
                              <th scope="col">Is Settled</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
            {!isEmpty(this.props.b2baccountStatements) && (
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        {/* Add filter field */}
                        <Row>
                          <Col md="3" className="mb-3">
                            <strong htmlFor="corporateFilter" className="form-label">
                              Filter by Lab Name:
                            </strong>
                            <select
                              id="corporateFilter"
                              className="form-select"
                              onChange={(e) => this.handleCorporateSelect(e.target.value)}
                              value={this.state.selectedCorporate}
                            >
                              <option value="">All</option>
                              {uniqueLabNames.map((labName, i) => (
                                <option key={i} value={labName}>
                                  {labName}
                                </option>
                              ))}
                            </select>
                          </Col>

                          <Col md="3" className="mb-3">
                            <strong htmlFor="corporateFilter" className="form-label">
                              Filter by Is Settled:
                            </strong>
                            <select
                              id="corporateFilter"
                              className="form-select"
                              onChange={(e) => this.handleFilterChange(e.target.value)}
                              value={this.state.isSettledFilter}
                            >
                              <option value="">All</option>
                              <option value="true">Sattled</option>
                              <option value="false">Not Sattled</option>
                            </select>
                          </Col>
                        </Row>
                        <Table>
                          <thead className="table-light">
                            <tr>
                            <th scope="col">Employee ID</th>
                              <th scope="col">Employee Name</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Lab Name</th>
                              <th scope="col">Lab Type</th>
                              <th scope="col">Appointment Status</th>
                              <th scope="col">Payment Method/ Status</th>
                              <th scope="col">Invoice Value</th>
                              <th scope="col">Lab Payable</th>
                              <th scope="col">Labhazir Payable</th>
                              <th scope="col">Is Settled</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {b2baccountStatements
                              .filter(
                                (statement) =>
                                  (!this.state.selectedCorporate || statement.lab_name === this.state.selectedCorporate) &&
                                  (!this.state.isSettledFilter ||
                                    (this.state.isSettledFilter === "true" ? statement.is_settled === true : statement.is_settled === false))
                              )

                              .map((b2baccountStatement, i) => (
                                <>
                                  <tr key={i}>
                                  <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <span>{b2baccountStatement.employee_id}</span>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate float-start">
                                        <span>{b2baccountStatement.employee_name}</span>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>
                                          {b2baccountStatement.order_id && (
                                            <Link
                                              to={`/cor-invoice-detail/${b2baccountStatement.test_appointment_id}`}
                                            >
                                              {b2baccountStatement.order_id}
                                            </Link>
                                          )}
                                        </strong>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate float-start">
                                        {/* <span>{b2baccountStatement.lab_name}</span> */}
                                        <Link to="#"
                                          //  onClick={e => this.openLabModal(e, b2baccountStatement)}
                                          onMouseEnter={e => this.openLabModal(e, b2baccountStatement)}
                                        >
                                          {b2baccountStatement.lab_name}
                                        </Link>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <span>{b2baccountStatement.lab_type}</span>
                                      </h5>
                                    </td>
                                   
                                    
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <span>{b2baccountStatement.appointment_status}</span>
                                      </h5>
                                    </td>
                                    <td>
                                      {/* <p className="float-end"> */}
                                      {b2baccountStatement.payment_status == "Not Paid" ? (
                                        <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                          {b2baccountStatement.payment_method == "Cash" ? (
                                            "Patient to Lab"
                                          ) :
                                            <span>{b2baccountStatement.payment_method}</span>},{" "}
                                          {b2baccountStatement.payment_status}
                                        </span>
                                      ) : (
                                        <span className="w-100 pr-4 pl-4 badge badge-dark rounded-pill badge badge-dark font-size-12 badge-soft-success" >
                                          {b2baccountStatement.payment_method == "Cash" ? (
                                            "Patient to Lab"
                                          ) :
                                            <span>{b2baccountStatement.payment_method}</span>},{" "}
                                          {b2baccountStatement.payment_status}
                                        </span>
                                      )}
                                      {/* </p> */}
                                    </td>
                                    <td>
                                      {b2baccountStatement.amount == 0 ? (
                                        <p className="d-none">
                                          {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>

                                    <td>
                                      {b2baccountStatement.receivable == 0 ? (
                                        <p className="float-end">
                                          ---
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {b2baccountStatement.receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}

                                    </td>
                                    <td>
                                      {b2baccountStatement.plateform_fees == 0 ? (
                                        <p className="d-none">
                                          {b2baccountStatement.plateform_fees.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ) : (
                                        <p className="float-end">
                                          {parseInt(b2baccountStatement.plateform_fees).toString()}
                                        </p>
                                      )}

                                    </td>

                                    <td>

                                      {/* <p>
                                         {b2baccountStatement.is_settled}
                                        </p> */}
                                      {b2baccountStatement.is_settled == true ? (
                                        <div className="text-success">
                                          <i className="mdi mdi-check-circle font-size-18"></i>
                                        </div>
                                      ) : (
                                        <div className="text-danger">
                                          <i className="mdi mdi-close-circle font-size-18"></i>
                                        </div>
                                      )}

                                    </td>

                                    {/* <td>
                                      {b2baccountStatement.map((statement, index) => (
                                        (isSettledFilter === '' || String(statement.is_settled) === isSettledFilter) && (
                                          <div key={index}>
                                            {statement.is_settled ? (
                                              <div className="text-success">
                                                <i className="mdi mdi-check-circle font-size-18"></i>
                                              </div>
                                            ) : (
                                              <div className="text-danger">
                                                <i className="mdi mdi-close-circle font-size-18"></i>
                                              </div>
                                            )}
                                            
                                          </div>
                                        )
                                      ))}
                                    </td> */}

                                  </tr>
                                </>
                              ))}
                            {/* <tr className="bg-success bg-soft">
                              <td colSpan="3" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {this.props.b2baccountStatements
                                    .slice(-1)
                                    .pop()
                                    .total_amount.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {this.props.b2baccountStatements
                                    .slice(-1)
                                    .pop()
                                    .total_receivable.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {this.props.b2baccountStatements
                                    .slice(-1)
                                    .pop()
                                    .total_payable.toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                              </td>
                              <td className="border-10"></td>
                            </tr> */}
                            <tr className="bg-success bg-soft">
                              <td colSpan="7" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {filteredTotal.totalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {filteredTotal.totalReceivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                  {parseInt(filteredTotal.totalPayable).toString()}
                                </p>
                              </td>
                              <td className="border-10"></td>
                            </tr>
                          </tbody>
                        </Table>
                        <Modal
                          isOpen={this.state.LabModal}
                          className={this.props.className}
                        >
                          <ModalHeader
                            toggle={this.toggleLabModal}
                            tag="h4"
                          >
                            <span>Lab Details: </span>
                          </ModalHeader>
                          <ModalBody>
                            <Formik>
                              <Form>
                                <Row>
                                  <Col className="col-12">
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
                                          Address
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
                                          Mobile No.
                                        </Label>
                                      </div>
                                      <div className="col-md-9">
                                        <input
                                          type="text"
                                          value={
                                            this.state.lab_phone
                                          }
                                          className="form-control"
                                          readOnly={true}
                                        />
                                      </div>

                                      {/* <div className="col-md-3">
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
                                                  </div> */}
                                    </div>
                                  </Col>
                                </Row>
                              </Form>
                            </Formik>
                          </ModalBody>
                        </Modal>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            )}
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

AccountStatements.propTypes = {
  match: PropTypes.object,
  b2baccountStatements: PropTypes.array,
  className: PropTypes.any,
  onGetCLabAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ b2baccountStatements }) => ({
  b2baccountStatements: b2baccountStatements.b2baccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetCLabAccountStatements: (id) => dispatch(getCLabAccountStatements(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountStatements));
