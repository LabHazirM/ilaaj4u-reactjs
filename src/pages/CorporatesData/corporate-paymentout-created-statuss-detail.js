import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button, Table } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { isEmpty, map, split } from "lodash";
import moment from 'moment';


const PaymentStatussList = (props) => {
  const [paymentStatuss, setPaymentStatuss] = useState({});
  const { id } = props.match.params;
  const printRef = useRef();

  useEffect(() => {
    const fetchPaymentStatuss = async () => {
      try {
        const response = await axios.get(`http://labhazirapi.com/api/corporate/corporate-payment-detail/${id}`);
        setPaymentStatuss(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentStatuss();
  }, [id]);

  const paymentDetail = paymentStatuss.data ? paymentStatuss.data[0] : {};

  useEffect(() => {
    console.log("Payment Detail:", paymentDetail);
  }, [paymentDetail]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current);
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, -heightLeft, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('payment_details.pdf');
    }
  };

  return (
    <div className="page-content">
      <MetaTags>
        <title>Payments Detail | Lab Hazir</title>
      </MetaTags>
      <Container fluid>
        <Breadcrumbs title="Payment" breadcrumbItem="Detail" />

        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div ref={printRef}>
                  {paymentDetail ? (
                    <div>
                      <Row>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Corporate ID: </strong>
                            <span className="text-danger">{paymentDetail.corporate_id}</span> 
                          </address>
                        </Col>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Payment Form ID: </strong>
                            <span className="text-danger">{paymentDetail.id}</span> 
                          </address>
                        </Col>
                      </Row>
                      <Row>
                      
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Amount: </strong>
                            <span className="text-danger">{paymentDetail.amount}</span> 
                          </address>
                        </Col>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Payment Method: </strong>
                            <span className="text-danger" style={{ marginRight: '5px' }}>{paymentDetail.payment_method}</span> 
                          </address>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Payment For: </strong>
                            <span className="text-danger">{paymentDetail.payment_for}</span> 
                          </address>
                        </Col>
                        <Col sm="4" className="mt-3">
                          <address>
                            <strong>Payment Date: </strong>
                            {/* <br /> */}
                            <span className="text-danger" style={{ marginRight: '5px' }}>{paymentDetail.payment_at}</span> 
                            {/* <br /> */}
                          </address>
                        </Col>
                      </Row>
                      <div className="py-2 mt-3">
                        <h3 className="font-size-15 font-weight-bold">Detail of Appointment</h3>
                      </div>
                      <div className="table-responsive">
                        <Table className="table-nowrap">
                          <thead>
                            <tr>
                              <th className="text-start">Lab Name</th>
                              <th className="text-start">Type</th>
                              <th className="text-start">Employee Name</th>
                              <th className="text-start">Employee Type</th>
                              <th className="text-start">Appointment ID</th>
                              <th className="text-start">Lab Payable</th>
                              <th className="text-start">Labhazir Payable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paymentDetail.items && paymentDetail.items.length > 0 ? (
                              paymentDetail.items.map((item, key) =>
                                item.test_appointment_id ? item.test_appointment_id.split(',').map((appointment_id, subKey) => (
                                  <tr key={`${key}-${subKey}`}>
                                    <td className="text-start">{item.lab_name}</td>
                                    <td className="text-start">{item.payment_for}</td>
                                    <td className="text-start">{item.employee_name || ''}</td>
                                    <td className="text-start">{item.employee_type || ''}</td>
                                    <td className="text-start">{appointment_id.trim()}</td>
                                    <td className="text-start">
                                      {item.payment_for.toLowerCase() === 'lab' ? item.amount : '0'}
                                    </td>
                                    <td className="text-start">
                                      {item.payment_for.toLowerCase() === 'labhazir' ? item.amount : '0'}
                                    </td>
                                  </tr>
                                )) : null
                              )
                            ) : (
                              paymentDetail.test_appointment_id ? paymentDetail.test_appointment_id.split(',').map((appointment_id, key) => (
                                <tr key={key}>
                                  <td className="text-start">{paymentDetail.lab_name || ''}</td>
                                  <td className="text-start">{paymentDetail.payment_for || ''}</td>
                                  <td className="text-start">{paymentDetail.employee_name || ''}</td>
                                  <td className="text-start">{paymentDetail.employee_type || ''}</td>
                                  <td className="text-start">{appointment_id.trim() || ''}</td>
                                  <td className="text-start">
                                    {paymentDetail.payment_for.toLowerCase() === 'lab' ? paymentDetail.amount : '0'}
                                  </td>
                                  <td className="text-start">
                                    {paymentDetail.payment_for.toLowerCase() === 'labhazir' ? paymentDetail.amount : '0'}
                                  </td>
                                </tr>
                              )) : null
                            )}
                          </tbody>
                        </Table>


                      </div>
                    </div>
                  ) : (
                    <p>No payment details available.</p>
                  )}
                </div>
                <Button color="primary" onClick={handlePrint}>Print</Button>
                <Button color="secondary" onClick={handleDownload} style={{ marginLeft: "10px" }}>Download PDF</Button>
              </CardBody>
            </Card>

          </Col>
        </Row>
      </Container>
    </div>
  );
};

PaymentStatussList.propTypes = {
  match: PropTypes.object,
};

export default withRouter(PaymentStatussList);
