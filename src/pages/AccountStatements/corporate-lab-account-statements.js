import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row } from "reactstrap";
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
    };
    this.toggle = this.toggle.bind(this);
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
    const totalPayable = data.reduce((acc, statement) => acc + statement.payable, 0);
  
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

  render() {
    const { SearchBar } = Search;

    const { b2baccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2baccountStatements.length,
      custom: true,
    };
    const uniqueLabNames = [...new Set(b2baccountStatements.map((statement) => statement.corporate_name))];

    const filteredData = b2baccountStatements.filter(
      (statement) =>
        !this.state.selectedCorporate || statement.corporate_name === this.state.selectedCorporate
    );
  
    const filteredTotal = this.getFilteredTotal(filteredData);

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Lab Corporate Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            <Breadcrumbs title="Statements" breadcrumbItem="Lab Corporate Statements" />
            {isEmpty(this.props.b2baccountStatements) && (
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Corporate Name</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Payment Status/ Method</th>
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
                        {/* <Col md="3" className="mb-3">
                          <strong htmlFor="corporateFilter" className="form-label">
                            Filter by Corporate Name:
                          </strong>
                          <select
                            id="corporateFilter"
                            className="form-select"
                            onChange={(e) => this.handleCorporateSelect(e.target.value)}
                            value={this.state.selectedCorporate}
                          >
                            <option value="">All</option>
                            {this.props.b2baccountStatements.map((statement, i) => (
                              <option key={i} value={statement.corporate_name}>
                                {statement.corporate_name}
                              </option>
                            ))}
                          </select>
                        </Col> */}
                        <Col md="3" className="mb-3">
                          <strong htmlFor="corporateFilter" className="form-label">
                            Filter by Corporate Name:
                          </strong>
                          <select
                            id="corporateFilter"
                            className="form-select"
                            onChange={(e) => this.handleCorporateSelect(e.target.value)}
                            value={this.state.selectedCorporate}
                          >
                            <option value="">All</option>
                            {uniqueLabNames.map((CorporateName, i) => (
                              <option key={i} value={CorporateName}>
                                {CorporateName}
                              </option>
                            ))}
                          </select>
                        </Col>
                        <Table>
                          <thead className="table-light">
                            <tr>
                              <th scope="col">Corporate Name</th>
                              <th scope="col">Order ID</th>
                              <th scope="col">Payment Status/ Method</th>
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
                                  !this.state.selectedCorporate ||
                                  statement.corporate_name === this.state.selectedCorporate
                              )
                              .map((b2baccountStatement, i) => (
                                <>
                                 <tr key={i}>
                                  <td>
                                    <h5 className="font-size-14 text-truncate float-start">
                                      <span>{b2baccountStatement.corporate_name}</span>
                                    </h5>
                                  </td>
                                  <td>
                                    <h5 className="font-size-14 text-truncate">
                                      <strong>{b2baccountStatement.order_id}</strong>
                                    </h5>
                                  </td>
                                  <td>
                                    {/* <p className="float-end"> */}
                                    {b2baccountStatement.payment_status == "Not Paid" ? (
                                      <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                        {b2baccountStatement.payment_method},{" "}
                                        {b2baccountStatement.payment_status}
                                      </span>
                                    ) : (
                                      <span className="w-100 pr-4 pl-4 badge badge-dark rounded-pill badge badge-dark font-size-12 badge-soft-success" >
                                        {b2baccountStatement.payment_method},{" "}
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
                                  {b2baccountStatement.payable === 0 ? (
                                    <p className="float-end">---</p>
                                  ) : (
                                    <p className="float-end">
                                      {Number(b2baccountStatement.payable.toFixed(0))
                                        .toString()
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
        <td colSpan="3" className="border-0 text-end">
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
            {(filteredTotal.totalPayable.toFixed(0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </td>
        <td className="border-10"></td>
      </tr>
                          </tbody>
                        </Table>
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
