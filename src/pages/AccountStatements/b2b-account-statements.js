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

import { getB2bAccountStatements } from "store/b2b-account-statements/actions";

import "assets/scss/table.scss";

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      b2baccountStatements: [],
      b2baccountStatement: "",
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
    if (this.state.user_id && this.state.account_type === "b2bclient") {
      const {onGetB2bAccountStatements } = this.props;
    console.log(onGetB2bAccountStatements(this.state.user_id));
    this.setState({ b2baccountStatements: this.props.b2baccountStatements });
    } else if (this.state.user_id && this.state.account_type !== "b2bclient"){
      const { onGetB2bAccountStatements } = this.props;
    onGetB2bAccountStatements(this.props.match.params.id);
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
            <title>Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="B2B" breadcrumbItem="Account Statements" />
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
                          </Row> )}
            {!isEmpty(this.props.b2baccountStatements) && (
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
                          <tbody>
                            {b2baccountStatements.map((b2baccountStatement, i) => (
                              <>
                                {b2baccountStatement.transaction_type == "Out" ? (
                                  // <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                  <tr key={i} className="badge-soft-primary">
                                    <td>
                                      <p className="text-muted mb-0">
                                        {/* {b2baccountStatement.ordered_at} */}
                                        {new Date(b2baccountStatement.ordered_at).toLocaleString("en-US")}

                                      </p>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.order_id}</strong>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.patient_name}</strong>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.lab_name}</strong>
                                      </h5>
                                    </td>
                                    {/* <td>
                                                    <p className="text-muted mb-0">
                                                      {b2baccountStatement.test_appointment_id}
                                                    </p>
                                                  </td> */}
                                    <td>
                                      {/* <p className="float-end"> */}
                                      {b2baccountStatement.payment_status == "Not Paid" ? (
                                        <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                          {b2baccountStatement.payment_method},{" "}
                                          {b2baccountStatement.payment_status}
                                        </span>
                                      ) : (
                                        <span className="w-100 pr-4 pl-4 badge badge-dark rounded-pill badge badge-dark font-size-12 badge-soft-primary" >
                                          {b2baccountStatement.payment_method},{" "}
                                          {b2baccountStatement.payment_status}
                                        </span>
                                      )}
                                      {/* </p> */}
                                    </td>
                                    {/* <td>
                                      {b2baccountStatement.amount == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td> */}
                                    {/* <td>
                                      <p>
                                        {b2baccountStatement.labhazir_share.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                    <td>
                                      {b2baccountStatement.labhazir_share == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.labhazir_share.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.labhazir_share.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.b2b_share * 100).toFixed()}%
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.b2b_share == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.b2b_share.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.b2b_share.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.Credit).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.Debit).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.balance).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.balance == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                                    {b2baccountStatement.is_settled == true ? (
                                                      <div className="text-success">
                                                        <i className="mdi mdi-check-circle font-size-18"></i>
                                                      </div>
                                                    ) : (
                                                      <div className="text-danger">
                                                        <i className="mdi mdi-close-circle font-size-18"></i>
                                                      </div>
                                                    )}
                                                  </td> */}
                                  </tr>
                                  // </span>
                                ) : (
                                  <tr key={i}>
                                    <td>
                                      <p className="text-muted mb-0">
                                        {/* {b2baccountStatement.ordered_at} */}
                                        {new Date(b2baccountStatement.ordered_at).toLocaleString("en-US")}

                                      </p>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.order_id}</strong>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.patient_name}</strong>
                                      </h5>
                                    </td>
                                    <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{b2baccountStatement.lab_name}</strong>
                                      </h5>
                                    </td>
                                    {/* <td>
                                                    <p className="text-muted mb-0">
                                                      {b2baccountStatement.test_appointment_id}
                                                    </p>
                                                  </td> */}
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
                                    {/* <td>
                                      {b2baccountStatement.amount == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td> */}
                                    {/* <td>
                                      <p>
                                        {b2baccountStatement.labhazir_share.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                      </p>
                                    </td> */}
                                    <td>
                                      {b2baccountStatement.labhazir_share == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.labhazir_share.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.labhazir_share.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.b2b_share * 100).toFixed()}%
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.b2b_share == 0 ? (
                                        <p className="d-none">
                                         {(b2baccountStatement.b2b_share * 100).toFixed()}%
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {(b2baccountStatement.b2b_share * 100).toFixed()}%
                                        </p>
                                      )}
                                     
                                    </td>
                                    
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.Credit).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.Debit).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {b2baccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                      <p>
                                        {(b2baccountStatement.balance).toFixed(0)}
                                      </p>
                                    </td> */}
                                     <td>
                                      {b2baccountStatement.balance == 0 ? (
                                        
                                        <p className="d-none">
                                         {b2baccountStatement.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      ):(
                                        <p className="float-end">
                                         {b2baccountStatement.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                    {/* <td>
                                                    {b2baccountStatement.is_settled == true ? (
                                                      <div className="text-success">
                                                        <i className="mdi mdi-check-circle font-size-18"></i>
                                                      </div>
                                                    ) : (
                                                      <div className="text-danger">
                                                        <i className="mdi mdi-close-circle font-size-18"></i>
                                                      </div>
                                                    )}
                                                  </td> */}
                                  </tr>
                                )}



                              </>
                            )
                            )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="4" className="border-0 text-end">
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
                                  this.props.b2baccountStatements.slice(-1).pop().total_labhazir_share.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                              <td className="border-10">

                              </td>
                              <td className="border-10">
                              <p className="float-end">

                                {
                                  this.props.b2baccountStatements.slice(-1).pop().total_Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                              <td className="border-10">
                              <p className="float-end">

                                {
                                  this.props.b2baccountStatements.slice(-1).pop().total_Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td> <td className="border-10">
                              <p className="float-end">

                                {
                                  this.props.b2baccountStatements.slice(-1).pop().balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                            </tr>
                          </tbody>
                          {/* <tfoot>
                                  {b2baccountStatements.map(
                                      (b2baccountStatement, key) => (
                                        <>
                                              <tr className="table-light p-3 rounded">
                                                <td>
                                                  <h5 className="font-size-14 text-truncate float-center">
                                                    Total
                                                  </h5>
                                                </td>
                                                <td><p className="float-end"> 
                                                {b2baccountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {b2baccountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {b2baccountStatement.total_dues_before_discount}</p>
                                                 </td>
                                                 <td><p className="float-end"> 
                                                {b2baccountStatement.total_dues_before_discount}</p>
                                                 </td>
                                              </tr>
                                            

                                          {/* {/* {checkoutItem.lab_home_sampling_charges !=
                                            0 && (
                                            <tr key={"_checkoutItem_" + key}>
                                              <td colSpan="5">
                                                <div className="bg-primary bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-primary mb-0">
                                                    <i className="fas fa-shipping-fast me-2" />{" "}
                                                    Home Sampling Charges{" "}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.lab_home_sampling_charges.toString()
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr> 
                                          )}

                                          {checkoutItem.total_test_cost && (
                                            <tr>
                                              <td colSpan="5">
                                                <div className="bg-success bg-soft p-3 rounded">
                                                  <h5 className="font-size-14 text-success mb-0">
                                                    <i className="mdi mdi-cash-multiple me-2 font-size-22" />{" "}
                                                    Sub Total{" "}
                                                    <span className="float-end">
                                                      Rs.{" "}
                                                      {
                                                        checkoutItem.total_test_cost.toString()
                                                      }
                                                    </span>
                                                  </h5>
                                                </div>
                                              </td>
                                            </tr>
                                          )}  
                                        </>
                                      )
                                    )}
                                  </tfoot> */}
                        </Table>
                      </div>
                      {/* <PaginationProvider
                      pagination={paginationFactory(pageOptions)}
                      keyField="id"
                      columns={this.state.accountStatementColumn}
                      data={b2baccountStatements}
                    >
                      {({ paginationProps, paginationTableProps }) => (
                        <ToolkitProvider
                          keyField="id"
                          columns={this.state.accountStatementColumn}
                          data={b2baccountStatements}
                          search
                        >
                          {toolkitprops => (
                            <React.Fragment>
                              <Row className="mb-2">
                                <Col sm="4">
                                  <div className="search-box ms-2 mb-2 d-inline-block">
                                    <div className="position-relative">
                                      <SearchBar
                                        {...toolkitprops.searchProps}
                                      />
                                      <i className="bx bx-search-alt search-icon" />
                                    </div>
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
                                    />
                                  </div>
                                </Col>
                              </Row>
                              {/* <Row className="align-items-md-center mt-30">
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
                    </PaginationProvider> */}
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
  onGetB2bAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ b2baccountStatements }) => ({
  b2baccountStatements: b2baccountStatements.b2baccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetB2bAccountStatements: id => dispatch(getB2bAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));
