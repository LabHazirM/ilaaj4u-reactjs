import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { withRouter, Link } from "react-router-dom";
import { Card, CardBody, Col, Table, Container, Row } from "reactstrap";
import { isEmpty, map } from "lodash";
import moment from 'moment';



import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";

//Import Breadcrumb
import Breadcrumbs from "components/Common/Breadcrumb";

import { getDonorsAccountStatements } from "store/donors-account-statements/actions";

import "assets/scss/table.scss";

class AccountStatements extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      donorsaccountStatements: [],
      donoraccountStatement: "",
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
    if (this.state.user_id && this.state.account_type === "donor") {
      const { onGetDonorAccountStatements } = this.props;
      onGetDonorAccountStatements(this.state.user_id);
      this.setState({ donorsaccountStatements: this.props.donorsaccountStatements });
    } else if (this.state.user_id && this.state.account_type !== "donor"){
      const { onGetDonorAccountStatements } = this.props;
    onGetDonorAccountStatements(this.props.match.params.id);
    this.setState({ donorsaccountStatements: this.props.donorsaccountStatements });;
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

    const { donorsaccountStatements } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: donorsaccountStatements.length, // replace later with size(donorsaccountStatements),
      custom: true,
    };

    const thStyle = {
      border: '1px solid white',
      textAlign: 'center',
      verticalAlign: 'middle',
    }; 

    const defaultSorted = [
      {
        dataField: "id", // if dataField is not match to any column you defined, it will be ignored.
        order: "desc", // desc or asc
      },
    ];

    // var total_testby_labhazir = this.props.donorsaccountStatements.total_testby_labhazir
    // // var authenticated = "{{total_testby_labhazir}}"
    // console.log(total_testby_labhazir)

    return (
      <React.Fragment>
        <div className="page-content">
          <MetaTags>
            <title>Account Statements | Lab Hazir</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Donor" breadcrumbItem="Account Statements" />
            {isEmpty(this.props.donorsaccountStatements) && (
              <Row>
                <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Only payments with the Cleared and Approved status will show here.

                  </strong>
                  <br></br>
                  <strong>
                    Note: If patient appointment is canceled the money will be refunded back. All such cancel Appointments can be tracked in the Appointment Tracibility page.

                  </strong>
                  </span>
                </div>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead className="table-light">
                            <tr>
                              <th style={thStyle} scope="col">Date Time</th>
                              {/* <th scope="col">Payment Date</th> */}
                              {/* <th scope="col">ID</th> */}
                              <th style={thStyle} scope="col">Description</th>
                              <th style={thStyle} scope="col">Credit</th>
                              <th style={thStyle} scope="col">Debit</th>
                              <th style={thStyle} scope="col">Balance</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          </Table>
                          </div>
                          </CardBody>
                          </Card>
                          </Col>
                          </Row>)}
            {!isEmpty(this.props.donorsaccountStatements) && (
              <Row>
                 <div> <span className="text-danger font-size-12">
                  <strong>
                    Note: Only MIFfeeeeeeeee with the Cleared and Approved status will show here.

                  </strong>
                  <br></br>
                  <strong>
                    Note: If patient appointment is canceled the money will be refunded back. All such cancel Appointments can be tracked in the Appointment Tracibility page.

                  </strong>
                  </span>
                </div>
                {/* <div>
                    <span className="font-size-12">
                      <strong><span className="text-danger">Note:</span></strong> <strong>MIF Payments Means: (Payment Credited in Account) </strong>
                    </span>
                  </div>
                <div>
                    <span className="font-size-12">
                      <strong><span className="text-danger">Note:</span></strong> <strong>INVOICE Payments Means: (Payment Debited in Account) </strong>
                    </span>
                  </div> */}
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="table-responsive">
                        <Table>
                          <thead style={{ position: 'flex'}} className="table-dark">
                            <tr>
                              <th style={thStyle} scope="col">Date</th>
                              {/* <th scope="col">Payment Date</th> */}
                              {/* <th scope="col">ID</th> */}
                              <th style={thStyle} scope="col">Description</th>
                              <th style={thStyle} scope="col">Credit</th>
                              <th style={thStyle} scope="col">Debit</th>
                              <th style={thStyle} scope="col">Balance</th>

                              {/* <th scope="col">Is Settled</th> */}
                            </tr>
                          </thead>
                          <tbody style={{ textAlign: "center", verticalAlign: "middle"}}>
                            {donorsaccountStatements.map((donoraccountStatement, i) => (
                              <>
                                {donoraccountStatement.transaction_type == "In" ? (
                                  // <span className="w-100 pr-4 pl-4 badge rounded-pill badge-soft-primary font-size-12 badge-soft-danger">
                                  <tr key={i} className="badge-soft-primary">
                                    <td>
                                      {donoraccountStatement.clearedat ? ( 
                                      <p className="text-muted mb-0">
                                        {/* {donoraccountStatement.PaidAt} */}
                                        {/* {new Date(donoraccountStatement.PaidAt).toLocaleString("en-US")} */}
                                        {moment(donoraccountStatement.clearedat).format("DD MMM YYYY")}


                                      </p>
                                      ) : <p className="text-muted mb-0">
                                      {/* {donoraccountStatement.PaidAt} */}
                                      {/* {new Date(donoraccountStatement.PaidAt).toLocaleString("en-US")} */}
                                      {moment(donoraccountStatement.generated_at).format("DD MMM YYYY")}


                                    </p>}
                                    </td>
                                    
                                    <td>
  {donoraccountStatement.cancel_appintment_status === "Cancel" ? (
    <span className="float-start">
      <span>
        INVOICE ID: <span style={{ color: 'blue' }}>{donoraccountStatement.paymentin}</span>,
        Payment Method: <span style={{ color: 'blue' }}>{donoraccountStatement.PaidMethod}</span>,
        <span style={{ color: 'green' }}>{donoraccountStatement.Status}</span>,
        <span className="text-danger">
          {donoraccountStatement.cancel_appintment_status} , Auto MIF
        </span>
      </span>
    </span>
  ) : (
    <span className="float-start">
      <span>
        MIF ID: <span style={{ color: 'blue' }}>{donoraccountStatement.paymentin}</span>,
        Payment Method: <span style={{ color: 'blue' }}>{donoraccountStatement.PaidMethod}
          {donoraccountStatement.PaidMethod === "Donation" ? (
            <span style={{ color: 'green' }}>{donoraccountStatement.Status}</span>
          ) : <span></span>}
        </span>
        {donoraccountStatement.PaidMethod === "Cheque" || donoraccountStatement.PaidMethod === "Card" || donoraccountStatement.PaidMethod === "Cash" ? (
          <span>
            Payment Date: <span style={{ color: 'blue' }}>{moment(donoraccountStatement.PaidAt).format("DD MMM YYYY")}</span>
          </span>
        ) : (
          <span className="text-danger">
            {donoraccountStatement.cancel_appintment_status}
          </span>
        )}
      </span>
    </span>
  )}
</td>

                                     <td style={{ backgroundColor: '#ffc09f' }}>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    
                                      {donoraccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td style={{ backgroundColor: '#ffee93' }}>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td style={{ backgroundColor: '#adf7b6' }}>
                                      {donoraccountStatement.Balance == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                  </tr>
                                ) : (
                                  <tr key={i}>
                                    <td>
                                      <p className="text-muted mb-0">
                                        {/* {donoraccountStatement.PaidAt} */}
                                        {/* {new Date(donoraccountStatement.PaidAt).toLocaleString("en-US")} */}
                                        {moment(donoraccountStatement.PaidAt).format("DD MMM YYYY")}


                                      </p>
                                    </td>
                                    
                                    {/* <td>
                                      <h5 className="font-size-14 text-truncate">
                                        <strong>{donoraccountStatement.paymentin}</strong>
                                      </h5>
                                    </td> */}
                                    <td>
                                        <span className="float-start">
                                          {<span>Lab Name: <span style={{ color: 'blue' }}>{donoraccountStatement.lab_name}</span> , {" "} Lab City: <span style={{ color: 'blue' }}>{donoraccountStatement.lab_city}</span> , {" "} Patient Name: <span style={{ color: 'blue' }}> {donoraccountStatement.patient_name}</span> , {" "} INVOICE ID: <span style={{ color: 'blue' }}>{donoraccountStatement.paymentin}</span></span>}{" "}
                                          {/* {donoraccountStatement.Status} */}
                                        </span>
                                      {/* </p> */}
                                    </td>
                                     <td style={{ backgroundColor: '#ffc09f' }}>
                                      {donoraccountStatement.Credit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Credit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td style={{ backgroundColor: '#ffee93' }}>
                                      {donoraccountStatement.Debit == 0 ? (
                                        <p className="d-none">
                                         {donoraccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>

                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Debit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                     <td style={{ backgroundColor: '#adf7b6' }}>
                                      {donoraccountStatement.Balance == 0 ? (
                                        
                                        <p className="d-none">
                                         {donoraccountStatement.Balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      ):(
                                        <p className="float-end">
                                         {donoraccountStatement.Balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </p>
                                      )}
                                     
                                    </td>
                                  </tr>
                                )}
                              </>
                            )
                            )}
                            <tr className="bg-success bg-soft">
                              <td colSpan="2" className="border-0 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                {
                                  this.props.donorsaccountStatements.slice(-1).pop().total_Credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td>
                              <td className="border-10">
                                <p className="float-end">
                                {
                                  this.props.donorsaccountStatements.slice(-1).pop().total_Debit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
                              </td> <td className="border-10">
                                <p className="float-end">
                                {
                                  this.props.donorsaccountStatements.slice(-1).pop().Balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                                </p>
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
  donorsaccountStatements: PropTypes.array,
  className: PropTypes.any,
  onGetDonorAccountStatements: PropTypes.func,
};

const mapStateToProps = ({ donorsaccountStatements }) => ({
  donorsaccountStatements: donorsaccountStatements.donorsaccountStatements,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetDonorAccountStatements: id => dispatch(getDonorsAccountStatements(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountStatements));
