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

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getCLabAccountStatements } from "store/b2b-account-statements/actions";

import "assets/scss/table.scss";

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2baccountStatements: [],
      b2baccountStatement: "",
      selectedCorporate: "",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
      account_type: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).account_type
        : "",
    };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    if (this.state.user_id) {
      const { onGetCLabAccountStatements } = this.props;
      console.log(onGetCLabAccountStatements(this.state.user_id));
      this.setState({ b2baccountStatements: this.props.b2baccountStatements });
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
  handleCorporateSelect = (selectedCorporate) => {
    this.setState({ selectedCorporate });
  };

  render() {
    const { SearchBar } = Search;

    const { b2baccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: b2baccountStatements.length, // replace later with size(b2baccountStatements),
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
            <title>Lab Corporate Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
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
                              <th scope="col">Date</th>
                              <th scope="col">ID</th>
                              <th scope="col">Patient Name</th>
                              <th scope="col">Lab Name</th>
                              <th scope="col">Status</th>
                              {/* <th scope="col">Amount</th> */}
                              <th scope="col">Referral Fee of Lab Hazir</th>
                              <th scope="col">Referral Fee of B2B (%)</th>
                              <th scope="col">Credit</th>
                              <th scope="col">Debit</th>
                              <th scope="col">Balance</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                        </Table>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>)}
            {!isEmpty(this.props.b2baccountStatements) && (
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
                              <th scope="col">Corporate Pay to Lab</th>
                              <th scope="col">Labhazir Referral Fee</th>
                              <th scope="col">Is Settled</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {b2baccountStatements.map((b2baccountStatement, i) => (
                              <>
                                <tr key={i}>
                                  <td>
                                    <h5 className="font-size-14 text-truncate">
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
                                    {b2baccountStatement.Receivable == 0 ? (
                                      <p className="d-none">
                                        {b2baccountStatement.Receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>

                                    ) : (
                                      <p className="float-end">
                                        {b2baccountStatement.Receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    )}

                                  </td>
                                  <td>
                                    {b2baccountStatement.payable == 0 ? (
                                      <p className="d-none">
                                        {b2baccountStatement.payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>

                                    ) : (
                                      <p className="float-end">
                                        {b2baccountStatement.payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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
                            )
                            )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="3" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">

                                  {
                                    this.props.b2baccountStatements.slice(-1).pop().total_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>

                              <td className="border-10">
                                <p className="float-end">

                                  {
                                    this.props.b2baccountStatements.slice(-1).pop().total_receivable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">

                                  {
                                    this.props.b2baccountStatements.slice(-1).pop().total_payable.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  }
                                </p>
                              </td>
                              <td className="border-10">

                              </td>

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
  onGetCLabAccountStatements: id => dispatch(getCLabAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));
