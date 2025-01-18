import PropTypes, { any } from "prop-types";
import Select from "react-select";
import React, { Component } from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
} from "reactstrap";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

// Redux
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

// actions
import { updateLabPayments, getLabPayments } from "store/auth/payments/actions";

class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      counter_discount: "0",
      amount_received: "",
      received_by:"",
      payment_method: "Cash",
      isPaymentUpdated: false,
      isPaymentFailed: false,

      // id: localStorage.getItem("authUser")
      //   ? JSON.parse(localStorage.getItem("authUser")).id
      //   : "",
    };
  }

  componentDidMount() {
    console.log("test appointment id: ", this.props.match.params.id);
    setTimeout(() => {
      console.log(this.props.getLabPayments(this.props.match.params.id));
    }, 1000);

    setTimeout(() => {
      this.setState({
        amount: this.props.success.amount,
        payment_method: this.props.payment_method,
        counter_discount: this.props.success.counter_discount,
        amount_received: this.props.success.amount_received,
        received_by: this.props.success.received_by,
      });
    }, 2000);
  }

  render() {
    console.log(" amount: ", this.props.success.amount);

    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumb title="Donor" breadcrumbItem="Payment Update" />
           {
             this.state.isPaymentUpdated && this.state.isPaymentUpdated ? (
              <Alert color="success">Payment Status Updated.</Alert>
            ) : null}

            {/* <h4 className="card-title mb-4">Update B2BClient Profile</h4> */}
            {
             this.state.isPaymentFailed && this.state.isPaymentFailed ? (
              <Alert color="danger"><b>Make sure Amount Received and Counter Discount equal to Total Amount.</b></Alert>
            ) : null}

            {/* <h4 className="card-title mb-4">Update B2BClient Profile</h4> */}

            <Card>
              <CardBody>
                <Formik
                  enableReinitialize={true}
                  initialValues={{
                    amount: (this.state && this.state.amount) || "",
                    payment_method: (this.state && this.state.payment_method) || "Cash",
                    counter_discount: (this.state && this.state.counter_discount) ||"0",
                    amount_received: (this.state && this.state.amount_received) || "",
                    received_by: (this.state && this.state.received_by) || "",
                  }}
                  validationSchema={Yup.object().shape({
                    amount_received: Yup.number(
                      "Please enter received amount"
                    )
                      .positive()
                      .integer()
              
                      .test(
                        "required",
                        "Please enter Receiving Amount",
                        function (val) {
                          const { amount_received } =
                            this.parent;
                          if (amount_received !== "amount") {
                            return amount_received ? true : false;
                          } else {
                            return true;
                          }
                        }
                      ),
                     
                    // amount: Yup.string()
                    //   .trim()
                    //   .required("Please enter your amount")
                    //   .min(3, "Please enter at least 3 characters")
                    //   .max(255, "Please enter maximum 255 characters")
                    //   .matches(
                    //     /^[a-zA-Z][a-zA-Z ]+$/,
                    //     "Please enter only alphabets and spaces"
                    //   ),
                    // amount_received: Yup.string()
                    //   .required("Please enter your amount_received")
                    //   .amount_received("Please enter valid amount_received")
                    //   .max(255, "Please enter maximum 255 characters"),
                    // counter_discount: Yup.string()
                    //   .required("Please enter your counter_discount no.")
                    //   .max(255, "Please enter maximum 255 characters")
                    //   .matches(
                    //     /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{10}$|^\d{3}-\d{7}|^\d{11}$|^\d{3}-\d{8}$/,
                    //     "Please enter a valid Pakistani counter_discount number"
                    //   ),
                  })}
                  onSubmit={values => {
                     // If no error messages then show wait message
                    //  setTimeout(() => {
                     if ((Number(this.state.counter_discount) + Number(this.state.amount_received))==Number(this.state.amount)) {
                      console.log("Amount:",this.state.amount);
                      console.log("Smount:",this.state.counter_discount);
                      console.log("Rmount:",this.state.amount_received);
                      this.setState({ isPaymentUpdated: true }
                        );
                      setTimeout(() => {
                        this.props.history.push("/in-process-test-appointments");}, 3000);
                      
                     }
                     
                     if (this.state.amount !== (Number(this.state.counter_discount) + Number(this.state.amount_received))) {
                      console.log("hell",this.state.counter_discount + this.state.amount_received)
                      this.setState({ isPaymentFailed: true });
                     }              
                      
                     window.scrollTo({top: 0, left: 0, behavior: 'smooth'});

                    // To get updated profile again
                    setTimeout(() => {
                      this.props.updateLabPayments(
                        values,
                        this.props.match.params.id
                      );

                      // To get updated settings again
                      setTimeout(() => {
                        this.props.getLabPayments(this.props.match.params.id);
                      }, 1000);

                      // To make success message disappear after sometime
                      setTimeout(() => {
                        this.setState({
                          isPaymentUpdated: false,
                        });
                      }, 5000);
                      setTimeout(() => {
                        this.setState({
                          isPaymentFailed: false,
                        });
                      }, 5000);
                    }, 2000);
                  }}
                >
                  {({ errors, status, touched }) => (
                    <Form className="form-horizontal">
                      <div className="mb-3">
                        <Label for="amount" className="form-label">
                          Total Dues
                        </Label>
                        <Field
                          id="amount"
                          name="amount"
                          type="text"
                          readOnly={true}
                          onChange={e =>
                            this.setState({
                              amount: e.target.value,
                            })
                          }
                          value={this.state.amount}
                          className={
                            "form-control" +
                            (errors.amount && touched.amount
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="amount"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      <div className="mb-3">
                        <Label for="payment_method" className="form-label">
                          Payment Method
                        </Label>
                        <Field
                          id="payment_method"
                          name="payment_method"
                          type="text"
                          readOnly={true}
                          onChange={e =>
                            this.setState({
                              payment_method: e.target.value,
                            })
                          }
                          value={this.state.payment_method}
                          className={
                            "form-control" +
                            (errors.payment_method && touched.payment_method
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="payment_method"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                     
                      {/* phone field */}
                      <div className="mb-3">
                        <Label for="counter_discount" className="form-label">
                          Counter Discount
                        </Label>
                        <Field
                          id="counter_discount"
                          name="counter_discount"
                          type="text"
                          onChange={e =>
                            this.setState({
                              counter_discount: e.target.value,
                            })
                          }
                          value={this.state.counter_discount}
                          className={
                            "form-control" +
                            (errors.counter_discount && touched.counter_discount
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="counter_discount"
                          component="div"
                          className="invalid-feedback"
                        />
                        <span className="text-primary font-size-12">
                                    <strong>
                                      Note: If any Kind of Counter Discount has been given, then this must be written.
                                    </strong>
                                  </span>
                      </div>

                       {/* phone field */}
                       <div className="mb-3">
                        <Label for="amount_received" className="form-label">
                          Amount Received
                        </Label>
                        <Field
                          id="amount_received"
                          name="amount_received"
                          type="text"
                          onChange={e =>
                            this.setState({
                              amount_received: e.target.value,
                            })
                          }
                          value={this.state.amount_received}
                          className={
                            "form-control" +
                            (errors.amount_received && touched.amount_received
                              ? " is-invalid"
                              : "")
                          }
                        />
                        <ErrorMessage
                          name="amount_received"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>

                       {/* Email field */}
                       <div className="mb-3">
                        <Label for="received_by" className="form-label">
                          Received By
                        </Label>
                        <Field
                          name="received_by"
                          type="text"
                          onChange={e =>
                            this.setState({ received_by: e.target.value })
                          }
                          value={this.state.received_by}
                          className={
                            "form-control" +
                            (errors.received_by && touched.received_by ? " is-invalid" : "")
                          }
                        />
                        <ErrorMessage
                          name="received_by"
                          component="div"
                          className="invalid-feedback"
                        />
                      </div>
                      

                      <div className="text-center mt-4">
                        <Button type="submit" color="danger"
                         disabled={this.state.isPaymentUpdated}
                        >
                          Update
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Payments.propTypes = {
  match: PropTypes.object,
  history: any,
  location: PropTypes.object,
  payment_method: PropTypes.object,
  updateLabPayments: PropTypes.func,
  error: PropTypes.any,
  success: PropTypes.any,
  getLabPayments: PropTypes.func,
};

const mapStateToProps = state => {
  const { error, success } = state.Payments;
  console.log("Total Payment: ", state.Payments.success);
  return { error, success };
};

export default withRouter(
  connect(mapStateToProps, {
    updateLabPayments,
    getLabPayments,
  })(Payments)
);