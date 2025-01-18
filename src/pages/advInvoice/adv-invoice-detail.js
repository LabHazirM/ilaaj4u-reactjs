import React, { Component, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import { any } from "prop-types";
import { withRouter, Link } from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import moment from 'moment';

import {
  Alert,
  Card,
  CardBody,
  Col,
  Table,
  Container,
  Input,
  Label,
  Modal,
  Row,
  Button,
  ModalBody,
} from "reactstrap";

import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import QRCode from "qrcode.react";

import { isEmpty, map } from "lodash";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
//Import Breadcrumb
import "assets/scss/table.scss";
import Breadcrumbs from "components/Common/Breadcrumb";
import { getAdvInvoice } from "store/adv-invoice/actions";

class LabAudits extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      advinvoice: [],
    //   id: "",
    //   assignedTo: "",
    //   LabAudits: "",
    //   auditModal: false,
    //   reason_of_reaudit:"",
      advinvoice: "",
    //   audit_status:"",
      user_id: localStorage.getItem("authUser")
        ? JSON.parse(localStorage.getItem("authUser")).user_id
        : "",
    //   AdvInvoiceListColumns: [
    //     {
    //       text: "id",
    //       dataField: "id",
    //       sort: true,
    //       hidden: true,
    //       formatter: (cellContent, advinvoice) => <>{advinvoice.id}</>,
    //     },
    //     {
    //       dataField: "actions",
    //       text: "Action Performed",
    //       sort: true,
    //     },
    //     {
    //       dataField: "lab_name",
    //       text: "Done by",
    //       sort: true,
    //     },
       
    //     {
    //       dataField: "created_at",
    //       text: "Done at at",
    //       sort: true,
    //       formatter: (cellContent, advinvoice) => (
    //         <>
    //           <span>{new Date(advinvoice.created_at).toLocaleString("en-US")}</span>
    //         </>
    //       ),
    //     },
    //     {
    //       dataField: "test_name",
    //       text: "Test Name",
    //       sort: true,
    //     },
    //     {
    //       dataField: "field_name",
    //       text: "Field",
    //       sort: true,
    //     },
    //     {
    //       dataField: "old_value",
    //       text: "Previous Value",
    //       sort: true,
    //     },
    //     {
    //     dataField: "new_value",
    //     text: "New Value",
    //     sort: true,
    //   },
    //   ],
    };
    // this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { advinvoice, onGetAdvInvoice } = this.props;
    console.log(onGetAdvInvoice(this.props.match.params.id));
    this.setState({ advinvoice });
    console.log(advinvoice)
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

    const { advinvoice, } = this.props;
    const {  onGetAdvInvoice } = this.props;

    const pageOptions = {
      sizePerPage: 10,
      totalSize: advinvoice.length, // replace later with size(advinvoice),
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
            <title>Invoice | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Advertsement" breadcrumbItem="Invoice" />
            
                {!isEmpty(this.props.advinvoice) &&
                  this.props.advinvoice.map((advinvoice, key) => (
                     <Col  key={"_col_" + key}>
                       <Card>
            <CardBody>
            <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          Order ID: {this.props.advinvoice[0].id}
                        </h4>
                        <div className="mb-4">
                          <img src={logo} alt="logo" height="20" />
                        </div>
                      </div>
                      <hr />
                      <Row>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Lab Detail:</strong>
                            <br />
                            NTN # {this.props.advinvoice[0].lab_ntn}
                            <br />
                            {this.props.advinvoice[0].lab_name}
                            <br />
                            {this.props.advinvoice[0].lab_email}
                            <br />
                            {this.props.advinvoice[0].lab_address}
                          </address>
                        </Col>
                         <Col sm="4" className="mt-3">
                          <address>
                            <strong>Advertisement Detail:</strong>
                            <br />
                            Advertisement id: {this.props.advinvoice[0].advertisement_id}
                            <br />
                            Title: {this.props.advinvoice[0].title}
                            <br />
                            Posted for: {this.props.advinvoice[0].number_of_days} days
                            <br />
                            Kilometers: {this.props.advinvoice[0].km} km&lsquo;s
                            <br />
                            <br />
                            Total: {this.props.advinvoice[0].price} price&lsquo;s
                            <br />
                          </address>
                        </Col>
                        <Col sm="4" className="mt-3 text-sm-end">
                        <div className="mt-3">
                        <QRCode value="LabHazir Tax No: 9157548-3" size={100} fgColor="#000000" bgColor="#FFFFFF" />
                      </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Payment Detail:</strong>
                            <br />
                            {this.props.advinvoice[0].payment_method ==
                            "Card" ? (
                              <>
                                {new Date(
                                  this.props.advinvoice[0].paid_at
                                ).toLocaleString("en-US")}
                              </>
                            ) : 
                            <span>Not Paid</span>}
                            <br />
                            {this.props.advinvoice[0].payment_method}
                            <br />
                            {this.props.advinvoice[0].payment_status}
                            <br />
                          
                          </address>
                        </Col>

                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Order Detail:</strong>
                            <br />
                            {moment(this.props.advinvoice[0].invoice_generated_at).format("DD MMM YYYY, h:mm A")}
                            <br />
                            <br />
                          </address>
                        </Col>
                        <Col sm="4" className="mt-3 text-sm-end">
                        </Col>
                      </Row>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">
                          Order summary
                        </h3>
                      </div>
                      <div className="table-responsive">
                        <Table className="table-nowrap">
                          <thead>
                            <tr>
                              <th style={{ width: "70px" }}>No.</th>
                              <th className="text-start">Advertisement ID</th>
                              <th className="text-start">Advertisement name</th>
                              <th className="text-end">Days</th>
                              <th className="text-end">Kilometers</th>
                              <th className="text-end">Total</th>

                              {/* <th className="text-end">Price</th> */}
                              {/* <th className="text-end">Discount</th> */}
                            

                            </tr>
                          </thead>
                          <tbody>
                            {map(
                              this.props.advinvoice,
                              (item, key) => (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td className="text-start">{item.advertisement_id}</td>
                                  <td className="text-start">{item.title}</td>
                                  <td className="text-end">{item.number_of_days}</td>
                                  <td className="text-end">{item.km}</td>
                                  <td className="text-end">{item.price}</td>

                                  {/* <td className="text-end">{(item.discount_by_labhazir+item.discount_by_labhazird_by_test).toFixed(0)}{"%"}</td> */}
                                   {/* <td className="text-end">{item.discount_by_labhazird_by_test}</td> */}
                                   {/* <td className="text-end">
                                  {item.total_test_cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  //  -
                                  //   this.props.advinvoice[0]
                                  //     .home_sampling_charges
                                      }
                              </td> */}
                                </tr>
                              )
                            )}
                           
                            {/* <tr>
                              <td colSpan="6" className="border-10 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10 text-end">
                                <h4 className="m-0">
                                  {(this.props.advinvoice[0].price).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </h4>
                              </td>
                            </tr> */}
                          </tbody>
                        </Table>
                      </div>
                         </CardBody>
                      </Card>
                     </Col>
                  ))}            
                
             
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

LabAudits.propTypes = {
  match: PropTypes.object,
  advinvoice: PropTypes.array,
  className: PropTypes.any,
  onGetAdvInvoice: PropTypes.func,
  history: any,
  success: PropTypes.any,
  error: PropTypes.any,
};
const mapStateToProps = ({ advinvoice }) => ({
  advinvoice: advinvoice.advinvoice,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onGetAdvInvoice: id => dispatch(getAdvInvoice(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(LabAudits));
