import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import MetaTags from "react-meta-tags";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Container, Row, Button } from "reactstrap";
import Breadcrumbs from "components/Common/Breadcrumb";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentStatussList = (props) => {
  const [paymentStatuss, setPaymentStatuss] = useState({});
  const { id } = props.match.params;
  const printRef = useRef();

  useEffect(() => {
    const fetchPaymentStatuss = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/corporate/corporate-payment-detail/${id}`);
        setPaymentStatuss(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      }
    };

    fetchPaymentStatuss();
  }, [id]);

  const paymentDetail = paymentStatuss.data ? paymentStatuss.data[0] : {};

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
        <Breadcrumbs title="List" breadcrumbItem="Payments" />
        <Row>
          <Col lg="12">
            <Card>
              <CardBody>
                <div ref={printRef}>
                  {paymentDetail ? (
                    <div>
                      <p><strong>Corporate:</strong> {paymentDetail.corporate_id}</p>
                      <p><strong>Payment Form ID:</strong> {paymentDetail.id}</p>
                      <p><strong>Payment For:</strong> {paymentDetail.payment_for}</p>
                      <p><strong>Payment Date:</strong> {paymentDetail.payment_at}</p>
                      <p><strong>Amount:</strong> {paymentDetail.amount}</p>
                      <p><strong>Lab ID:</strong> {paymentDetail.lab_id}</p>
                      <p><strong>Appointments ID:</strong> {paymentDetail.test_appointment_id}</p>
                      <p><strong>Payment Method:</strong> {paymentDetail.payment_method}</p>
                      <p><strong>Payment Status:</strong> {paymentDetail.payment_status}</p>
                      <p><strong>Comments:</strong> {paymentDetail.comments}</p>
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
