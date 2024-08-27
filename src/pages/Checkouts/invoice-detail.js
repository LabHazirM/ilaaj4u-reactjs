import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Link, withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap";
import { isEmpty, map } from "lodash";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logo from "../../assets/images/logo-dark.png";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import moment from 'moment';


import PropTypes from "prop-types";
import { getInvoiceDetail } from "store/invoices/actions";
import { connect } from "react-redux";
import QRCode from "qrcode.react";

class InvoiceDetail extends Component {
  constructor(props) {
    super(props);
    this.node = React.createRef();
  }

  componentDidMount() {
    const { onGetInvoiceDetail } = this.props;
    onGetInvoiceDetail(this.props.match.params.id);
  }

  //Print the Invoice
  printInvoice = () => {
    window.print();
  };

  sendInvoice = () => {
    const { node } = this;
  
    if (node && node.current) {
      const scale = 2; // Adjust this value as needed
      const options = {
        scale: scale,
        dpi: 300, // Adjust the DPI value as needed
      };
  
      html2canvas(node.current, options).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape
        pdf.addImage(imgData, 'PNG', 0, 0, 297, 210); // Swap width and height for landscape
        pdf.save('LabHazir_Invoice.pdf');
      });
    }
  };
  
  

  render() {
    return (
      <React.Fragment>
        <div ref={this.node} className="page-content">
          <MetaTags>
            <title>Invoice | Lab Hazir - Dashboard</title>
          </MetaTags>
          <Container fluid>
            {/* Render Breadcrumbs */}
            <Breadcrumbs title="Invoices" breadcrumbItem="Invoice" />
            {!isEmpty(this.props.invoiceDetail) && (
              <Row>
                <Col lg="12">
                  <Card>
                    <CardBody>
                      <div className="invoice-title">
                        <h4 className="float-end font-size-16">
                          Order ID: {this.props.invoiceDetail[0].order_id}
                        </h4>
                        <div className="mb-4">
                          <img src={logo} alt="logo" height="20" />
                        </div>
                      </div>
                      <hr />
                      <Row>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Patient Detail:</strong>
                            <br />
                            <span className="text-danger">Name:</span> {this.props.invoiceDetail[0].patient_name}
                            <br />
                            <span className="text-danger">Phone:</span> {this.props.invoiceDetail[0].patient_phone}
                            <br />
                            <span className="text-danger">Email:</span> {this.props.invoiceDetail[0].patient_email}
                            <br />
                            <span className="text-danger">Age:</span> {this.props.invoiceDetail[0].patient_age} (<span style={{ color: "red" }}>{this.props.invoiceDetail[0].ageFormat}</span>)
                            {this.props.invoiceDetail[0].patient_address != null ? (
                              <div>
                                <span className="text-danger">Address:</span> {this.props.invoiceDetail[0].patient_address}
                              </div>
                            ) : null}
                          </address>
                        </Col>

                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Lab Detail:</strong>
                            <br />
                            <span className="text-danger">NTN #:</span> {this.props.invoiceDetail[0].lab_ntn}
                            <br />
                            <span className="text-danger">Lab Name:</span> {this.props.invoiceDetail[0].lab_name}
                            <br />
                            <span className="text-danger">Lab Email:</span> {this.props.invoiceDetail[0].lab_email}
                            <br />
                            <span className="text-danger">Lab Address:</span> {this.props.invoiceDetail[0].lab_address}
                            <br />
                            {this.props.invoiceDetail[0].estimated_sample_collection_at !== null ? (
                              <>
                                <span className="text-danger">Sampling Date Time by Lab:</span>{" "}
                                {this.props.invoiceDetail[0].estimated_sample_collection_at
                                ? moment(this.props.invoiceDetail[0].estimated_sample_collection_at).format("DD MMM YYYY, h:mm A")
                                : "--"}
                                {/* {new Date(this.props.invoiceDetail[0].estimated_sample_collection_at).toLocaleString("en-US")} */}
                              </>
                            ) : null}
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
                            {this.props.invoiceDetail[0].payment_method}
                            <br />
                            {this.props.invoiceDetail[0].payment_status}
                            <br />
                            {this.props.invoiceDetail[0].payment_method ==
                              "Card" ? (
                              <>
                                {/* {new Date(
                                  this.props.invoiceDetail[0].paid_at
                                ).toLocaleString("en-US")} */}
                                 {this.props.invoiceDetail[0].paid_at
                                ? moment(this.props.invoiceDetail[0].paid_at).format("DD MMM YYYY, h:mm A")
                                : "--"}
                              </>
                            ) : null}
                          </address>
                        </Col>

                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Order Detail:</strong>
                            <br /><span className="text-danger">Invoice Generated Date Time: </span>
                            
                            {this.props.invoiceDetail[0].invoice_generated_at
                                ? moment(this.props.invoiceDetail[0].invoice_generated_at).format("DD MMM YYYY, h:mm A")
                                : "--"}
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
                              <th className="text-start">Test Name</th>
                              <th className="text-start">Test Type</th>
                              <th className="text-end">Price</th>
                              <th className="text-end">Discount By Lab (Rs)</th>
                              <th className="text-end">Discount By LabHazir (Rs)</th>
                              {/* <th className="text-end">Discount</th> */}
                              <th className="text-end">
                                Sub Total
                              </th>

                            </tr>
                          </thead>
                          <tbody>
                            {map(
                              this.props.invoiceDetail[0].items,
                              (item, key) => (
                                <tr key={key}>
                                  <td>{key + 1}</td>
                                  <td className="text-start">{item.test_name}</td>
                                  <td className="text-start">{item.test_categories}</td>
                                  <td className="text-end">{item.price.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                  <td className="text-end">{item.discount.toFixed(0)}{"%"}</td>
                                  <td className="text-end">{(item.discount_by_labhazir + item.discount_by_labhazird_by_test).toFixed(0)}{"%"}</td>
                                  {/* <td className="text-end">{item.discount_by_labhazird_by_test}</td> */}
                                  <td className="text-end">
                                    {item.total_appointment.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      //  -
                                      //   this.props.invoiceDetail[0]
                                      //     .home_sampling_charges
                                    }
                                  </td>
                                </tr>
                              )
                            )}
                            <tr>
                              <td colSpan="6" className="border-0 text-end">
                                <strong>Sampling Fee</strong>
                              </td>
                              <td className="border-10 text-end">
                                {
                                  this.props.invoiceDetail[0]
                                    .home_sampling_charges.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="6" className="border-0 text-end">
                                <strong>Platform Charges</strong>
                              </td>
                              <td className="border-10 text-end">
                                {
                                  this.props.invoiceDetail[0]
                                    .charges_except_total_dues.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                }
                              </td>
                            </tr>
                            <tr>
                              <td colSpan="6" className="border-10 text-end">
                                <strong>Total</strong>
                              </td>
                              <td className="border-10 text-end">
                                <h4 className="m-0">
                                  {(this.props.invoiceDetail[0].total_dues +
                                    this.props.invoiceDetail[0]
                                      .home_sampling_charges).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </h4>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                      <div> <span className="text-danger font-size-12">
                        <strong>
                          Note: Numbers may not add up due to rounding, it is inconsequential enough to be ignored.
                        </strong>
                      </span>
                      </div>

                      <div className="d-print-none">

                        <div className="float-end">
                          <Link
                            to="#"
                            onClick={this.printInvoice}
                            className="btn btn-success me-1"
                          >
                            <i className="fa fa-print" />
                          </Link>{" "}
                          {/* <Link to="#" className="btn btn-primary w-md">
                            Send
                          </Link> */}
                          <button className="btn btn-success me-1" onClick={this.sendInvoice}>Download</button>

                        </div>
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

InvoiceDetail.propTypes = {
  match: PropTypes.object,
  invoiceDetail: PropTypes.object,
  onGetInvoiceDetail: PropTypes.func,
};

const mapStateToProps = ({ invoices }) => ({
  invoiceDetail: invoices.invoiceDetail,
});

const mapDispatchToProps = dispatch => ({
  onGetInvoiceDetail: id => dispatch(getInvoiceDetail(id)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(InvoiceDetail));